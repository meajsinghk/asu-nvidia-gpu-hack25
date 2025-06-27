'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Volume2, Bot, User, X, Cpu, Zap, Loader2, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getLabChatResponseAction } from '@/app/actions';
import type { ChatMessage as ApiChatMessage } from '@/ai/flows/lab-chat-flow';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

type ChatPanelProps = {
    onClose: () => void;
    className?: string;
    numpyCode: string;
    cupyCode: string;
    numpyOutput: string | null;
    cupyOutput: string | null;
    gpuMetrics: string | null;
    aiAnalysis: string | null;
    onPushToCpu: (code: string) => void;
    onPushToGpu: (code: string) => void;
};

const CodeBlock = ({ code, onPushToCpu, onPushToGpu }: { code: string; onPushToCpu: () => void; onPushToGpu: () => void; }) => {
    const { toast } = useToast();
    const handlePushToCpu = () => {
        onPushToCpu();
        toast({ title: "Code pushed to CPU editor." });
    }
    const handlePushToGpu = () => {
        onPushToGpu();
        toast({ title: "Code pushed to GPU editor." });
    }
    return (
        <Card className="bg-background my-2 overflow-hidden">
            <div className="px-3 py-1 bg-muted flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="h-7" onClick={handlePushToCpu}>
                    <Cpu className="mr-2 h-4 w-4"/> Push to CPU
                </Button>
                <Button variant="ghost" size="sm" className="h-7" onClick={handlePushToGpu}>
                    <Zap className="mr-2 h-4 w-4"/> Push to GPU
                </Button>
            </div>
            <CardContent className="p-0">
                <pre className="p-3 text-sm whitespace-pre-wrap font-code overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </CardContent>
        </Card>
    )
}

const parseMessageContent = (content: string, onPushToCpu: (code: string) => void, onPushToGpu: (code: string) => void) => {
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)\n```/g;
    const elements: JSX.Element[] = [];
    let lastIndex = 0;
    let keyIndex = 0;

    for (const match of content.matchAll(codeBlockRegex)) {
        const textBefore = content.slice(lastIndex, match.index);
        if (textBefore.trim()) {
            elements.push(<p key={`text-${keyIndex++}`}>{textBefore}</p>);
        }

        const code = match[1];
        elements.push(<CodeBlock key={`code-${keyIndex++}`} code={code} onPushToCpu={() => onPushToCpu(code)} onPushToGpu={() => onPushToGpu(code)} />);

        lastIndex = match.index + match[0].length;
    }

    const textAfter = content.slice(lastIndex);
    if (textAfter.trim()) {
        elements.push(<p key={`text-${keyIndex++}`}>{textAfter}</p>);
    }

    return elements.length > 0 ? elements : [<p key="text-0">{content}</p>];
};

const suggestedQuestions = [
    "Explain the performance difference.",
    "Suggest an optimization for the CuPy code.",
    "What do the GPU metrics mean?"
];

export function ChatPanel({ onClose, className, numpyCode, cupyCode, numpyOutput, cupyOutput, gpuMetrics, aiAnalysis, onPushToCpu, onPushToGpu }: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: "Hi, to get started select a question from below or type one." },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        // SpeechRecognition is a browser-only API
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported by this browser.");
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev ? `${prev} ${transcript}` : transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                toast({
                    variant: 'destructive',
                    title: 'Microphone Access Denied',
                    description: 'Please enable microphone permissions in your browser settings to use voice input.'
                });
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        speechRecognitionRef.current = recognition;

    }, [toast]);

    const handleListen = () => {
        if (!speechRecognitionRef.current) return;

        if (isListening) {
            speechRecognitionRef.current.stop();
            setIsListening(false);
        } else {
            speechRecognitionRef.current.start();
            setIsListening(true);
        }
    };


    useEffect(() => {
        const scrollableNode = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableNode) {
            scrollableNode.scrollTo({
                top: scrollableNode.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = async (messageText?: string) => {
        const contentToSend = messageText || input.trim();
        if (contentToSend && !isLoading) {
            const newUserMessage: ChatMessage = { role: 'user', content: contentToSend };
            const currentHistory: ApiChatMessage[] = messages.map(m => ({ role: m.role, content: m.content }));
            
            setMessages(prev => [...prev, newUserMessage]);
            if (!messageText) {
                setInput('');
            }
            setIsLoading(true);

            const response = await getLabChatResponseAction({
                history: currentHistory,
                message: newUserMessage.content,
                context: {
                    numpyCode,
                    cupyCode,
                    numpyExecutionResult: numpyOutput,
                    cupyExecutionResult: cupyOutput,
                    gpuMetrics,
                    aiAnalysis,
                }
            });
            
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsLoading(false);
        }
    };

    return (
         <div className={cn("flex flex-col h-full w-full bg-card border-l text-foreground", className)}>
            <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close chat</span>
                </Button>
            </div>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                    {messages.map((message, index) => (
                        <div key={index} className={cn("flex items-start gap-3", message.role === 'user' && "justify-end")}>
                            {message.role === 'assistant' && (
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarFallback><Bot /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "p-3 rounded-lg max-w-[90%] text-sm",
                                message.role === 'assistant' ? "bg-muted" : "bg-primary text-primary-foreground"
                            )}>
                                <div>
                                    {parseMessageContent(message.content, onPushToCpu, onPushToGpu)}
                                </div>
                                {index === 0 && message.role === 'assistant' && (
                                    <div className="mt-4 flex flex-col items-start gap-2">
                                        {suggestedQuestions.map((q, i) => (
                                            <Button key={i} variant="outline" size="sm" className="h-auto text-left py-1 bg-background" onClick={() => handleSend(q)}>
                                                {q}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {message.role === 'user' && (
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className={cn("flex items-start gap-3")}>
                            <Avatar className="w-8 h-8">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div className={cn("p-3 rounded-lg max-w-[90%] text-sm bg-muted")}>
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background flex-shrink-0">
                <div className="relative w-full">
                    <Textarea
                        placeholder="Ask a follow-up question..."
                        className="pr-28"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={isLoading}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button type="submit" size="icon" variant="ghost" onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="w-5 h-5" />}
                        </Button>
                         <Button size="icon" variant="ghost" onClick={handleListen} disabled={isLoading}>
                            {isListening ? <MicOff className="w-5 h-5 text-destructive" /> : <Mic className="w-5 h-5" />}
                        </Button>
                        <Button size="icon" variant="ghost" disabled>
                            <Volume2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
