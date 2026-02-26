import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, BookOpen, Users, Award, ShieldCheck, Loader2, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const BRAAMFONTEIN_PHONE = "011 333 2514 / 060 756 4821";
const SPRINGS_PHONE = "011 056 6635 / 060 608 1560";
const RTC_FACEBOOK = "https://www.facebook.com/randtrainingcollege";
const RTC_INSTAGRAM = "https://www.instagram.com/randtrainingcollege";
const RTC_TWITTER = "https://twitter.com/randtraining";
const RTC_TIKTOK = "https://www.tiktok.com/@randtrainingcollege";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please check your credentials and try again.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - matches RTC site: RAND TRAINING COLLEGE */}
      <header className="h-24 px-6 md:px-12 flex items-center justify-between glass-panel sticky top-0 z-50 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight tracking-tight uppercase">
              Rand Training College
            </h1>
            <p className="text-xs text-primary/80 tracking-widest uppercase font-semibold">Excellence in education & career development</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleLogin} className="hidden md:flex items-center gap-2">
            <Input
              placeholder="Username"
              className="h-10 w-32 rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="h-10 w-32 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoggingIn}
              className="rounded-lg h-10 px-4 shadow-lg shadow-primary/20"
            >
              {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
          <Button
            size="lg"
            className="md:hidden rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            onClick={() => window.location.href = "/courses"}
          >
            Apply Now
          </Button>
        </div>
      </header>

      {/* Hero - RTC taglines and welcome message */}
      <main className="flex-1">
        <section className="relative pt-20 pb-32 px-6 md:px-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground font-medium text-sm border border-accent/20">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Registrations Open</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold leading-[1.15] tracking-tight text-foreground">
                Your Pathway to Professional Success
              </h2>
              <p className="text-lg font-semibold text-accent">
                Excellence in education, training, and career development.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Welcome to Rand Training College, a respected institution dedicated to academic excellence and professional growth. We are committed to equipping students with the skills, knowledge, and values needed to thrive in today’s competitive world.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unlock your potential with tailored education. Our accredited programs are designed to equip you with practical skills, knowledge, and confidence to succeed. Discover education that inspires progress and unlocks your full potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="rounded-xl h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => window.location.href = "/courses"}
                >
                  Apply Online <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl h-14 px-8 text-lg font-semibold border-2 hover:bg-muted transition-all duration-300"
                  onClick={() => window.location.href = "/courses"}
                >
                  View Courses
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-border/60">
                <div>
                  <h4 className="text-3xl font-display font-bold text-foreground">2</h4>
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
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80"
                alt="Rand Training College students"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-10 left-10 right-10 z-20">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Award className="h-6 w-6 text-accent" />
                    Excellence in Training
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    With expert faculty, quality programs, and a supportive environment, we provide a transformative learning experience that prepares our students to lead, excel, and make a lasting impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Campuses - Braamfontein & Springs as on RTC site */}
        <section className="py-20 bg-muted/40 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Our Campuses</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Rand Training College offers the same commitment to excellence, innovation, and career-focused training across both campuses.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-3xl shadow-lg border border-border/50 hover:shadow-xl transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-accent" />
                  <h3 className="text-xl font-display font-bold">Braamfontein Campus</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Based in the vibrant heart of Braamfontein, a dynamic private college committed to equipping students with practical skills and academic excellence. Central location, supportive environment, and hands-on training.
                </p>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Phone className="h-4 w-4 text-accent" />
                  {BRAAMFONTEIN_PHONE}
                </div>
              </div>
              <div className="bg-card p-8 rounded-3xl shadow-lg border border-border/50 hover:shadow-xl transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-accent" />
                  <h3 className="text-xl font-display font-bold">Springs Campus</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Quality education on the East Rand. The same commitment to excellence, innovation, and career-focused training. Conveniently located with dedicated lecturers and modern facilities.
                </p>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Phone className="h-4 w-4 text-accent" />
                  {SPRINGS_PHONE}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - aligned with RTC messaging */}
        <section id="courses-section" className="py-24 bg-muted/50 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold">Why Choose Us?</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                We provide a diverse range of accredited programs crafted to empower both aspiring professionals and experienced individuals seeking growth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "Diverse Faculties",
                  desc: "Engineering Studies, Police & Traffic Law, Business Studies, Information Technology, NQF accredited programs and short courses.",
                },
                {
                  icon: Users,
                  title: "Expert Lecturers",
                  desc: "Learn from industry professionals. Our team is dedicated to providing exceptional education and guidance for every student’s growth and success.",
                },
                {
                  icon: GraduationCap,
                  title: "Career Ready",
                  desc: "Practical skills and academic excellence that prepare you for the real world. Education that inspires progress and unlocks your full potential.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-card p-8 rounded-3xl shadow-lg shadow-black/5 border border-border/50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                >
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

      {/* Footer - RTC contact and social as on randtrainingcollege.co.za */}
      <footer className="bg-primary text-primary-foreground py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-accent" />
              <span className="font-display font-bold text-lg uppercase">Rand Training College</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-primary-foreground/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span>Braamfontein: {BRAAMFONTEIN_PHONE}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span>Springs: {SPRINGS_PHONE}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 border-t border-primary-foreground/20 pt-8">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Rand Training College. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href={RTC_FACEBOOK} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Facebook">
                Facebook
              </a>
              <a href={RTC_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Instagram">
                Instagram
              </a>
              <a href={RTC_TWITTER} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Twitter">
                Twitter
              </a>
              <a href={RTC_TIKTOK} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="TikTok">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
