import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-profiles";
import { Loader2 } from "lucide-react";

// Layouts & Pages
import { MainLayout } from "@/components/layout/main-layout";
import Landing from "@/pages/landing";
import ProfileSetup from "@/pages/profile-setup";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import Applications from "@/pages/applications";
import Students from "@/pages/students";
import Invoices from "@/pages/invoices";
import Payments from "@/pages/payments";
import NotFound from "@/pages/not-found";

// Component to handle Auth routing logic
function AuthRouter() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading application...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Landing Page
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/courses" component={Courses} />
        {/* Redirect everything else to landing or let them 404 */}
        <Route component={Landing} />
      </Switch>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Logged in, but no profile setup -> Force Profile Setup
  if (!profile) {
    return <ProfileSetup />;
  }

  // Logged in and Profile exists -> Show Main App
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/courses" component={Courses} />
        <Route path="/applications" component={Applications} />
        <Route path="/students" component={Students} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/payments" component={Payments} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
