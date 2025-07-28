
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, BookOpen, FileSignature, Laptop, HeartHandshake, Trash2, Edit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Department {
  name: string;
  slug: string;
  Icon: LucideIcon;
  email: string;
  phone: string;
}

const initialDepartments: Department[] = [
  { name: 'Academics Office', slug: 'academics-office', Icon: BookOpen, email: 'academics@nbsc.edu.ph', phone: '(012) 345-6789' },
  { name: 'Registrar\'s Office', slug: 'registrars-office', Icon: FileSignature, email: 'registrar@nbsc.edu.ph', phone: '(012) 345-6780' },
  { name: 'IT Services', slug: 'it-services', Icon: Laptop, email: 'itservices@nbsc.edu.ph', phone: '(012) 345-6781' },
  { name: 'Student Affairs', slug: 'student-affairs', Icon: HeartHandshake, email: 'student.affairs@nbsc.edu.ph', phone: '(012) 345-6782' },
];

const ICONS: Record<string, LucideIcon> = {
    BookOpen,
    FileSignature,
    Laptop,
    HeartHandshake,
};

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');


export default function AdminDepartmentsPage() {
    const { toast } = useToast();
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const newDepartment = {
            name: name,
            slug: selectedDepartment ? selectedDepartment.slug : slugify(name),
            Icon: BookOpen, // Default icon, can be improved with a selector
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
        };

        if (selectedDepartment) {
            setDepartments(departments.map(d => d.slug === selectedDepartment.slug ? newDepartment : d));
            toast({ title: "Department Updated", description: "The department details have been successfully updated." });
        } else {
            setDepartments([newDepartment, ...departments]);
            toast({ title: "Department Created", description: "The new department has been added." });
        }
        
        setIsFormOpen(false);
        setSelectedDepartment(null);
    };

    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (department: Department) => {
        setSelectedDepartment(department);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedDepartment) {
            setDepartments(departments.filter(d => d.slug !== selectedDepartment.slug));
            toast({ title: "Department Removed", variant: "destructive", description: "The department has been removed from the platform." });
            setIsDeleteConfirmOpen(false);
            setSelectedDepartment(null);
        }
    };


  return (
    <>
        <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-3xl font-bold">Manage Departments</h1>
                <p className="text-muted-foreground">Add, edit, and view campus departments.</p>
            </div>
            <Button onClick={() => { setSelectedDepartment(null); setIsFormOpen(true); }}>
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
                                            <DropdownMenuItem onClick={() => handleEdit(dept)}><Edit className="mr-2 h-4 w-4" /> Edit Details</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(dept)}><Trash2 className="mr-2 h-4 w-4" /> Remove</DropdownMenuItem>
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

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedDepartment ? 'Edit Department' : 'New Department'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Department Name</Label>
                            <Input id="name" name="name" defaultValue={selectedDepartment?.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={selectedDepartment?.email} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" defaultValue={selectedDepartment?.phone} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Save Department</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently remove the department and its associated data.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                    <Button variant="destructive" onClick={handleDeleteConfirm}>Remove</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
