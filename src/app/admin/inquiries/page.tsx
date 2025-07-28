
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, MoreHorizontal, Bot, Edit, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Inquiry, InquiryStatus, subscribeToInquiries, updateInquiryStatus, reassignInquiry, seedInquiries } from '@/services/inquiries';

const departments = [
  'Academics Office',
  'Registrar\'s Office',
  'IT Services',
  'Student Affairs',
];

export default function AdminInquiriesPage() {
    const { toast } = useToast();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isReassignOpen, setIsReassignOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        // This seeds the database with initial data if it's empty.
        // It's safe to run multiple times as it uses setDoc with consistent IDs.
        seedInquiries();

        const unsubscribe = subscribeToInquiries(setInquiries);
        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (id: string, status: InquiryStatus) => {
        try {
            await updateInquiryStatus(id, status);
            toast({
                title: `Inquiry ${status}`,
                description: "The inquiry has been updated.",
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update inquiry status.',
                variant: 'destructive',
            });
        }
    };

    const handleReassignClick = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setIsReassignOpen(true);
    };

    const handleReassignSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newDepartment = formData.get('department') as string;

        if (selectedInquiry && newDepartment) {
            try {
                await reassignInquiry(selectedInquiry.id, newDepartment);
                 toast({
                    title: "Inquiry Re-assigned",
                    description: `Inquiry routed to ${newDepartment}.`
                });
                setIsReassignOpen(false);
                setSelectedInquiry(null);
            } catch (error) {
                 toast({
                    title: 'Error',
                    description: 'Failed to re-assign inquiry.',
                    variant: 'destructive',
                });
            }
        }
    };

  return (
    <>
        <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-headline text-3xl font-bold">Manage Inquiries</h1>
            <p className="text-muted-foreground">Review and route inquiries from the AI tool.</p>
        </div>

        <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>How it works</AlertTitle>
            <AlertDescription>
                The AI Inquiry Tool automatically suggests a department based on the student's query. Your role is to approve or reject these suggestions to ensure accuracy and help train the model.
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle>Pending Inquiries</CardTitle>
                <CardDescription>Review the AI's recommendations and route the inquiries to the correct department.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Student's Query</TableHead>
                            <TableHead>AI Recommendation</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inquiries.map((inquiry) => (
                            <TableRow key={inquiry.id}>
                                <TableCell className="font-medium">{inquiry.query}</TableCell>
                                <TableCell>{inquiry.recommended}</TableCell>
                                <TableCell>{(inquiry.confidence * 100).toFixed(0)}%</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        inquiry.status === 'Approved' ? 'default' :
                                        inquiry.status === 'Rejected' ? 'destructive' : 'secondary'
                                    }>{inquiry.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {inquiry.status === 'Pending' ? (
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleStatusChange(inquiry.id, 'Approved')}>
                                                <Check className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleStatusChange(inquiry.id, 'Rejected')}>
                                                <X className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleReassignClick(inquiry)}><Edit className="mr-2 h-4 w-4" /> Re-assign Department</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(inquiry.id, 'Pending')}><RotateCcw className="mr-2 h-4 w-4" /> Mark as Pending</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </div>
        
        {/* Re-assign Dialog */}
        <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Re-assign Inquiry</DialogTitle>
                    <DialogDescription>
                        Select a different department to route this inquiry to.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleReassignSubmit}>
                    <div className="py-4">
                        <p className="text-sm font-medium mb-2">Query:</p>
                        <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md mb-4">{selectedInquiry?.query}</p>
                        <Select name="department" defaultValue={selectedInquiry?.recommended}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Re-assign and Approve</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </>
  );
}
