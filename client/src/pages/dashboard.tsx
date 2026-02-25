import { useDashboardStats } from "@/hooks/use-dashboard";
import { useUserProfile } from "@/hooks/use-profiles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, Clock, Activity, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: profile } = useUserProfile();

  const mockChartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ];

  if (statsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      trend: "+12% from last month",
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      icon: FileText,
      trend: "+4% from last month",
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30"
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingApplications || 0,
      icon: Clock,
      trend: "Requires attention",
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/30"
    },
    {
      title: "Revenue (YTD)",
      value: `R ${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: CreditCard,
      trend: "+18% from last year",
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Overview</h2>
        <p className="text-muted-foreground mt-1">Monitor college performance and metrics.</p>
      </div>

      {(profile?.role === 'admin' || profile?.role === 'clerk') && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <Card key={i} className="rounded-2xl border-none shadow-lg shadow-black/5 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <stat.icon className={`h-24 w-24 ${stat.color}`} />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-display font-bold tracking-tight">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2 font-medium flex items-center gap-1">
                  <Activity className="h-3 w-3" /> {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {profile?.role === 'student' && (
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-display font-bold mb-4">Ready to start learning?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8">Head over to the courses section to view available programs and submit your application for the upcoming semester.</p>
            <button 
              onClick={() => window.location.href = '/courses'}
              className="bg-white text-primary px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Courses
            </button>
          </div>
        </div>
      )}

      {(profile?.role === 'admin' || profile?.role === 'clerk') && (
        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="col-span-4 rounded-2xl shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `R${value}`} />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3 rounded-2xl shadow-lg border-border/50 bg-gradient-to-br from-card to-muted/30">
            <CardHeader>
              <CardTitle className="font-display">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { title: "New Application Received", time: "10 mins ago", desc: "Jane Doe applied for Traffic Management" },
                  { title: "Payment Recorded", time: "1 hour ago", desc: "R1800 received for Student ID: 202501" },
                  { title: "Course Updated", time: "3 hours ago", desc: "Admin updated fees for Civil Engineering" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      <p className="text-xs font-medium text-primary/70 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
