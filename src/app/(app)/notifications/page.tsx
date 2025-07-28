
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useNotifications, NotificationItem } from '@/context/notifications-context';

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markNotificationAsRead(notification.uniqueId);
    }
  };

  const unreadAnnouncements = notifications.announcements.filter(n => !n.read).length;
  const unreadInquiries = notifications.inquiries.filter(n => !n.read).length;

  const allNotifications = [
      ...notifications.announcements,
      ...notifications.inquiries
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // This is a mock sort, proper date parsing is needed for real usage

  return (
    <>
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
                    items={allNotifications}
                    onNotificationClick={handleNotificationClick}
                />
            </TabsContent>
            <TabsContent value="announcements" className="mt-6">
                <NotificationList 
                    title="Announcements" 
                    items={notifications.announcements} 
                    onNotificationClick={handleNotificationClick}
                />
            </TabsContent>
            <TabsContent value="inquiries" className="mt-6">
                <NotificationList 
                    title="Inquiry Responses" 
                    items={notifications.inquiries}
                    onNotificationClick={handleNotificationClick}
                />
            </TabsContent>
        </Tabs>
        </div>
        
        {selectedNotification && (
            <Dialog open={!!selectedNotification} onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline">{selectedNotification.title}</DialogTitle>
                        <DialogDescription>
                            From: {selectedNotification.department} &bull; {selectedNotification.date}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                       <p>{selectedNotification.description}</p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
    </>
  );
}

interface NotificationListProps {
    title: string;
    items: NotificationItem[];
    onNotificationClick: (item: NotificationItem) => void;
}

function NotificationList({ title, items, onNotificationClick }: NotificationListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.uniqueId} className={`flex items-center gap-4 p-4 rounded-lg ${!item.read ? 'bg-muted/50' : ''}`}>
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.type === 'announcement' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'}`}>
                                {item.type === 'announcement' ? <Bell className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.department} &bull; {item.date}</p>
                            </div>
                            {!item.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                            <Button variant="ghost" size="icon" onClick={() => onNotificationClick(item)}>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            <MessageSquare className="mx-auto h-12 w-12" />
                            <p className="mt-4">No notifications here.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
