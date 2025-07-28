
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Megaphone, Building, Bot, ArrowRight } from 'lucide-react';

const stats = [
    { title: 'Total Students', value: '1,234', icon: Users, change: '+20 since last month', href: '/admin/users' },
    { title: 'Announcements', value: '58', icon: Megaphone, change: '+5 this week', href: '/admin/announcements' },
    { title: 'Departments', value: '4', icon: Building, change: 'All systems operational', href: '/admin/departments' },
    { title: 'Pending Inquiries', value: '12', icon: Bot, change: 'Needs administrative action', href: '/admin/inquiries' },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the NBSC Connect management panel.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
             <Link href={stat.href} key={stat.title}>
                <Card className="group hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                         <div className="flex items-center text-sm font-medium text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            Go to {stat.title}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
