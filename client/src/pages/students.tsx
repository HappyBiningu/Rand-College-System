import { useAllUserProfiles, useUpdateProfile } from "@/hooks/use-profiles";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Mail, Phone, MapPin, Plus, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Students() {
  const { data: profiles, isLoading } = useAllUserProfiles();
  const { data: myProfile } = useUpdateProfile(); // Not used for data, just to have the hook
  const updateMutation = useUpdateProfile();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    userId: "",
    campus: "Springs",
    studentIdNumber: "",
    phone: "",
    address: ""
  });

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const students = profiles?.filter((p: any) => p.role === 'student') || [];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.userId) return;

    updateMutation.mutate({
      userId: newStudent.userId,
      role: 'student',
      campus: newStudent.campus,
      studentIdNumber: newStudent.studentIdNumber || `ST-${Math.floor(Math.random() * 10000)}`,
      phone: newStudent.phone,
      address: newStudent.address
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setNewStudent({ userId: "", campus: "Springs", studentIdNumber: "", phone: "", address: "" });
        toast({ title: "Success", description: "Student registered successfully." });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Student Directory</h2>
          <p className="text-muted-foreground mt-1">View and manage enrolled students.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20"><UserPlus className="mr-2 h-4 w-4"/> Register Student</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-[425px]">
            <DialogHeader><DialogTitle className="font-display text-2xl">Register New Student</DialogTitle></DialogHeader>
            <form onSubmit={handleRegister} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">User ID (from Auth)</label>
                <Input required value={newStudent.userId} onChange={e => setNewStudent({...newStudent, userId: e.target.value})} className="rounded-xl h-11" placeholder="e.g. u_123..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Campus</label>
                  <Select value={newStudent.campus} onValueChange={v => setNewStudent({...newStudent, campus: v})}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Springs">Springs</SelectItem>
                      <SelectItem value="Braamfontein">Braamfontein</SelectItem>
                      <SelectItem value="JHB">JHB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Student ID No.</label>
                  <Input value={newStudent.studentIdNumber} onChange={e => setNewStudent({...newStudent, studentIdNumber: e.target.value})} className="rounded-xl h-11" placeholder="Auto-generated if empty" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone Number</label>
                <Input value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Address</label>
                <Input value={newStudent.address} onChange={e => setNewStudent({...newStudent, address: e.target.value})} className="rounded-xl h-11" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-bold mt-2" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Registration"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-2xl shadow-lg border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold py-4">Student Info</TableHead>
              <TableHead className="font-semibold">Student ID</TableHead>
              <TableHead className="font-semibold">Campus</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student: any) => (
              <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-primary/10">
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {student.idNumber ? student.idNumber.substring(0,2) : 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">User {student.userId.substring(0,6)}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px] uppercase tracking-wider">Active</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{student.studentIdNumber || 'Not Assigned'}</TableCell>
                <TableCell>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {student.campus || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {student.phone && <div className="flex items-center text-xs text-muted-foreground"><Phone className="h-3 w-3 mr-2" />{student.phone}</div>}
                    <div className="flex items-center text-xs text-muted-foreground"><Mail className="h-3 w-3 mr-2" />user_{student.userId.substring(0,4)}@student.rand.ac.za</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  No students found in the directory.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
