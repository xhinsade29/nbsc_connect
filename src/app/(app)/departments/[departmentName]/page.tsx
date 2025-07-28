'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileSignature, Laptop, HeartHandshake, Mail, Phone, ArrowRight, ArrowLeft, Megaphone, CalendarDays, GraduationCap, Building } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';

interface Department {
  name: string;
  slug: string;
  Icon: LucideIcon;
  email: string;
  phone: string;
  description: string;
}

const departments: Department[] = [
  {
    name: 'Academics Office',
    slug: 'academics-office',
    Icon: BookOpen,
    email: 'academics@nbsc.edu.ph',
    phone: '(012) 345-6789',
    description: 'The Academics Office is responsible for all academic programs, curriculum development, and faculty management.'
  },
  {
    name: 'Registrar\'s Office',
    slug: 'registrars-office',
    Icon: FileSignature,
    email: 'registrar@nbsc.edu.ph',
    phone: '(012) 345-6780',
    description: 'The Registrar\'s Office handles student records, registration, and issuance of official documents.'
  },
  {
    name: 'IT Services',
    slug: 'it-services',
    Icon: Laptop,
    email: 'itservices@nbsc.edu.ph',
    phone: '(012) 345-6781',
    description: 'IT Services provides technical support, manages the campus network, and oversees all information systems.'
  },
  {
    name: 'Student Affairs',
    slug: 'student-affairs',
    Icon: HeartHandshake,
    email: 'student.affairs@nbsc.edu.ph',
    phone: '(012) 345-6782',
    description: 'The Student Affairs office is dedicated to student welfare, activities, and development programs.'
  },
];

interface Announcement {
    id: number;
    title: string;
    category: string;
    department: string;
    Icon: LucideIcon;
    date: string;
    description: string;
    image: string;
    dataAiHint: string;
}

const allAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Midterm Examinations Schedule',
    category: 'Academics',
    department: 'Academics Office',
    Icon: GraduationCap,
    date: 'October 25, 2024',
    description: 'The schedule for the upcoming midterm examinations has been released. Please check the student portal for your specific dates and venues. The full schedule is available for download on the university website under the academic calendar section. Ensure you have cleared all your dues to be eligible for the exams.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'books library',
  },
  {
    id: 2,
    title: 'NBSC Foundation Day Celebration',
    category: 'Event',
    department: 'Student Affairs',
    Icon: CalendarDays,
    date: 'October 22, 2024',
    description: 'Join us in celebrating our 42nd Foundation Day! A week-long series of events, competitions, and activities awaits all students. Highlights include a parade, talent show, and a concert featuring local artists. Don\'t miss out!',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'festival balloons'
  },
  {
    id: 3,
    title: 'System Maintenance Alert',
    category: 'Announcement',
    department: 'IT Services',
    Icon: Megaphone,
    date: 'October 20, 2024',
    description: 'The student portal will be temporarily unavailable on October 28, 2024, from 1:00 AM to 4:00 AM for scheduled system maintenance. This is to ensure the stability and security of our online services. We apologize for any inconvenience this may cause.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'server room'
  },
];


export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { departmentName } = params;

  const department = departments.find(d => d.slug === departmentName);
  const departmentAnnouncements = allAnnouncements.filter(a => a.department === department?.name);

  if (!department) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <h1 className="text-2xl font-bold">Department Not Found</h1>
            <p className="text-muted-foreground">The department you are looking for does not exist.</p>
            <Button onClick={() => router.push('/departments')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Departments
            </Button>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
        <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Departments
            </Button>
            <div className="flex items-center gap-4">
                <department.Icon className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="font-headline text-3xl font-bold">{department.name}</h1>
                    <p className="text-muted-foreground">{department.description}</p>
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground"/>
                        <a href={`mailto:${department.email}`} className="text-muted-foreground hover:text-primary transition-colors">{department.email}</a>
                    </div>
                     <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-muted-foreground">{department.phone}</span>
                    </div>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => router.push('/inquiry')}>
                    Send Inquiry
                </Button>
            </CardContent>
        </Card>

        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Announcements from {department.name}</h2>
            {departmentAnnouncements.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {departmentAnnouncements.map((item) => (
                        <Card key={item.id} className="flex flex-col">
                            <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <item.Icon className="h-5 w-5 text-muted-foreground" />
                                    <Badge variant={item.category === 'Event' ? 'default' : 'secondary'}>
                                    {item.category}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building className="h-4 w-4" />
                                    <span>{item.department}</span>
                                </div>
                            </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    className="rounded-lg object-cover"
                                    data-ai-hint={item.dataAiHint}
                                />
                                <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                                <CardDescription className="line-clamp-3">{item.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">{item.date}</p>
                                <Button variant="link">
                                    View Details
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6">
                        <p className="text-muted-foreground">No announcements from this department at the moment.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}