import { useParams, Link, useLocation } from "wouter";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetApplication, 
  useUpdateApplicationStatus, 
  useDeleteApplication,
  useListDocuments,
  getGetApplicationQueryKey,
  getListApplicationsQueryKey,
  ApplicationStatusInputStatus
} from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, FileText, Download, Calendar, Mail, Phone, MapPin, 
  CarFront, IdCard, Trash2, Save, ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case ApplicationStatusInputStatus.pending: return "bg-amber-100 text-amber-800 border-amber-200";
    case ApplicationStatusInputStatus.shortlisted: return "bg-blue-100 text-blue-800 border-blue-200";
    case ApplicationStatusInputStatus.hired: return "bg-green-100 text-green-800 border-green-200";
    case ApplicationStatusInputStatus.rejected: return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatPosition = (pos: string) => {
  return pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const formatDocType = (type: string) => {
  return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function ApplicantDetail() {
  const { id } = useParams();
  const appId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState("");

  const { data: app, isLoading: appLoading } = useGetApplication(appId, {
    query: { enabled: !!appId, queryKey: getGetApplicationQueryKey(appId) }
  });

  const { data: documents, isLoading: docsLoading } = useListDocuments(appId, {
    query: { enabled: !!appId, queryKey: ['documents', appId] as any }
  });

  const updateStatus = useUpdateApplicationStatus();
  const deleteApp = useDeleteApplication();

  useEffect(() => {
    if (app && app.adminNotes) {
      setNotes(app.adminNotes);
    }
  }, [app]);

  if (appLoading) {
    return <div className="container mx-auto p-10 text-center">Loading applicant details...</div>;
  }

  if (!app) {
    return <div className="container mx-auto p-10 text-center">Applicant not found.</div>;
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        id: appId,
        data: { status: newStatus as ApplicationStatusInputStatus, adminNotes: notes }
      });
      queryClient.invalidateQueries({ queryKey: getGetApplicationQueryKey(appId) });
      queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
      toast({ title: "Status Updated", description: `Application status changed to ${newStatus}.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const handleSaveNotes = async () => {
    try {
      await updateStatus.mutateAsync({
        id: appId,
        data: { status: app.status as ApplicationStatusInputStatus, adminNotes: notes }
      });
      queryClient.invalidateQueries({ queryKey: getGetApplicationQueryKey(appId) });
      toast({ title: "Notes Saved", description: "Admin notes updated successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save notes." });
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this application? This cannot be undone.")) {
      try {
        await deleteApp.mutateAsync({ id: appId });
        queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
        toast({ title: "Application Deleted" });
        setLocation('/admin');
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete application." });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl pb-24">
      <Link href="/admin">
        <Button variant="ghost" className="mb-6 -ml-4 text-foreground/60 hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl uppercase">
            {app.fullName.substring(0, 2)}
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">{app.fullName}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-foreground/70 font-medium">{formatPosition(app.positionApplying)}</span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/50 text-sm">Applied {format(new Date(app.createdAt), 'd MMM yyyy')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-border shadow-sm">
          <span className="text-sm font-medium text-foreground/60 pl-2">Status:</span>
          <Select value={app.status} onValueChange={handleStatusChange}>
            <SelectTrigger className={`w-[150px] font-semibold border-0 ${getStatusColor(app.status)}`}>
              <SelectValue className="capitalize" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-2" onClick={handleDelete} title="Delete Application">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
            <h3 className="text-lg font-bold font-serif text-primary border-b border-border pb-4 mb-6">Candidate Profile</h3>
            
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8 mb-8">
              <div>
                <span className="text-sm text-foreground/50 flex items-center gap-2 mb-1"><Mail className="h-4 w-4" /> Email</span>
                <a href={`mailto:${app.email}`} className="font-medium text-primary hover:underline">{app.email}</a>
              </div>
              <div>
                <span className="text-sm text-foreground/50 flex items-center gap-2 mb-1"><Phone className="h-4 w-4" /> Phone</span>
                <a href={`tel:${app.phone}`} className="font-medium text-primary hover:underline">{app.phone}</a>
              </div>
              <div>
                <span className="text-sm text-foreground/50 flex items-center gap-2 mb-1"><Calendar className="h-4 w-4" /> Date of Birth</span>
                <span className="font-medium">{format(new Date(app.dateOfBirth), 'dd MMM yyyy')}</span>
              </div>
              <div>
                <span className="text-sm text-foreground/50 flex items-center gap-2 mb-1"><IdCard className="h-4 w-4" /> Nationality</span>
                <span className="font-medium">{app.nationality}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-sm text-foreground/50 flex items-center gap-2 mb-1"><MapPin className="h-4 w-4" /> Address</span>
                <span className="font-medium block whitespace-pre-line">{app.address}</span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-5 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${app.rightToWorkUk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {app.rightToWorkUk ? <IdCard className="h-5 w-5" /> : <IdCard className="h-5 w-5" />}
                </div>
                <div>
                  <div className="text-xs text-foreground/50">Right to Work in UK</div>
                  <div className="font-bold">{app.rightToWorkUk ? 'Yes' : 'No'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${app.hasDrivingLicence ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {app.hasDrivingLicence ? <CarFront className="h-5 w-5" /> : <CarFront className="h-5 w-5" />}
                </div>
                <div>
                  <div className="text-xs text-foreground/50">Driving Licence</div>
                  <div className="font-bold">{app.hasDrivingLicence ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
            <h3 className="text-lg font-bold font-serif text-primary border-b border-border pb-4 mb-6">Experience & Availability</h3>
            
            <div className="space-y-6">
              <div>
                <span className="text-sm text-foreground/50 block mb-2 font-medium">Availability</span>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/50 text-sm font-medium">
                  {app.availability}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-foreground/50 block mb-2 font-medium">Previous Experience</span>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/50 text-sm whitespace-pre-line leading-relaxed min-h-[100px]">
                  {app.previousExperience || <span className="italic text-foreground/40">No experience provided.</span>}
                </div>
              </div>
              
              {app.niNumber && (
                <div>
                  <span className="text-sm text-foreground/50 block mb-1 font-medium">National Insurance Number</span>
                  <div className="font-mono text-sm tracking-wider uppercase bg-gray-100 inline-block px-3 py-1 rounded">
                    {app.niNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Documents */}
          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
            <h3 className="font-bold font-serif text-primary mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" /> Documents
            </h3>
            
            {docsLoading ? (
              <p className="text-sm text-foreground/50">Loading documents...</p>
            ) : documents && documents.length > 0 ? (
              <ul className="space-y-3">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-secondary/10 p-2 rounded-lg text-secondary shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium truncate">{formatDocType(doc.documentType)}</div>
                        <div className="text-xs text-foreground/50 truncate" title={doc.originalName}>{doc.originalName}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 text-foreground/40 group-hover:text-secondary" asChild>
                      <a
                        href={`/api/applications/${appId}/documents/${doc.id}/download`}
                        download={doc.originalName}
                        aria-label={`Download ${formatDocType(doc.documentType)} for ${app.fullName}`}
                        title="Download document"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-6 bg-muted/30 rounded-xl border border-dashed border-border">
                <FileText className="h-8 w-8 text-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-foreground/50">No documents uploaded.</p>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div className="bg-primary/5 rounded-3xl border border-primary/10 p-6">
            <h3 className="font-bold font-serif text-primary mb-4 flex items-center gap-2">
              Internal Notes
            </h3>
            <Textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview notes, reference checks, etc..."
              className="min-h-[150px] mb-4 bg-white resize-none"
            />
            <Button onClick={handleSaveNotes} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={updateStatus.isPending}>
              {updateStatus.isPending ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Notes</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
