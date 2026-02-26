import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile } from "@/hooks/use-profiles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GraduationCap, Loader2 } from "lucide-react";

export default function ProfileSetup() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [role, setRole] = useState<string>("student");
  const [campus, setCampus] = useState("Springs");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [nextOfKin, setNextOfKin] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload: Record<string, unknown> = { userId: user.id, role };
    if (role === "student") {
      payload.campus = campus || null;
      payload.idNumber = idNumber || null;
      payload.phone = phone || null;
      payload.address = address || null;
      payload.studentIdNumber = studentIdNumber || null;
      payload.dateOfBirth = dateOfBirth || null;
      payload.gender = gender || null;
      payload.nextOfKin = nextOfKin || null;
      payload.emergencyContact = emergencyContact || null;
      payload.enrollmentDate = new Date().toISOString();
    }
    updateProfile(payload as any);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <Card className="w-full max-w-md shadow-2xl shadow-primary/10 border-0 ring-1 ring-border/50 relative z-10 backdrop-blur-sm bg-card/95 max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pt-8 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-display font-bold">Complete Profile</CardTitle>
          <CardDescription className="text-base mt-2">
            Welcome, {user?.firstName ?? user?.email}! Please select your role and complete your details.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-semibold text-foreground/80">I am a...</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="h-14 rounded-xl border-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="student" className="py-3">Student</SelectItem>
                  <SelectItem value="faculty" className="py-3">Faculty Member</SelectItem>
                  <SelectItem value="clerk" className="py-3">Administrative Clerk</SelectItem>
                  <SelectItem value="admin" className="py-3">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "student" && (
              <div className="space-y-4 pt-2 border-t border-border/50">
                <h4 className="text-sm font-semibold text-foreground">Student information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Campus</Label>
                    <Select value={campus} onValueChange={setCampus}>
                      <SelectTrigger className="rounded-lg h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Springs">Springs</SelectItem>
                        <SelectItem value="Braamfontein">Braamfontein</SelectItem>
                        <SelectItem value="JHB">JHB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>ID / Passport number</Label>
                    <Input className="rounded-lg h-11" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input className="rounded-lg h-11" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Contact number" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input className="rounded-lg h-11" value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address" />
                </div>
                <div className="space-y-2">
                  <Label>Student ID number</Label>
                  <Input className="rounded-lg h-11" value={studentIdNumber} onChange={e => setStudentIdNumber(e.target.value)} placeholder="Assigned by college if left blank" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Date of birth</Label>
                    <Input className="rounded-lg h-11" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="rounded-lg h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Next of kin</Label>
                  <Input className="rounded-lg h-11" value={nextOfKin} onChange={e => setNextOfKin(e.target.value)} placeholder="Name and contact" />
                </div>
                <div className="space-y-2">
                  <Label>Emergency contact</Label>
                  <Input className="rounded-lg h-11" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} placeholder="Name and phone" />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:-translate-y-0.5"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
