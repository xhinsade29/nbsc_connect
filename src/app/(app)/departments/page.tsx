import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileSignature, Laptop, HeartHandshake, Mail, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Department {
  name: string;
  Icon: LucideIcon;
  email: string;
  phone: string;
}

const departments: Department[] = [
  {
    name: 'Academics Office',
    Icon: BookOpen,
    email: 'academics@nbsc.edu.ph',
    phone: '(012) 345-6789',
  },
  {
    name: 'Registrar\'s Office',
    Icon: FileSignature,
    email: 'registrar@nbsc.edu.ph',
    phone: '(012) 345-6780',
  },
  {
    name: 'IT Services',
    Icon: Laptop,
    email: 'itservices@nbsc.edu.ph',
    phone: '(012) 345-6781',
  },
  {
    name: 'Student Affairs',
    Icon: HeartHandshake,
    email: 'student.affairs@nbsc.edu.ph',
    phone: '(012) 345-6782',
  },
];

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Departments</h1>
        <p className="text-muted-foreground">Contact information for campus departments.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((dept) => (
          <Card key={dept.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-lg font-medium">{dept.name}</CardTitle>
              <dept.Icon className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground"/>
                        <a href={`mailto:${dept.email}`} className="text-muted-foreground hover:text-primary transition-colors">{dept.email}</a>
                    </div>
                     <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-muted-foreground">{dept.phone}</span>
                    </div>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Send Inquiry
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
