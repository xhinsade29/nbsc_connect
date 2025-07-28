
'use client';

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const THEME_COLORS = [
    { name: 'Default', bgClass: 'bg-primary', color: '275 100% 25%' },
    { name: 'Red', bgClass: 'bg-red-500', color: '0 84% 60%' },
    { name: 'Green', bgClass: 'bg-green-500', color: '142 76% 36%' },
    { name: 'Blue', bgClass: 'bg-blue-500', color: '221 83% 53%' },
    { name: 'Yellow', bgClass: 'bg-yellow-500', color: '48 96% 53%' },
];

export default function SettingsPage() {
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [selectedThemeColor, setSelectedThemeColor] = useState(THEME_COLORS[0].color);

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

    const handleThemeColorChange = (color: string) => {
        setSelectedThemeColor(color);
        document.documentElement.style.setProperty('--primary', color);
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and notification preferences.</p>
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
                    <CardDescription>Choose what you want to be notified about.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">New Announcements</p>
                            <p className="text-sm text-muted-foreground">Receive a notification for every new announcement.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Message Replies</p>
                            <p className="text-sm text-muted-foreground">Get notified when a department replies to your message.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Inquiry Responses</p>
                            <p className="text-sm text-muted-foreground">Get notified when your AI inquiry gets a response.</p>
                        </div>
                        <Switch />
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
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
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
                    <p className="text-sm font-medium">Theme Color</p>
                    <div className="grid grid-cols-5 gap-2">
                       {THEME_COLORS.map(color => (
                            <Button 
                                key={color.name}
                                variant="outline" 
                                size="icon" 
                                className={cn(
                                    "h-8 w-8",
                                    color.bgClass,
                                    selectedThemeColor === color.color && "ring-2 ring-ring"
                                )}
                                onClick={() => handleThemeColorChange(color.color)}
                            />
                       ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
