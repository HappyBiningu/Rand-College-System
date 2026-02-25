import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, BookOpen, Users, Award, ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-24 px-6 md:px-12 flex items-center justify-between glass-panel sticky top-0 z-50 border-b-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight tracking-tight">Rand Training</h1>
            <p className="text-xs text-primary/80 tracking-widest uppercase font-bold">College</p>
          </div>
        </div>
        <Button 
          size="lg" 
          className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          onClick={() => window.location.href = '/api/login'}
        >
          Sign In / Apply
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-32 px-6 md:px-12 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground font-medium text-sm border border-accent/20">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Registrations Open for 2025</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tight">
                Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Future</span> Through Education
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Join Rand Training College. Offering accredited courses in Traffic Management, Engineering, and Business Studies across Springs and Braamfontein campuses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="rounded-xl h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl h-14 px-8 text-lg font-semibold border-2 hover:bg-muted transition-all duration-300"
                >
                  View Courses
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-8 border-t border-border/60">
                <div>
                  <h4 className="text-3xl font-display font-bold text-foreground">2+</h4>
                  <p className="text-sm text-muted-foreground font-medium">Campuses</p>
                </div>
                <div>
                  <h4 className="text-3xl font-display font-bold text-foreground">15+</h4>
                  <p className="text-sm text-muted-foreground font-medium">Programs</p>
                </div>
                <div>
                  <h4 className="text-3xl font-display font-bold text-foreground">NQF</h4>
                  <p className="text-sm text-muted-foreground font-medium">Accredited</p>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 ring-1 ring-border group">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent z-10"></div>
              {/* HTML comment for stock image requirement */}
              {/* happy diverse college students studying together campus lifestyle */}
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80" 
                alt="Students studying"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-10 left-10 right-10 z-20">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Award className="h-6 w-6 text-accent" />
                    Excellence in Training
                  </h3>
                  <p className="mt-2 text-muted-foreground">Dedicated to providing quality education that meets industry standards.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-muted/50 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold">Why Choose Us?</h2>
              <p className="text-muted-foreground mt-4 text-lg">We provide a supportive learning environment designed to help you achieve your career goals.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: BookOpen, title: "Diverse Faculties", desc: "Choose from Business, Engineering, Policing and Basic Education rewrites." },
                { icon: Users, title: "Expert Lecturers", desc: "Learn from industry professionals with years of practical experience." },
                { icon: GraduationCap, title: "Career Ready", desc: "Our NQF accredited programs ensure you are ready for the workplace." }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-8 rounded-3xl shadow-lg shadow-black/5 border border-border/50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-accent" />
            <span className="font-display font-bold text-lg">Rand Training College</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">© {new Date().getFullYear()} Rand Training College. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
