
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const announcements = [
    { id: 1, title: 'Midterm Examinations Schedule', category: 'Academics', department: 'Academics Office', date: 'October 25, 2024' },
    { id: 2, title: 'NBSC Foundation Day Celebration', category: 'Event', department: 'Student Affairs', date: 'October 22, 2024' },
    { id: 3, title: 'System Maintenance Alert', category: 'Announcement', department: 'IT Services', date: 'October 20, 2024' },
];

export default function AdminAnnouncementsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Manage Announcements</h1>
            <p className="text-muted-foreground">Create, edit, and view all campus announcements.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Announcement
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Existing Announcements</CardTitle>
            <CardDescription>A list of all announcements posted on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {announcements.map((announcement) => (
                        <TableRow key={announcement.id}>
                            <TableCell className="font-medium">{announcement.title}</TableCell>
                            <TableCell><Badge variant="secondary">{announcement.category}</Badge></TableCell>
                            <TableCell>{announcement.department}</TableCell>
                            <TableCell>{announcement.date}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
