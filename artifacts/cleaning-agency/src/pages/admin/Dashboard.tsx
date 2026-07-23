import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useListApplications, useGetApplicationStats } from "@workspace/api-client-react";
import { ApplicationStatus } from "@workspace/api-client-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, UserCheck, UserX, Search, Eye, Filter } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case ApplicationStatus.pending: return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
    case ApplicationStatus.shortlisted: return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
    case ApplicationStatus.hired: return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
    case ApplicationStatus.rejected: return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatPosition = (pos: string) => {
  return pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");

  const { data: stats, isLoading: statsLoading } = useGetApplicationStats();
  
  const { data: listData, isLoading: listLoading } = useListApplications({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter as any : undefined,
    position: positionFilter !== "all" ? positionFilter : undefined,
  });

  return (
    <div className="container mx-auto px-4 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Applications Dashboard</h1>
          <p className="text-foreground/60 mt-1">Manage and track recruitment progress.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">Export CSV</Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full">Add Applicant Manually</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary/5 p-2 rounded-lg"><Users className="w-5 h-5 text-primary" /></div>
            <span className="text-xs font-medium text-foreground/50">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-primary mb-1">
            {statsLoading ? "..." : stats?.total || 0}
          </h3>
          <p className="text-xs text-foreground/60"><span className="text-green-600 font-medium">+{stats?.recentCount || 0}</span> this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-100 p-2 rounded-lg"><UserPlus className="w-5 h-5 text-amber-600" /></div>
            <span className="text-xs font-medium text-foreground/50">Pending</span>
          </div>
          <h3 className="text-3xl font-bold text-primary mb-1">
            {statsLoading ? "..." : stats?.byStatus?.find(s => s.label === 'pending')?.count || 0}
          </h3>
          <p className="text-xs text-foreground/60">Awaiting review</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-2 rounded-lg"><UserCheck className="w-5 h-5 text-blue-600" /></div>
            <span className="text-xs font-medium text-foreground/50">Shortlisted</span>
          </div>
          <h3 className="text-3xl font-bold text-primary mb-1">
            {statsLoading ? "..." : stats?.byStatus?.find(s => s.label === 'shortlisted')?.count || 0}
          </h3>
          <p className="text-xs text-foreground/60">In interview stage</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-100 p-2 rounded-lg"><UserCheck className="w-5 h-5 text-green-600" /></div>
            <span className="text-xs font-medium text-foreground/50">Hired</span>
          </div>
          <h3 className="text-3xl font-bold text-primary mb-1">
            {statsLoading ? "..." : stats?.byStatus?.find(s => s.label === 'hired')?.count || 0}
          </h3>
          <p className="text-xs text-foreground/60">Successfully placed</p>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <Input 
              placeholder="Search name, email or phone..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="h-4 w-4 text-foreground/40" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="domestic-cleaner">Domestic Cleaner</SelectItem>
                <SelectItem value="commercial-cleaner">Commercial Cleaner</SelectItem>
                <SelectItem value="office-cleaner">Office Cleaner</SelectItem>
                <SelectItem value="housekeeping">Housekeeping</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 hover:bg-muted/10">
                <TableHead>Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-foreground/50">
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : listData?.applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-foreground/50">
                      <UserX className="h-10 w-10 mb-2 opacity-20" />
                      <p>No applications found matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                listData?.applications.map((app) => (
                  <TableRow key={app.id} className="group">
                    <TableCell>
                      <div className="font-medium text-primary">{app.fullName}</div>
                      <div className="text-xs text-foreground/60">{app.email}</div>
                      <div className="text-xs text-foreground/60">{app.phone}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{formatPosition(app.positionApplying)}</span>
                      <div className="text-xs text-foreground/50 flex gap-2 mt-1">
                        <span title="Right to Work">UK RTW: {app.rightToWorkUk ? '✓' : '✗'}</span>
                        <span>•</span>
                        <span title="Driving Licence">Drive: {app.hasDrivingLicence ? '✓' : '✗'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(app.createdAt), 'dd MMM yyyy')}
                      <div className="text-xs text-foreground/50">{format(new Date(app.createdAt), 'HH:mm')}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${getStatusColor(app.status)}`}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/applications/${app.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-full bg-primary/5 text-primary hover:bg-primary/10">
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-foreground/60">
          <div>Showing {listData?.applications.length || 0} of {listData?.total || 0} results</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
