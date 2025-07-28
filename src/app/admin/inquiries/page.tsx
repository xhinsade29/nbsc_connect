
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, MoreHorizontal, Bot } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const inquiries = [
    { id: 1, query: "I forgot my password, how do I reset it?", recommended: "IT Services", confidence: 0.95, status: 'Pending' },
    { id: 2, query: "What are the requirements for shifting courses?", recommended: "Academics Office", confidence: 0.88, status: 'Approved' },
    { id: 3, query: "Is there a penalty for late enrollment?", recommended: "Registrar's Office", confidence: 0.92, status: 'Rejected' },
];

export default function AdminInquiriesPage() {
  return (
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
                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                            <Check className="h-4 w-4 text-green-500" />
                                        </Button>
                                         <Button variant="outline" size="icon" className="h-8 w-8">
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
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Re-assign Department</DropdownMenuItem>
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
  );
}
