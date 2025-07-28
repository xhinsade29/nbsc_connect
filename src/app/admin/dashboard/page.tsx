import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage application content and users.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Restricted Area</CardTitle>
              <CardDescription>This section is only accessible to users with administrative privileges.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            Here you would typically find tools to manage announcements, events, department information, and student access.
            This functionality would be built out to provide full control over the platform's content and user base.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
