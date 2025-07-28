import { LoginForm } from '@/components/auth/login-form';
import { Users } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-headline text-3xl font-bold">NBSC Connect</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in with your institutional email to continue.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
