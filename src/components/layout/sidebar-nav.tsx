
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge } from '@/components/ui/sidebar';
import { LayoutDashboard, Building2, Bot, Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useNotifications } from '@/context/notifications-context';
import { useMessages } from '@/context/messages-context';

const initialLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '/inquiry', label: 'Inquiry Tool', icon: Bot },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { notifications } = useNotifications();
  const { conversations } = useMessages();
  
  const notificationCount = (notifications.announcements.filter(n => !n.read).length || 0) + (notifications.inquiries.filter(n => !n.read).length || 0);
  const messageCount = conversations.reduce((sum, convo) => sum + convo.unreadStudent, 0);

  const links = initialLinks.map(link => {
    let notifications = 0;
    if (link.href === '/notifications') {
      notifications = notificationCount;
    } else if (link.href === '/messages') {
      notifications = messageCount;
    }
    return { ...link, notifications };
  });

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(link.href)}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
           {link.notifications > 0 && (
              <SidebarMenuBadge>{link.notifications}</SidebarMenuBadge>
            )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
