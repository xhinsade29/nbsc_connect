
'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Book, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const { toast } = useToast();
    const [fullName, setFullName] = useState("Student Name");
    const [initialFullName, setInitialFullName] = useState("Student Name");

    const handleSaveChanges = () => {
        setInitialFullName(fullName);
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    };

    const handleCancel = () => {
        setFullName(initialFullName);
    };

    const handlePictureChange = () => {
        toast({
            title: "Feature not available",
            description: "Changing profile picture is not yet implemented.",
            variant: "destructive"
        })
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and manage your personal information.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@student" />
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-2xl">{initialFullName}</CardTitle>
              <CardDescription>ID: 2021-00123</CardDescription>
              <Button variant="outline" size="sm" className="mt-4" onClick={handlePictureChange}>
                Change Picture
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Personal Details</h3>
                 <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="name" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-10" 
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Institutional Email</Label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" defaultValue="student@nbsc.edu.ph" disabled className="pl-10" />
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold">Academic Information</h3>
                 <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                     <div className="relative">
                        <Book className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="course" defaultValue="Bachelor of Science in Information Technology" disabled className="pl-10" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="year">Year Level</Label>
                     <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="year" defaultValue="4th Year" disabled className="pl-10" />
                    </div>
                </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
