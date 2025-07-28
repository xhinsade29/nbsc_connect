'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, HelpCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const notifications = {
    announcements: [
        {
            id: 1,
            title: 'New Grade Policy',
            department: 'Academics Office',
            date: '2 hours ago',
            read: false,
        },
        {
            id: 2,
            title: 'Campus-wide WiFi Upgrade',
            department: 'IT Services',
            date: '1 day ago',
            read: true,
        }
    ],
    inquiries: [
        {
            id: 1,
            title: 'Re: Question about enrollment',
            department: 'Registrar\'s Office',
            date: '3 hours ago',
            read: false,
        },
        {
            id: 2,
            title: 'Re: Technical issue with student portal',
            department: 'IT Services',
            date: '2 days ago',
            read: true,
        }
    ]
};


export default function NotificationsPage() {
  const unreadAnnouncements = notifications.announcements.filter(n => !n.read).length;
  const unreadInquiries = notifications.inquiries.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Recent updates and responses.</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
            <TabsTrigger value="all">
                All
                {(unreadAnnouncements + unreadInquiries > 0) && 
                    <Badge className="ml-2">{unreadAnnouncements + unreadInquiries}</Badge>
                }
            </TabsTrigger>
            <TabsTrigger value="announcements">
                Announcements
                {unreadAnnouncements > 0 && 
                    <Badge className="ml-2">{unreadAnnouncements}</Badge>
                }
            </TabsTrigger>
            <TabsTrigger value="inquiries">
                Inquiries
                {unreadInquiries > 0 && 
                    <Badge className="ml-2">{unreadInquiries}</Badge>
                }
            </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
            <NotificationList 
                title="All Notifications"
                items={[...notifications.announcements, ...notifications.inquiries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
            />
        </TabsContent>
        <TabsContent value="announcements" className="mt-6">
            <NotificationList title="Announcements" items={notifications.announcements} />
        </TabsContent>
        <TabsContent value="inquiries" className="mt-6">
            <NotificationList title="Inquiry Responses" items={notifications.inquiries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NotificationListProps {
    title: string;
    items: {
        id: number;
        title: string;
        department: string;
        date: string;
        read: boolean;
    }[];
}

function NotificationList({ title, items }: NotificationListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className={`flex items-center gap-4 p-4 rounded-lg ${!item.read ? 'bg-muted/50' : ''}`}>
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${title.includes('Announcements') ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'}`}>
                                {title.includes('Announcements') ? <Bell className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.department} &bull; {item.date}</p>
                            </div>
                            {!item.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                            <Button variant="ghost" size="icon">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">No notifications here.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}