'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, Building2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Result = {
    department: string;
    reason: string;
    confidence: number;
} | null;

export function InquiryTool() {
  const [inquiry, setInquiry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result[] | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inquiry.trim()) return;

    setIsLoading(true);
    setResult(null);

    // Mock AI processing delay
    setTimeout(() => {
        // Mock result based on keywords
        if (inquiry.toLowerCase().includes('grade')) {
             setResult([
                { department: 'Registrar\'s Office', reason: 'Handles all inquiries related to student grades, transcripts, and academic records.', confidence: 0.92 },
                { department: 'Academics Office', reason: 'Oversees curriculum and academic policies, may be relevant for grade appeals.', confidence: 0.65 },
            ]);
        } else if (inquiry.toLowerCase().includes('enrollment') || inquiry.toLowerCase().includes('subject')) {
             setResult([
                { department: 'Academics Office', reason: 'Manages subject offerings and enrollment procedures.', confidence: 0.88 },
                { department: 'Registrar\'s Office', reason: 'Processes official enrollment and manages student records.', confidence: 0.75 },
            ]);
        } else {
             setResult([
                { department: 'Student Affairs', reason: 'Provides general student support and can direct you if your query is unclear.', confidence: 0.85 },
            ]);
        }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Your Inquiry</CardTitle>
            <CardDescription>
              Please be as detailed as possible for the best results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'I have a question about my final grade in a subject...'"
              className="min-h-[150px]"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !inquiry.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Analyzing...' : 'Find Department'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold">Results</h2>
        {isLoading && (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <div>
                            <p className="font-semibold">Analyzing your inquiry...</p>
                            <p className="text-sm text-muted-foreground">Please wait a moment.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
        {result && (
            <Alert>
                <Building2 className="h-4 w-4" />
                <AlertTitle className="font-headline">Recommended Departments</AlertTitle>
                <AlertDescription className="mt-2 space-y-4">
                   {result.map((res, index) => (
                     <div key={index} className="rounded-md border p-4">
                        <div className="flex justify-between items-start">
                             <h4 className="font-bold">{res.department}</h4>
                             <div className="text-xs font-medium text-right text-muted-foreground">
                                 Confidence
                                 <p className="text-lg font-bold text-primary">{(res.confidence * 100).toFixed(0)}%</p>
                             </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{res.reason}</p>
                        <Button variant="link" className="px-0 h-auto mt-2">
                            Contact {res.department}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </div>
                   ))}
                </AlertDescription>
            </Alert>
        )}
        {!isLoading && !result && (
            <Card className="flex items-center justify-center p-10">
                <div className="text-center">
                    <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Your results will appear here.
                    </p>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
}
