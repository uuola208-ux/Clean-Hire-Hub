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
import { Users, UserPlus, UserCheck, UserX, Search, Eye, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

const getStatusColor = (status: string) => {
  switch (status) {
    case ApplicationStatus.pending:    return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
    case ApplicationStatus.shortlisted: return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
    case ApplicationStatus.hired:      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
    case ApplicationStatus.rejected:   return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatPosition = (pos: string) =>
  pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useGetApplicationStats();

  const { data: listData, isLoading: listLoading } = useListApplications({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    position: positionFilter !== "all" ? positionFilter : undefined,
    page,
    limit: PAGE_SIZE,
  });

  const totalPages = Math.ceil((listData?.total ?? 0) / PAGE_SIZE);

  // Reset to page 1 when filters change
  const handleSearchChange = (v: string) => { setSearchTerm(v); setPage(1); };
  const handleStatusChange = (v: string) => { setStatusFilter(v); setPage(1); };
  const handlePositionChange = (v: string) => { setPositionFilter(v); setPage(1); };

  // CSV Export – fetches all matching applications without pagination
  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (positionFilter !== "all") params.set("position", positionFilter);
      params.set("limit", "10000");

      const res = await fetch(`/api/applications?${params.toString()}`);
      const json = await res.json();
      const apps: any[] = json.applications ?? [];

      const headers = [
        "ID", "Full Name", "Email", "Phone", "Date of Birth", "Nationality",
        "Position", "Availability", "NI Number", "Right to Work", "Driving Licence",
        "Status", "Admin Notes", "Applied Date",
      ];

      const rows = apps.map((a: any) => [
        a.id, a.fullName, a.email, a.phone, a.dateOfBirth, a.nationality,
        formatPosition(a.positionApplying), a.availability, a.niNumber ?? "",
        a.rightToWorkUk ? "Yes" : "No",
        a.hasDrivingLicence ? "Yes" : "No",
        a.status, a.adminNotes ?? "",
        format(new Date(a.createdAt), "dd/MM/yyyy HH:mm"),
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map((cell: any) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tjfreshspace-applications-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const pendingCount     = stats?.byStatus?.find(s => s.label === "pending")?.count     ?? 0;
  const shortlistedCount = stats?.byStatus?.find(s => s.label === "shortlisted")?.count ?? 0;
  const hiredCount       = stats?.byStatus?.find(s => s.label === "hired")?.count       ?? 0;
  const rejectedCount    = stats?.byStatus?.find(s => s.label === "rejected")?.count    ?? 0;

  return (
    <div className="container mx-auto px-4 max-w-7xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Applications Dashboard</h1>
          <p className="text-foreground/60 mt-1">Manage and track recruitment progress.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full gap-2"
            onClick={handleExportCSV}
            disabled={listLoading || (listData?.total ?? 0) === 0}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards — 5 cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            icon: <Users className="w-5 h-5 text-primary" />,
            bg: "bg-primary/5",
            label: "Total",
            value: statsLoading ? "..." : stats?.total ?? 0,
            sub: <><span className="text-green-600 font-medium">+{stats?.recentCount ?? 0}</span> this week</>,
          },
          {
            icon: <UserPlus className="w-5 h-5 text-amber-600" />,
            bg: "bg-amber-100",
            label: "Pending",
            value: statsLoading ? "..." : pendingCount,
            sub: "Awaiting review",
          },
          {
            icon: <UserCheck className="w-5 h-5 text-blue-600" />,
            bg: "bg-blue-100",
            label: "Shortlisted",
            value: statsLoading ? "..." : shortlistedCount,
            sub: "In interview stage",
          },
          {
            icon: <UserCheck className="w-5 h-5 text-green-600" />,
            bg: "bg-green-100",
            label: "Hired",
            value: statsLoading ? "..." : hiredCount,
            sub: "Successfully placed",
          },
          {
            icon: <UserX className="w-5 h-5 text-red-500" />,
            bg: "bg-red-100",
            label: "Rejected",
            value: statsLoading ? "..." : rejectedCount,
            sub: "Not progressed",
          },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-start mb-3">
              <div className={`${card.bg} p-2 rounded-lg`}>{card.icon}</div>
              <span className="text-xs font-medium text-foreground/50">{card.label}</span>
            </div>
            <h3 className="text-3xl font-bold text-primary mb-1">{card.value}</h3>
            <p className="text-xs text-foreground/60">{card.sub}</p>
          </div>
        ))}
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
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="h-4 w-4 text-foreground/40" />
            <Select value={statusFilter} onValueChange={handleStatusChange}>
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
            <Select value={positionFilter} onValueChange={handlePositionChange}>
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
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase shrink-0">
                          {app.fullName.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-primary">{app.fullName}</div>
                          <div className="text-xs text-foreground/60">{app.email}</div>
                          <div className="text-xs text-foreground/60">{app.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{formatPosition(app.positionApplying)}</span>
                      <div className="text-xs text-foreground/50 flex gap-2 mt-1">
                        <span title="Right to Work">RTW: {app.rightToWorkUk ? "✓" : "✗"}</span>
                        <span>•</span>
                        <span title="Driving Licence">Drive: {app.hasDrivingLicence ? "✓" : "✗"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(app.createdAt), "dd MMM yyyy")}
                      <div className="text-xs text-foreground/50">{format(new Date(app.createdAt), "HH:mm")}</div>
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

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-foreground/60">
          <div>
            Showing {listData?.applications.length ?? 0} of {listData?.total ?? 0} results
            {totalPages > 1 && <span className="ml-1">(page {page} of {totalPages})</span>}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
