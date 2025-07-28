'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const conversations = [
    {
        id: 1,
        name: 'Registrar\'s Office',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'office building',
        lastMessage: 'Your documents are ready for pickup.',
        timestamp: '10:30 AM',
        unread: 0,
    },
    {
        id: 2,
        name: 'IT Services',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'server gear',
        lastMessage: 'We have resolved the issue with your portal access.',
        timestamp: 'Yesterday',
        unread: 2,
    },
];

const messages = [
    {
        id: 1,
        sender: 'IT Services',
        text: 'We have resolved the issue with your portal access. Please try logging in again.',
        timestamp: '9:15 AM',
        isUser: false,
    },
    {
        id: 2,
        sender: 'You',
        text: 'Thank you, it\'s working now!',
        timestamp: '9:18 AM',
        isUser: true,
    }
]

export default function MessagesPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
            <Card className="md:col-span-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline">Messages</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                     <ScrollArea className="h-full">
                        <div className="space-y-2">
                        {conversations.map((convo) => (
                            <div key={convo.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer border-b">
                                <Avatar>
                                    <AvatarImage src={convo.avatar} alt={convo.name} data-ai-hint={convo.dataAiHint} />
                                    <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-semibold">{convo.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">{convo.timestamp}</p>
                                    {convo.unread > 0 && (
                                        <div className="mt-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full ml-auto">
                                            {convo.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <Card className="md:col-span-2 flex flex-col">
                <CardHeader className="border-b">
                    <div className="flex items-center gap-4">
                         <Avatar>
                            <AvatarImage src="https://placehold.co/100x100.png" alt="IT Services" data-ai-hint="server gear" />
                            <AvatarFallback>IT</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-bold text-lg">IT Services</h2>
                            <p className="text-sm text-muted-foreground">Online</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow p-6 space-y-4">
                    <ScrollArea className="h-[calc(100vh-22rem)]">
                        <div className="space-y-6 pr-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                {!msg.isUser && (
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://placehold.co/100x100.png" alt="IT Services" data-ai-hint="server gear" />
                                        <AvatarFallback>IT</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>{msg.timestamp}</p>
                                </div>
                                 {msg.isUser && (
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@student" />
                                        <AvatarFallback>SN</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardHeader className="border-t pt-4">
                    <div className="relative">
                        <Input placeholder="Type a message..." className="pr-12" />
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}
