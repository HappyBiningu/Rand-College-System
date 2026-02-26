import { useState } from "react";
import { useInvoices, useCreateInvoice, useUpdateInvoiceStatus } from "@/hooks/use-invoices";
import { useUserProfile, useAllUserProfiles } from "@/hooks/use-profiles";
import { useCourses } from "@/hooks/use-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Invoices() {
  const { data: invoices, isLoading } = useInvoices();
  const { data: profiles } = useAllUserProfiles();
  const { data: courses } = useCourses();
  const { data: myProfile } = useUserProfile();
  const { toast } = useToast();
  
  const createMutation = useCreateInvoice();
  const updateStatusMutation = useUpdateInvoiceStatus();
  const [isOpen, setIsOpen] = useState(false);

  const updateInvoiceStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status }, {
      onSuccess: () => toast({ title: "Updated", description: `Invoice marked as ${status}.` }),
    });
  };
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [amount, setAmount] = useState("");

  const isStaff = myProfile?.role === 'admin' || myProfile?.role === 'clerk';
  const students = profiles?.filter(p => p.role === 'student') || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse || !amount) return;
    
    createMutation.mutate({
      userId: selectedStudent,
      courseId: parseInt(selectedCourse),
      amount: amount.toString(),
      status: "unpaid",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days due
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setSelectedStudent("");
        setSelectedCourse("");
        setAmount("");
        toast({ title: "Success", description: "Invoice generated successfully." });
      }
    });
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const visibleInvoices = isStaff ? invoices : invoices?.filter((i: any) => i.userId === myProfile?.userId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Invoices</h2>
          <p className="text-muted-foreground mt-1">Manage billing and outstanding balances.</p>
        </div>
        
        {isStaff && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20"><Plus className="mr-2 h-4 w-4"/> Generate Invoice</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle className="font-display text-2xl">Create New Invoice</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Select Student</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Choose student..." /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {students.map((s: any) => (
                        <SelectItem key={s.userId} value={s.userId}>Student {s.userId.substring(0,8)} ({s.campus})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Select Course</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Choose course..." /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {courses?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Amount (Rands)</label>
                  <Input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="rounded-xl h-12" />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Generate Invoice"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="rounded-2xl shadow-lg border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold py-4">Invoice Date</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
              {isStaff && <TableHead className="font-semibold">Student</TableHead>}
                <TableHead className="font-semibold">Program</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Amount</TableHead>
                {isStaff && <TableHead className="text-right font-semibold">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
            {visibleInvoices?.map((inv: any) => (
              <TableRow key={inv.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{format(new Date(inv.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="font-medium text-muted-foreground">{inv.dueDate ? format(new Date(inv.dueDate), 'MMM d, yyyy') : '—'}</TableCell>
                {isStaff && (
                  <TableCell>
                    {inv.userAuth ? [inv.userAuth.firstName, inv.userAuth.lastName].filter(Boolean).join(' ') || inv.userAuth.email : inv.userId?.substring(0,8) + '...'}
                  </TableCell>
                )}
                <TableCell>{inv.course?.name || `Course #${inv.courseId}`}</TableCell>
                <TableCell>
                  <Badge variant={inv.status === 'paid' ? 'default' : 'outline'} className={inv.status === 'unpaid' ? 'border-amber-200 text-amber-700 bg-amber-50' : ''}>
                    {inv.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-foreground">R {inv.amount}</TableCell>
                {isStaff && inv.status !== 'paid' && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="rounded-lg h-8" onClick={() => updateInvoiceStatus(inv.id, 'partial')}>Partial</Button>
                      <Button size="sm" className="rounded-lg h-8 bg-emerald-600 hover:bg-emerald-700" onClick={() => updateInvoiceStatus(inv.id, 'paid')}>Mark paid</Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {visibleInvoices?.length === 0 && (
              <TableRow>
                <TableCell colSpan={isStaff ? 7 : 5} className="text-center py-12 text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
