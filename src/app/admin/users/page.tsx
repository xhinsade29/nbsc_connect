
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, User, Mail, Book, Shield, Trash2, KeyRound } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

interface User {
    id: number;
    name: string;
    email: string;
    course: string;
    status: 'Active' | 'Inactive';
}

const initialUsers: User[] = [
    { id: 1, name: 'Juan Dela Cruz', email: 'juan.delacruz@nbsc.edu.ph', course: 'BS in Information Technology', status: 'Active' },
    { id: 2, name: 'Maria Clara', email: 'maria.clara@nbsc.edu.ph', course: 'BS in Business Administration', status: 'Active' },
    { id: 3, name: 'Jose Rizal', email: 'jose.rizal@nbsc.edu.ph', course: 'BS in Education', status: 'Inactive' },
];

export default function AdminUsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [confirmAction, setConfirmAction] = useState<'deactivate' | 'reset' | null>(null);
    
    const handleAddStudent = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, this would submit to a backend
        toast({ title: "Student Added", description: "The new student account has been created." });
        setIsFormOpen(false);
    };

    const handleViewProfile = (user: User) => {
        setSelectedUser(user);
        setIsViewOpen(true);
    };

    const handleConfirmAction = (user: User, action: 'deactivate' | 'reset') => {
        setSelectedUser(user);
        setConfirmAction(action);
        setIsConfirmOpen(true);
    };

    const executeConfirmedAction = () => {
        if (!selectedUser || !confirmAction) return;

        if (confirmAction === 'deactivate') {
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'Inactive' } : u));
            toast({ title: "User Deactivated", variant: "destructive", description: `${selectedUser.name}'s account has been deactivated.` });
        } else if (confirmAction === 'reset') {
            toast({ title: "Password Reset Sent", description: `A password reset link has been sent to ${selectedUser.email}.` });
        }

        setIsConfirmOpen(false);
        setSelectedUser(null);
        setConfirmAction(null);
    };


  return (
    <>
        <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-3xl font-bold">Manage Users</h1>
                <p className="text-muted-foreground">Add, edit, and view student accounts.</p>
            </div>
            <Button onClick={handleAddStudent}>
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
                                            <DropdownMenuItem onClick={() => handleViewProfile(user)}><User className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleConfirmAction(user, 'reset')}><KeyRound className="mr-2 h-4 w-4" /> Reset Password</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleConfirmAction(user, 'deactivate')}><Trash2 className="mr-2 h-4 w-4" />Deactivate</DropdownMenuItem>
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

        {/* Add/Edit Student Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Institutional Email</Label>
                            <Input id="email" name="email" type="email" placeholder="id.number@nbsc.edu.ph" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="course">Course</Label>
                            <Input id="course" name="course" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Add Student</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

         {/* View Profile Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedUser?.email}`} />
                            <AvatarFallback>{selectedUser?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                             <DialogTitle className="text-2xl">{selectedUser?.name}</DialogTitle>
                             <DialogDescription>{selectedUser?.status}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{selectedUser?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Book className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{selectedUser?.course}</span>
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button type="button">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        {confirmAction === 'deactivate' && `This will deactivate ${selectedUser?.name}'s account. They will no longer be able to log in.`}
                        {confirmAction === 'reset' && `This will send a password reset link to ${selectedUser?.name}'s email.`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                    <Button variant={confirmAction === 'deactivate' ? "destructive" : "default"} onClick={executeConfirmedAction}>
                        {confirmAction === 'deactivate' ? 'Deactivate Account' : 'Send Reset Link'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
