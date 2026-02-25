import { useApplications, useCreateApplication, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useCourses } from "@/hooks/use-courses";
import { useUserProfile } from "@/hooks/use-profiles";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Applications() {
  const { data: applications, isLoading } = useApplications();
  const { data: courses } = useCourses();
  const { data: profile } = useUserProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplicationStatus();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const isStaff = profile?.role === 'admin' || profile?.role === 'clerk';

  const handleApply = () => {
    if (!selectedCourse) return;
    createMutation.mutate({
      userId: user!.id,
      courseId: parseInt(selectedCourse),
      status: "pending",
      notes: ""
    }, {
      onSuccess: () => {
        setIsOpen(false);
        toast({ title: "Success", description: "Application submitted successfully." });
      }
    });
  };

  const handleStatusUpdate = (id: number, status: string) => {
    updateMutation.mutate({ id, status }, {
      onSuccess: () => toast({ title: "Status Updated", description: `Application marked as ${status}.` })
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
      default: return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  // Filter for students to only see their own
  const visibleApps = isStaff ? applications : applications?.filter((a: any) => a.userId === user?.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Applications</h2>
          <p className="text-muted-foreground mt-1">Manage and track course enrollments.</p>
        </div>
        
        {!isStaff && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20"><Plus className="mr-2 h-4 w-4"/> New Application</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle className="font-display text-2xl">Apply for a Course</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Select Course</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Choose a program..." /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {courses?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name} ({c.campus})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full h-12 rounded-xl text-lg font-bold shadow-md" 
                  onClick={handleApply} 
                  disabled={!selectedCourse || createMutation.isPending}
                >
                  {createMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Submit Application"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="rounded-2xl shadow-lg border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Date</TableHead>
                {isStaff && <TableHead className="font-semibold">Applicant ID</TableHead>}
                <TableHead className="font-semibold">Course ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                {isStaff && <TableHead className="text-right font-semibold">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleApps?.map((app: any) => (
                <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{format(new Date(app.applicationDate), 'MMM d, yyyy')}</TableCell>
                  {isStaff && <TableCell className="text-muted-foreground">{app.userId.substring(0, 8)}...</TableCell>}
                  <TableCell>Course #{app.courseId}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  {isStaff && (
                    <TableCell className="text-right">
                      {app.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg h-8" onClick={() => handleStatusUpdate(app.id, 'approved')}>Approve</Button>
                          <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 rounded-lg h-8" onClick={() => handleStatusUpdate(app.id, 'rejected')}>Reject</Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {visibleApps?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isStaff ? 5 : 3} className="text-center py-12 text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
