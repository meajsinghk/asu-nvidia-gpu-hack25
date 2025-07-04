'use client';

import { useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Save, FolderDown, Home, Notebook, MessageSquare } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";

type AppHeaderProps = {
  savedSessions: string[];
  onSave: (name: string) => void;
  onLoad: (name: string) => void;
  onToggleChat: () => void;
};

export function AppHeader({ savedSessions, onSave, onLoad, onToggleChat }: AppHeaderProps) {
  const [sessionName, setSessionName] = useState("");
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { toggleSidebar } = useSidebar();

  const handleSaveClick = () => {
    if (sessionName.trim()) {
      onSave(sessionName.trim());
      setIsSaveOpen(false);
      setSessionName("");
    }
  };

  return (
    <header className="flex flex-wrap gap-4 justify-between items-center pb-4 border-b">
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Notebook />
          </Button>
        <Link href="/" passHref>
          <Button variant="outline">
            <Home className="mr-2" /> All Modules
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary font-headline hidden sm:block">GPU Insights Lab</h1>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <AlertDialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline"><Save className="mr-2" /> Save Session</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Session</AlertDialogTitle>
              <AlertDialogDescription>
                Enter a name for your session to save the current code, parameters, and results.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              placeholder="e.g., My First Analysis"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveClick()}
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSessionName("")}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveClick} disabled={!sessionName.trim()}>Save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><FolderDown className="mr-2" /> Load Session</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Saved Sessions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {savedSessions.length > 0 ? (
              savedSessions.map(name => (
                <DropdownMenuItem key={name} onClick={() => onLoad(name)}>
                  {name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No sessions saved</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" onClick={onToggleChat}>
          <MessageSquare className="mr-2" /> Chat with AI
        </Button>
      </div>
    </header>
  );
}
