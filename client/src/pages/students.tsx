import { useAllUserProfiles } from "@/hooks/use-profiles";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Students() {
  const { data: profiles, isLoading } = useAllUserProfiles();

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  // Filter only students
  const students = profiles?.filter((p: any) => p.role === 'student') || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Student Directory</h2>
        <p className="text-muted-foreground mt-1">View and manage enrolled students.</p>
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
