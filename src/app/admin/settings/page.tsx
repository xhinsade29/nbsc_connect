
'use client';

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();

    const handleUpdatePassword = () => {
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
        });
    }

    const handleSavePreferences = () => {
        toast({
            title: "Preferences Saved",
            description: "Your notification settings have been updated.",
        });
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your administrator account and panel preferences.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5" />
                        <CardTitle className="font-headline text-xl">Security</CardTitle>
                    </div>
                    <CardDescription>Update your password and security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" placeholder="••••••••" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="••••••••" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
                </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                     <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5" />
                        <CardTitle className="font-headline text-xl">Notifications</CardTitle>
                    </div>
                    <CardDescription>Choose what you want to be notified about as an admin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">New Student Registrations</p>
                            <p className="text-sm text-muted-foreground">Receive an email when a new student registers.</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">New AI Inquiries</p>
                            <p className="text-sm text-muted-foreground">Get notified when a new inquiry needs review.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleSavePreferences}>Save Preferences</Button>
                 </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5" />
                        <CardTitle className="font-headline text-xl">Appearance</CardTitle>
                    </div>
                    <CardDescription>Customize the look and feel of the admin panel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <Switch 
                            id="dark-mode" 
                            checked={theme === 'dark'}
                            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        />
                    </div>
                    <Separator />
                    <p className="text-sm text-muted-foreground">More appearance settings can be added here.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
