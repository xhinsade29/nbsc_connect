
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const createFormSchema = (isAdmin: boolean) => z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).refine(email => isAdmin || email.endsWith('@nbsc.edu.ph'), {
    message: "Please use your institutional email (@nbsc.edu.ph).",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm({ isAdmin = false }: { isAdmin?: boolean }) {
    const router = useRouter();
    const { toast } = useToast();
    const formSchema = createFormSchema(isAdmin);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Login attempt with:", values);
    if (isAdmin) {
        if (values.email === 'admin@nbsc.edu.ph' && values.password === 'admin123') {
            router.push('/admin/dashboard');
        } else {
            toast({
                title: "Invalid Credentials",
                description: "The email or password you entered is incorrect.",
                variant: "destructive",
            });
        }
    } else {
         if (values.email.endsWith('@nbsc.edu.ph')) {
             router.push('/dashboard');
         } else {
             toast({
                title: "Invalid Email",
                description: "Please use your institutional email (@nbsc.edu.ph).",
                variant: "destructive",
            });
         }
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{isAdmin ? 'Admin Email' : 'Institutional Email'}</FormLabel>
                        <FormControl>
                            <Input placeholder={isAdmin ? "admin@nbsc.edu.ph" : "id.number@nbsc.edu.ph"} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-4">
                    <Button type="submit">Login</Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Can&apos;t log in? Please contact the IT department.
                    </p>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
