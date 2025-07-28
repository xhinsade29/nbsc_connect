
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileSignature, Laptop, HeartHandshake, Mail, Phone, ArrowRight, ArrowLeft, Megaphone, CalendarDays, GraduationCap, Building, LucideIcon as LucideIconType } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { subscribeToAnnouncements, Announcement } from '@/services/announcements';
import { subscribeToDepartments, Department } from '@/services/departments';

const ICONS: { [key: string]: LucideIcon } = {
    Academics: GraduationCap,
    Event: CalendarDays,
    Announcement: Megaphone,
    BookOpen,
    FileSignature,
    Laptop,
    HeartHandshake,
    default: Megaphone,
};

const getIcon = (category: string) => {
    return ICONS[category] || ICONS.default;
}

const DepartmentIcon = ({ iconName, ...props }: { iconName: string, className?: string }) => {
    const Icon = ICONS[iconName] || BookOpen;
    return <Icon {...props} />;
};

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { departmentName } = params;
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  useEffect(() => {
    const unsubscribeAnnouncements = subscribeToAnnouncements(setAllAnnouncements);
    const unsubscribeDepartments = subscribeToDepartments(setDepartments);
    return () => {
        unsubscribeAnnouncements();
        unsubscribeDepartments();
    };
  }, []);

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

  const handleMessageClick = () => {
    router.push(`/messages?department=${department.slug}`);
  };

  return (
    <div className="flex flex-col gap-8">
        <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all pages
            </Button>
            <div className="flex items-center gap-4">
                <DepartmentIcon iconName={department.icon} className="h-10 w-10 text-primary" />
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
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleMessageClick}>
                    Message Department
                </Button>
            </CardContent>
        </Card>

        <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Announcements from {department.name}</h2>
            {departmentAnnouncements.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {departmentAnnouncements.map((item) => {
                         const ItemIcon = getIcon(item.category);
                         return (
                            <Card key={item.id} className="flex flex-col">
                                <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ItemIcon className="h-5 w-5 text-muted-foreground" />
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
                         )
                    })}
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
