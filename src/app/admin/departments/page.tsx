
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, BookOpen, FileSignature, Laptop, HeartHandshake, Trash2, Edit, Loader2 } from 'lucide-react';
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
import { subscribeToDepartments, addDepartment, updateDepartment, deleteDepartment, Department } from '@/services/departments';

const ICONS: Record<string, LucideIcon> = {
    BookOpen,
    FileSignature,
    Laptop,
    HeartHandshake,
};

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const DepartmentIcon = ({ iconName }: { iconName: string }) => {
    const Icon = ICONS[iconName] || BookOpen;
    return <Icon className="h-5 w-5 text-muted-foreground" />;
};


export default function AdminDepartmentsPage() {
    const { toast } = useToast();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToDepartments(setDepartments);
        return () => unsubscribe();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const newDepartmentData = {
            name: name,
            slug: selectedDepartment ? selectedDepartment.slug : slugify(name),
            icon: 'BookOpen', // Default icon
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            description: formData.get('description') as string,
        };

        try {
            if (selectedDepartment) {
                await updateDepartment(selectedDepartment.id, newDepartmentData);
                toast({ title: "Department Updated", description: "The department details have been successfully updated." });
            } else {
                await addDepartment(newDepartmentData);
                toast({ title: "Department Created", description: "The new department has been added." });
            }
            setTimeout(() => {
                setIsFormOpen(false);
                setSelectedDepartment(null);
                setIsSubmitting(false);
            }, 3000);
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
            setIsSubmitting(false);
        }
    };

    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (department: Department) => {
        setSelectedDepartment(department);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedDepartment) {
            setIsSubmitting(true);
            try {
                await deleteDepartment(selectedDepartment.id);
                toast({ title: "Department Removed", variant: "destructive", description: "The department has been removed from the platform." });
            } catch (error) {
                toast({ title: "Error", description: "Could not remove department.", variant: "destructive" });
            } finally {
                 setTimeout(() => {
                    setIsDeleteConfirmOpen(false);
                    setSelectedDepartment(null);
                    setIsSubmitting(false);
                }, 3000);
            }
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
                            <TableRow key={dept.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <DepartmentIcon iconName={dept.icon} />
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
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={selectedDepartment?.description} required />
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
                        <DialogClose asChild><Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Department
                        </Button>
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
                    <DialogClose asChild><Button variant="secondary" disabled={isSubmitting}>Cancel</Button></DialogClose>
                    <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
