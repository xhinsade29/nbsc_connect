
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const users = [
    { id: 1, name: 'Juan Dela Cruz', email: 'juan.delacruz@nbsc.edu.ph', course: 'BS in Information Technology', status: 'Active' },
    { id: 2, name: 'Maria Clara', email: 'maria.clara@nbsc.edu.ph', course: 'BS in Business Administration', status: 'Active' },
    { id: 3, name: 'Jose Rizal', email: 'jose.rizal@nbsc.edu.ph', course: 'BS in Education', status: 'Inactive' },
];

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground">Add, edit, and view student accounts.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>A list of all registered student accounts.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p>{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{user.course}</TableCell>
                            <TableCell>
                                <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>{user.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
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
