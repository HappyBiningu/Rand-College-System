import { useState } from "react";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/use-courses";
import { useUserProfile } from "@/hooks/use-profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, MapPin, Clock, BookOpen, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCourseSchema, type CreateCourseRequest } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

// Enhance schema for form to handle string->number coercion
const formSchema = insertCourseSchema.extend({
  registrationFee: z.coerce.string(), 
  depositFee: z.coerce.string().optional(),
  monthlyInstallment: z.coerce.string().optional(),
  totalCost: z.coerce.string(),
});

export default function Courses() {
  const { data: courses, isLoading } = useCourses();
  const { data: profile } = useUserProfile();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'clerk';
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", faculty: "", duration: "", campus: "Springs", 
      registrationFee: "", depositFee: "", monthlyInstallment: "", totalCost: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload: CreateCourseRequest = {
      ...values,
      depositFee: values.depositFee || null,
      monthlyInstallment: values.monthlyInstallment || null,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload }, {
        onSuccess: () => {
          setIsCreateOpen(false);
          setEditingId(null);
          form.reset();
          toast({ title: "Success", description: "Course updated successfully." });
        }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsCreateOpen(false);
          form.reset();
          toast({ title: "Success", description: "Course created successfully." });
        }
      });
    }
  };

  const handleEdit = (course: any) => {
    setEditingId(course.id);
    form.reset({
      name: course.name,
      faculty: course.faculty,
      duration: course.duration || "",
      campus: course.campus || "Springs",
      registrationFee: course.registrationFee,
      depositFee: course.depositFee || "",
      monthlyInstallment: course.monthlyInstallment || "",
      totalCost: course.totalCost,
    });
    setIsCreateOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast({ title: "Deleted", description: "Course removed." })
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const springsCourses = courses?.filter(c => c.campus === 'Springs') || [];
  const braamfonteinCourses = courses?.filter(c => c.campus === 'Braamfontein') || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Programs & Courses</h2>
          <p className="text-muted-foreground mt-1">Browse our accredited faculties and programs across all campuses.</p>
        </div>
        
        {isAdmin && (
          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) { setEditingId(null); form.reset(); }
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                <Plus className="mr-2 h-4 w-4" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{editingId ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem className="col-span-2"><FormLabel>Course Name</FormLabel>
                        <FormControl><Input {...field} className="rounded-lg" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="faculty" render={({ field }) => (
                      <FormItem><FormLabel>Faculty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue placeholder="Select faculty" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Traffic">Traffic Management</SelectItem>
                            <SelectItem value="Engineering">Engineering Studies</SelectItem>
                            <SelectItem value="Business">Business Studies</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Basic Education">Basic Education</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="campus" render={({ field }) => (
                      <FormItem><FormLabel>Campus</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue placeholder="Select campus" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Springs">Springs</SelectItem>
                            <SelectItem value="Braamfontein">Braamfontein</SelectItem>
                            <SelectItem value="JHB">JHB Campus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="duration" render={({ field }) => (
                      <FormItem className="col-span-2"><FormLabel>Duration (e.g., 1 Year, 18 Months)</FormLabel>
                        <FormControl><Input {...field} className="rounded-lg" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold mb-3">Fee Structure (Rands)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="registrationFee" render={({ field }) => (
                        <FormItem><FormLabel>Registration Fee</FormLabel><FormControl><Input type="number" {...field} className="rounded-lg" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="depositFee" render={({ field }) => (
                        <FormItem><FormLabel>Admin/Deposit Fee</FormLabel><FormControl><Input type="number" {...field} className="rounded-lg" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="monthlyInstallment" render={({ field }) => (
                        <FormItem><FormLabel>Monthly Installment</FormLabel><FormControl><Input type="number" {...field} className="rounded-lg" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="totalCost" render={({ field }) => (
                        <FormItem><FormLabel>Total Cost</FormLabel><FormControl><Input type="number" {...field} className="rounded-lg" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl px-8 shadow-md">
                      {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Course
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="springs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="springs">Springs Campus</TabsTrigger>
          <TabsTrigger value="braamfontein">Braamfontein Campus</TabsTrigger>
        </TabsList>
        <TabsContent value="springs">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {springsCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} isAdmin={isAdmin} profile={profile} handleEdit={handleEdit} handleDelete={handleDelete} />
            ))}
            {springsCourses.length === 0 && <EmptyState />}
          </div>
        </TabsContent>
        <TabsContent value="braamfontein">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {braamfonteinCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} isAdmin={isAdmin} profile={profile} handleEdit={handleEdit} handleDelete={handleDelete} />
            ))}
            {braamfonteinCourses.length === 0 && <EmptyState />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course, isAdmin, profile, handleEdit, handleDelete }: any) {
  return (
    <Card key={course.id} className="rounded-2xl shadow-lg border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col">
      <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-md font-semibold">
            <BookOpen className="w-3 h-3 mr-1" /> {course.faculty}
          </Badge>
          {isAdmin && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full" onClick={() => handleEdit(course)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full" onClick={() => handleDelete(course.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-display mt-3 leading-tight">{course.name}</CardTitle>
      </CardHeader>
      <CardContent className="py-5 flex-1">
        <div className="space-y-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-3 text-primary/70" />
            <span className="font-medium">Duration:</span> <span className="ml-1 text-foreground">{course.duration}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-3 text-primary/70" />
            <span className="font-medium">Campus:</span> <span className="ml-1 text-foreground">{course.campus}</span>
          </div>
        </div>
        
        <div className="mt-6 bg-accent/5 p-4 rounded-xl border border-accent/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Registration</span>
            <span className="font-semibold">R {course.registrationFee}</span>
          </div>
          {course.depositFee && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Admin/Deposit</span>
              <span className="font-semibold">R {course.depositFee}</span>
            </div>
          )}
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Monthly</span>
            <span className="font-semibold">R {course.monthlyInstallment || '-'}</span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
            <span className="text-sm font-bold">Total Cost</span>
            <span className="font-bold text-primary">R {course.totalCost}</span>
          </div>
        </div>
      </CardContent>
      {profile?.role === 'student' && (
        <CardFooter className="pt-0 pb-6 px-6">
          <Button className="w-full rounded-xl font-semibold shadow-md hover:-translate-y-0.5 transition-all">
            Apply Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-3xl border border-dashed">
      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
      <p className="text-lg font-medium">No courses available for this campus.</p>
    </div>
  );
}
