
'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/layout/user-nav';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Megaphone, Building, Settings, Bot, Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge } from '@/components/ui/sidebar';
import { AdminNotificationsProvider, useAdminNotifications } from '@/context/admin-notifications-context';
import { AdminMessagesProvider, useAdminMessages } from '@/context/admin-messages-context';
import { ThemeProvider } from '@/components/theme-provider';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, notificationKey: '' },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone, notificationKey: '' },
  { href: '/admin/departments', label: 'Departments', icon: Building, notificationKey: '' },
  { href: '/admin/users', label: 'Users', icon: Users, notificationKey: '' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Bot, notificationKey: 'inquiries' },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, notificationKey: 'messages' },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell, notificationKey: 'notifications' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, notificationKey: '' },
];

function AdminSidebarNav() {
  const pathname = usePathname();
  const { notifications } = useAdminNotifications();
  const { conversations } = useAdminMessages();

  const getNotificationCount = (key: string) => {
    switch (key) {
      case 'inquiries':
        return notifications.inquiries.filter(n => !n.read).length;
      case 'messages':
        return conversations.reduce((acc, convo) => acc + convo.unread, 0);
      case 'notifications':
        return notifications.inquiries.filter(n => !n.read).length + notifications.registrations.filter(n => !n.read).length;
      default:
        return 0;
    }
  };


  return (
    <SidebarMenu>
      {adminLinks.map((link) => {
        const count = getNotificationCount(link.notificationKey);
        return (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.href}
              tooltip={link.label}
            >
              <Link href={link.href}>
                <link.icon />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
            {count > 0 && <SidebarMenuBadge>{count}</SidebarMenuBadge>}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  if (pathname === '/admin') {
      return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
                {children}
            </div>
        </ThemeProvider>
      )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AdminNotificationsProvider>
            <AdminMessagesProvider>
                <SidebarProvider>
                <Sidebar>
                    <SidebarHeader className="p-4">
                        <div className="flex items-center gap-3">
                            <Image 
                                src="https://nbsc.edu.ph/wp-content/uploads/2021/01/NBSC-Logo-1.png"
                                alt="NBSC Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <h1 className="font-headline text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">
                                NBSC Admin
                            </h1>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <AdminSidebarNav />
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
                        <SidebarTrigger className="sm:hidden" />
                        <UserNav />
                    </header>
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </SidebarInset>
                </SidebarProvider>
            </AdminMessagesProvider>
        </AdminNotificationsProvider>
    </ThemeProvider>
  );
}
