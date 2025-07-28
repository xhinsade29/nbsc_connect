
'use client';

import { useState, useEffect } from 'react';
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
import { subscribeToAnnouncements, Announcement } from '@/services/announcements';

const ICONS: { [key: string]: LucideIcon } = {
    Academics: GraduationCap,
    Event: CalendarDays,
    Announcement: Megaphone,
    default: Megaphone,
};

const getIcon = (category: string) => {
    return ICONS[category] || ICONS.default;
}

export default function DashboardPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToAnnouncements(setAnnouncements);
        return () => unsubscribe();
    }, []);

    const getTypedAnnouncement = (ann: Announcement) => {
        return {
            ...ann,
            Icon: getIcon(ann.category)
        }
    }

  return (
    <>
        <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Latest announcements and events.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((item) => {
                const typedItem = getTypedAnnouncement(item);
                return (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <typedItem.Icon className="h-5 w-5 text-muted-foreground" />
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
                )
            })}
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
                            <IconComponent iconName={selectedAnnouncement.category} className="h-4 w-4"/>
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

function IconComponent({ iconName, ...props }: { iconName: string; className?: string }) {
    const Icon = getIcon(iconName);
    return <Icon {...props} />;
}
