
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, BookOpen, FileSignature, Laptop, HeartHandshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Department {
  name: string;
  slug: string;
  Icon: LucideIcon;
  email: string;
  phone: string;
}

const departments: Department[] = [
  { name: 'Academics Office', slug: 'academics-office', Icon: BookOpen, email: 'academics@nbsc.edu.ph', phone: '(012) 345-6789' },
  { name: 'Registrar\'s Office', slug: 'registrars-office', Icon: FileSignature, email: 'registrar@nbsc.edu.ph', phone: '(012) 345-6780' },
  { name: 'IT Services', slug: 'it-services', Icon: Laptop, email: 'itservices@nbsc.edu.ph', phone: '(012) 345-6781' },
  { name: 'Student Affairs', slug: 'student-affairs', Icon: HeartHandshake, email: 'student.affairs@nbsc.edu.ph', phone: '(012) 345-6782' },
];

export default function AdminDepartmentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Manage Departments</h1>
            <p className="text-muted-foreground">Add, edit, and view campus departments.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Department
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Existing Departments</CardTitle>
            <CardDescription>A list of all departments on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Department Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {departments.map((dept) => (
                        <TableRow key={dept.slug}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <dept.Icon className="h-5 w-5 text-muted-foreground" />
                                    {dept.name}
                                </div>
                            </TableCell>
                            <TableCell>{dept.email}</TableCell>
                            <TableCell>{dept.phone}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                        <DropdownMenuItem>Manage Staff</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
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
