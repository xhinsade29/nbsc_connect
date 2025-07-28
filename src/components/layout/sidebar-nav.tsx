
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge } from '@/components/ui/sidebar';
import { LayoutDashboard, Building2, Bot, Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const initialLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, notifications: 0 },
  { href: '/departments', label: 'Departments', icon: Building2, notifications: 0 },
  { href: '/inquiry', label: 'Inquiry Tool', icon: Bot, notifications: 0 },
  { href: '/notifications', label: 'Notifications', icon: Bell, notifications: 2 },
  { href: '/messages', label: 'Messages', icon: MessageSquare, notifications: 1 },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [links, setLinks] = useState(initialLinks);

  const handleLinkClick = (href: string) => {
    const updatedLinks = links.map(link => {
      if (link.href === href) {
        return { ...link, notifications: 0 };
      }
      return link;
    });
    setLinks(updatedLinks);
  };

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href} onClick={() => handleLinkClick(link.href)}>
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
