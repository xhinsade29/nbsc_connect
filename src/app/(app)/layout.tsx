
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { UserNav } from '@/components/layout/user-nav';
import Image from 'next/image';
import { MessagesProvider } from '@/context/messages-context';
import { NotificationsProvider } from '@/context/notifications-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationsProvider>
      <MessagesProvider>
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
                        NBSC Connect
                    </h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav />
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
      </MessagesProvider>
    </NotificationsProvider>
  );
}
