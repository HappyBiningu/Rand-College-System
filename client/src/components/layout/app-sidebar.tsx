import { Link, useLocation } from "wouter";
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard,
  GraduationCap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/use-profiles";

export function AppSidebar() {
  const [location] = useLocation();
  const { data: profile } = useUserProfile();
  const role = profile?.role || 'student';

  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      roles: ['admin', 'clerk', 'faculty', 'student']
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
      roles: ['admin', 'clerk', 'faculty', 'student']
    },
    {
      title: "Applications",
      url: "/applications",
      icon: FileText,
      roles: ['admin', 'clerk', 'student']
    },
    {
      title: "Students",
      url: "/students",
      icon: Users,
      roles: ['admin', 'clerk', 'faculty']
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: FileText,
      roles: ['admin', 'clerk', 'student']
    },
    {
      title: "Fees & Payments",
      url: "/payments",
      icon: CreditCard,
      roles: ['admin', 'clerk', 'student']
    }
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <Sidebar variant="inset" className="border-r-0">
      <SidebarHeader className="bg-sidebar p-6 flex justify-center items-center h-[100px]">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground p-2 rounded-xl shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-sidebar-foreground leading-tight">Rand Training</h2>
            <p className="text-xs text-sidebar-foreground/70 tracking-widest uppercase font-semibold">College</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar text-sidebar-foreground px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-bold uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {visibleItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        rounded-xl transition-all duration-200 py-6 px-4
                        ${isActive 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-md' 
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:translate-x-1'
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-sidebar-primary' : ''}`} />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
