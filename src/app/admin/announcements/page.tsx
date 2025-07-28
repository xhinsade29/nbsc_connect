
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Trash2, Edit, View } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { subscribeToAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement, Announcement } from '@/services/announcements';

const departments = [
  'Academics Office',
  'Registrar\'s Office',
  'IT Services',
  'Student Affairs',
];

export default function AdminAnnouncementsPage() {
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToAnnouncements(setAnnouncements);
        return () => unsubscribe();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const announcementData = {
            title: formData.get('title') as string,
            category: formData.get('category') as 'Academics' | 'Event' | 'Announcement',
            department: formData.get('department') as string,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            description: formData.get('description') as string,
            image: 'https://placehold.co/600x400.png', // Default image for now
            dataAiHint: 'school event', // Default hint
        };

        try {
            if (selectedAnnouncement) {
                await updateAnnouncement(selectedAnnouncement.id, announcementData);
                toast({ title: "Announcement Updated", description: "The announcement has been successfully updated." });
            } else {
                await addAnnouncement(announcementData);
                toast({ title: "Announcement Created", description: "The new announcement has been posted." });
            }
            
            setIsFormOpen(false);
            setSelectedAnnouncement(null);
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        }
    };

    const handleEdit = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsFormOpen(true);
    };

    const handleView = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsViewOpen(true);
    };
    
    const handleDeleteClick = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDeleteConfirmOpen(true);
    };
    
    const handleDeleteConfirm = async () => {
        if (selectedAnnouncement) {
            try {
                await deleteAnnouncement(selectedAnnouncement.id);
                toast({ title: "Announcement Deleted", variant: "destructive", description: "The announcement has been removed." });
                setIsDeleteConfirmOpen(false);
                setSelectedAnnouncement(null);
            } catch (error) {
                 toast({ title: "Error", description: "Could not delete announcement.", variant: "destructive" });
            }
        }
    };


  return (
    <>
        <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-3xl font-bold">Manage Announcements</h1>
                <p className="text-muted-foreground">Create, edit, and view all campus announcements.</p>
            </div>
            <Button onClick={() => { setSelectedAnnouncement(null); setIsFormOpen(true); }}>
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
                                <TableCell><Badge variant={announcement.category === 'Event' ? 'default' : 'secondary'}>{announcement.category}</Badge></TableCell>
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
                                            <DropdownMenuItem onClick={() => handleEdit(announcement)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleView(announcement)}><View className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(announcement)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
                    <DialogTitle>{selectedAnnouncement ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details below. The announcement will be visible to all students.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={selectedAnnouncement?.title} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue={selectedAnnouncement?.category}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Announcement">Announcement</SelectItem>
                                    <SelectItem value="Event">Event</SelectItem>
                                    <SelectItem value="Academics">Academics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                             <Select name="department" defaultValue={selectedAnnouncement?.department}>
                                <SelectTrigger id="department">
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" defaultValue={selectedAnnouncement?.description} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Save Announcement</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
                    <DialogDescription>
                        {selectedAnnouncement?.department} &bull; {selectedAnnouncement?.date}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p>{selectedAnnouncement?.description}</p>
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button type="button">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the announcement.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                    <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
