
import { LoginForm } from '@/components/auth/login-form';
import Image from 'next/image';

export default function AdminLoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center text-center">
          <Image 
          src="https://nbsc.edu.ph/wp-content/uploads/2021/01/NBSC-Logo-1.png"
          alt="NBSC Logo"
          width={64}
          height={64}
          className="mb-4 rounded-full"
        />
        <h1 className="font-headline text-3xl font-bold">Admin Login</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in with your administrative credentials.
        </p>
      </div>
      <LoginForm isAdmin={true} />
    </div>
  );
}
