import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-profiles";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Loader2, Bell } from "lucide-react";
import { ReactNode } from "react";

export function MainLayout({ children }: { children: ReactNode }) {
  const { user, logout, isLoggingOut } = useAuth();
  const { data: profile, isLoading } = useUserProfile();

  const getInitials = (name?: string) => name ? name.substring(0, 2).toUpperCase() : 'U';

  const style = {
    "--sidebar-width": "18rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-20 glass-panel border-b-0 sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-primary/5 p-2 rounded-lg transition-colors" />
              <div className="hidden md:block">
                <h1 className="text-xl font-display font-semibold">Welcome back, {user?.firstName || 'User'}</h1>
                <p className="text-sm text-muted-foreground">Here's what's happening today.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 h-2 w-2 bg-accent rounded-full border-2 border-background"></span>
              </Button>
              
              <div className="flex items-center gap-3 pl-6 border-l border-border/60">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold leading-none">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{isLoading ? 'Loading...' : profile?.role || 'No Role'}</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getInitials(user?.firstName)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full ml-2"
                >
                  {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
