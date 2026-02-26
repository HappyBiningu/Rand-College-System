import { useState } from "react";
import { usePayments, useCreatePayment } from "@/hooks/use-payments";
import { useUserProfile, useAllUserProfiles } from "@/hooks/use-profiles";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Receipt } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Payments() {
  const { data: payments, isLoading } = usePayments();
  const { data: profile } = useUserProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const createMutation = useCreatePayment();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const { data: profiles } = useAllUserProfiles();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");

  const isStaff = profile?.role === 'admin' || profile?.role === 'clerk';
  const students = profiles?.filter(p => p.role === 'student') || [];

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || (isStaff && !selectedStudent)) return;
    
    createMutation.mutate({
      userId: isStaff ? selectedStudent : user!.id,
      amount: amount.toString(),
      receiptNumber: `REC-${Math.floor(Math.random() * 100000)}`,
      paymentMethod: paymentMethod,
      status: "completed",
      description: desc
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setAmount("");
        setDesc("");
        setSelectedStudent("");
        toast({ title: "Success", description: "Payment recorded successfully." });
      }
    });
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const visiblePayments = isStaff ? payments : payments?.filter((p: any) => p.userId === user?.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Fees & Payments</h2>
          <p className="text-muted-foreground mt-1">Track financial transactions and receipts.</p>
        </div>
        
        {isStaff && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20"><Plus className="mr-2 h-4 w-4"/> Record Payment</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle className="font-display text-2xl">Record New Payment</DialogTitle></DialogHeader>
              <form onSubmit={handleRecord} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Student</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select student..." /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {students.map((s: any) => (
                        <SelectItem key={s.userId} value={s.userId}>ST-{s.userId.substring(0,6)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Amount (Rands)</label>
                    <Input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Method</label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Description</label>
                  <Input placeholder="e.g. Registration Fee" required value={desc} onChange={e => setDesc(e.target.value)} className="rounded-xl h-11" />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl font-bold mt-2" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Payment"}
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
              <TableHead className="font-semibold py-4">Date</TableHead>
              <TableHead className="font-semibold">Receipt No.</TableHead>
              {isStaff && <TableHead className="font-semibold">Student</TableHead>}
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="text-right font-semibold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiblePayments?.map((payment: any) => (
              <TableRow key={payment.id} className="hover:bg-muted/30">
                <TableCell className="font-medium text-muted-foreground">{format(new Date(payment.paymentDate), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <Receipt className="h-4 w-4 text-primary/50" />
                    {payment.receiptNumber}
                  </div>
                </TableCell>
                {isStaff && (
                  <TableCell className="text-sm text-muted-foreground">
                    {payment.userAuth ? [payment.userAuth.firstName, payment.userAuth.lastName].filter(Boolean).join(' ') || payment.userAuth.email : payment.userId?.substring(0,8) + '...'}
                  </TableCell>
                )}
                <TableCell>{payment.description}</TableCell>
                <TableCell className="text-right font-bold text-foreground">R {payment.amount}</TableCell>
              </TableRow>
            ))}
            {visiblePayments?.length === 0 && (
              <TableRow>
                <TableCell colSpan={isStaff ? 5 : 4} className="text-center py-12 text-muted-foreground">
                  No payment records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
