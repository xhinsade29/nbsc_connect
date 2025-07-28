
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMessages } from '@/context/messages-context';


export default function MessagesPage() {
    const searchParams = useSearchParams();
    const departmentSlug = searchParams.get('department');
    const { conversations, selectedConvo, setSelectedConvo, sendMessage } = useMessages();
    const [newMessage, setNewMessage] = useState('');
    const scrollAreaRef = useRef<React.ElementRef<'div'>>(null);

    useEffect(() => {
        if (departmentSlug) {
            const convo = conversations.find(c => c.slug === departmentSlug);
            if (convo) {
                setSelectedConvo(convo);
            }
        }
    }, [departmentSlug, conversations, setSelectedConvo]);

     useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
        }
    }, [selectedConvo?.messages]);


    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvo) return;
        sendMessage(selectedConvo.id, newMessage);
        setNewMessage('');
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
            <Card className={cn(
                "md:col-span-1 flex-col",
                isMobile && selectedConvo ? 'hidden' : 'flex',
                !isMobile && 'flex'
            )}>
                <CardHeader>
                    <CardTitle className="font-headline">Messages</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                     <ScrollArea className="h-full">
                        <div className="space-y-2">
                        {conversations.map((convo) => (
                            <div key={convo.id} className={cn("flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer border-b", selectedConvo?.id === convo.id && 'bg-muted/50')} onClick={() => setSelectedConvo(convo)}>
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
                                    {convo.unreadStudent > 0 && (
                                        <div className="mt-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full ml-auto">
                                            {convo.unreadStudent}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className={cn(
                "md:col-span-2 flex-col",
                isMobile && !selectedConvo ? 'hidden' : 'flex',
                !isMobile && 'flex'
            )}>
                {selectedConvo ? (
                    <>
                        <CardHeader className="border-b">
                            <div className="flex items-center gap-4">
                                {isMobile && (
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedConvo(null)}>
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                )}
                                <Avatar>
                                    <AvatarImage src={selectedConvo.avatar} alt={selectedConvo.name} data-ai-hint={selectedConvo.dataAiHint} />
                                    <AvatarFallback>{selectedConvo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-bold text-lg">{selectedConvo.name}</h2>
                                    <p className="text-sm text-muted-foreground">Online</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow p-6 space-y-4">
                            <ScrollArea className="h-[calc(100vh-22rem)]" ref={scrollAreaRef}>
                                <div className="space-y-6 pr-4">
                                {selectedConvo.messages.map((msg) => {
                                    const isUser = msg.sender === 'You';
                                    return (
                                        <div key={msg.id} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                            {!isUser && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={selectedConvo.avatar} alt={selectedConvo.name} data-ai-hint={selectedConvo.dataAiHint} />
                                                    <AvatarFallback>{selectedConvo.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                <p className="text-sm">{msg.text}</p>
                                                <p className={`text-xs mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>{msg.timestamp}</p>
                                            </div>
                                            {isUser && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@student" />
                                                    <AvatarFallback>SN</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )
                                })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardHeader className="border-t pt-4">
                            <form className="relative" onSubmit={handleSendMessage}>
                                <Input
                                    placeholder="Type a message..."
                                    className="pr-12"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </form>
                        </CardHeader>
                    </>
                ) : (
                     <CardContent className="flex flex-col items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                            <MessageSquare size={48} className="mx-auto" />
                            <p className="mt-4 font-semibold">Select a conversation</p>
                            <p className="text-sm">Choose a department from the list to start messaging.</p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
