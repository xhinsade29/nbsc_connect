
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, User, Mail, Book, Shield, Trash2, KeyRound, Loader2 } from 'lucide-react';
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
import { subscribeToUsers, addUser, updateUser, UserData } from '@/services/users';


export default function AdminUsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [confirmAction, setConfirmAction] = useState<'deactivate' | 'reset' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        const unsubscribe = subscribeToUsers(setUsers);
        return () => unsubscribe();
    }, []);

    const handleAddStudent = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const newUser: Omit<UserData, 'id' | 'status'> = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            course: formData.get('course') as string,
        };

        try {
            await addUser(newUser);
            toast({ title: "Student Added", description: "The new student account has been created." });
        } catch (error) {
            toast({ title: "Error Adding Student", description: "Could not create the student account.", variant: "destructive" });
        } finally {
            setTimeout(() => {
                setIsFormOpen(false);
                setIsSubmitting(false);
            }, 3000);
        }
    };

    const handleViewProfile = (user: UserData) => {
        setSelectedUser(user);
        setIsViewOpen(true);
    };

    const handleConfirmAction = (user: UserData, action: 'deactivate' | 'reset') => {
        setSelectedUser(user);
        setConfirmAction(action);
        setIsConfirmOpen(true);
    };

    const executeConfirmedAction = async () => {
        if (!selectedUser || !confirmAction) return;

        setIsSubmitting(true);

        try {
            if (confirmAction === 'deactivate') {
                await updateUser(selectedUser.id, { status: 'Inactive' });
                toast({ title: "User Deactivated", variant: "destructive", description: `${selectedUser.name}'s account has been deactivated.` });
            } else if (confirmAction === 'reset') {
                 // This is still a mock for now, as it involves email sending logic.
                toast({ title: "Password Reset Sent", description: `A password reset link has been sent to ${selectedUser.email}.` });
            }
        } catch (error) {
             toast({ title: "Error", description: "Could not complete the action.", variant: "destructive" });
        } finally {
            setTimeout(() => {
                setIsConfirmOpen(false);
                setSelectedUser(null);
                setConfirmAction(null);
                setIsSubmitting(false);
            }, 3000);
        }
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
                                            {user.status === 'Active' && <DropdownMenuItem className="text-destructive" onClick={() => handleConfirmAction(user, 'deactivate')}><Trash2 className="mr-2 h-4 w-4" />Deactivate</DropdownMenuItem>}
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
                        <DialogClose asChild><Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Student
                        </Button>
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
                    <DialogClose asChild><Button variant="secondary" disabled={isSubmitting}>Cancel</Button></DialogClose>
                    <Button variant={confirmAction === 'deactivate' ? "destructive" : "default"} onClick={executeConfirmedAction} disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmAction === 'deactivate' ? 'Deactivate Account' : 'Send Reset Link'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
