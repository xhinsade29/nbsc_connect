
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Bot, Bell, ArrowRight, MessageSquare } from 'lucide-react';
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
import { useAdminNotifications, AdminNotificationItem } from '@/context/admin-notifications-context';
import Link from 'next/link';

export default function AdminNotificationsPage() {
  const { notifications, markAsRead } = useAdminNotifications();
  const [selectedNotification, setSelectedNotification] = useState<AdminNotificationItem | null>(null);

  const handleNotificationClick = (notification: AdminNotificationItem) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.uniqueId);
    }
  };

  const getUnreadCount = (items: AdminNotificationItem[]) => items.filter(n => !n.read).length;

  const allNotifications = [
      ...notifications.registrations,
      ...notifications.inquiries
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalUnread = getUnreadCount(allNotifications);
  const unreadRegistrations = getUnreadCount(notifications.registrations);
  const unreadInquiries = getUnreadCount(notifications.inquiries);

  return (
    <>
        <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-headline text-3xl font-bold">Admin Notifications</h1>
            <p className="text-muted-foreground">Key updates requiring administrative attention.</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
            <TabsList>
                <TabsTrigger value="all">
                    All
                    {totalUnread > 0 && <Badge className="ml-2">{totalUnread}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="registrations">
                    New Users
                    {unreadRegistrations > 0 && <Badge className="ml-2">{unreadRegistrations}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="inquiries">
                    New Inquiries
                    {unreadInquiries > 0 && <Badge className="ml-2">{unreadInquiries}</Badge>}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
                <NotificationList 
                    items={allNotifications}
                    onNotificationClick={handleNotificationClick}
                />
            </TabsContent>
            <TabsContent value="registrations" className="mt-6">
                <NotificationList 
                    items={notifications.registrations} 
                    onNotificationClick={handleNotificationClick}
                />
            </TabsContent>
            <TabsContent value="inquiries" className="mt-6">
                <NotificationList 
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
                            Received: {selectedNotification.date}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                       <p>{selectedNotification.description}</p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Close</Button>
                        </DialogClose>
                        {selectedNotification.ctaLink && (
                            <Button asChild>
                                <Link href={selectedNotification.ctaLink}>
                                    {selectedNotification.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
    </>
  );
}

interface NotificationListProps {
    items: AdminNotificationItem[];
    onNotificationClick: (item: AdminNotificationItem) => void;
}

function NotificationList({ items, onNotificationClick }: NotificationListProps) {
    const getIcon = (type: string) => {
        switch(type) {
            case 'registration': return <UserPlus className="h-5 w-5" />;
            case 'inquiry': return <Bot className="h-5 w-5" />;
            default: return <Bell className="h-5 w-5" />;
        }
    }
    
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.uniqueId} className={`flex items-center gap-4 p-4 rounded-lg ${!item.read ? 'bg-muted/50' : ''}`}>
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.type === 'registration' ? 'bg-blue-500/10 text-blue-500' : 'bg-accent/20 text-accent-foreground'}`}>
                               {getIcon(item.type)}
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
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
