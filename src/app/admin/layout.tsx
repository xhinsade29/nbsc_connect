
'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/layout/user-nav';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Megaphone, Building, Settings, Bot } from 'lucide-react';
import Link from 'next/link';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';


const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/departments', label: 'Departments', icon: Building },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Bot },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {adminLinks.map((link) => (
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
        </SidebarMenuItem>
      ))}
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
        <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
            {children}
        </div>
      )
  }

  return (
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
  );
}
