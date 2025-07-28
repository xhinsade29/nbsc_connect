
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, Palette } from "lucide-react";

export default function SettingsPage() {
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
                    <Button>Update Password</Button>
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
                    <Button>Save Preferences</Button>
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
                        <Switch id="dark-mode" />
                    </div>
                    <Separator />
                    <p className="text-sm font-medium">Theme Color</p>
                    <div className="grid grid-cols-5 gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-primary ring-2 ring-ring"></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-red-500"></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-green-500"></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-blue-500"></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-yellow-500"></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
