'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Megaphone, CalendarDays, GraduationCap, Building, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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

const announcements: Announcement[] = [
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

export default function DashboardPage() {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  return (
    <>
        <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Latest announcements and events.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((item) => (
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
                    <Button variant="link" onClick={() => setSelectedAnnouncement(item)}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
        </div>

        {selectedAnnouncement && (
            <Dialog open={!!selectedAnnouncement} onOpenChange={(isOpen) => !isOpen && setSelectedAnnouncement(null)}>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{selectedAnnouncement.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Image
                        src={selectedAnnouncement.image}
                        alt={selectedAnnouncement.title}
                        width={600}
                        height={400}
                        className="rounded-lg object-cover"
                        data-ai-hint={selectedAnnouncement.dataAiHint}
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <selectedAnnouncement.Icon className="h-4 w-4"/>
                            <span>{selectedAnnouncement.category}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Building className="h-4 w-4"/>
                            <span>{selectedAnnouncement.department}</span>
                        </div>
                    </div>
                    <DialogDescription>
                    {selectedAnnouncement.description}
                    </DialogDescription>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                    </DialogClose>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
    </>
  );
}
