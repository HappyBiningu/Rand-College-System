import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile } from "@/hooks/use-profiles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";

export default function ProfileSetup() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [role, setRole] = useState<string>("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateProfile({ userId: user.id, role });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <Card className="w-full max-w-md shadow-2xl shadow-primary/10 border-0 ring-1 ring-border/50 relative z-10 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center pt-8 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-display font-bold">Complete Profile</CardTitle>
          <CardDescription className="text-base mt-2">
            Welcome, {user?.firstName}! Please select your role at the college to continue.
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
              <p className="text-xs text-muted-foreground pt-1">
                (Note: For this demo, you can freely select your role. In production, staff roles would require approval.)
              </p>
            </div>
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
