
'use client';

import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge } from '@/components/ui/sidebar';
import { LayoutDashboard, Building2, Bot, Bell } from 'lucide-react';
import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, notifications: 0 },
  { href: '/departments', label: 'Departments', icon: Building2, notifications: 0 },
  { href: '/inquiry', label: 'Inquiry Tool', icon: Bot, notifications: 0 },
  { href: '/notifications', label: 'Notifications', icon: Bell, notifications: 2 },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
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
           {link.notifications > 0 && (
              <SidebarMenuBadge>{link.notifications}</SidebarMenuBadge>
            )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
