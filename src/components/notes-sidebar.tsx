'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, Loader2 } from 'lucide-react';

type NotesSidebarProps = {
  notes: string;
  setNotes: (notes: string) => void;
  disabled: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
};

const AutosaveIndicator = ({ status }: { status: NotesSidebarProps['saveStatus'] }) => {
    if (status === 'saving') {
      return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="animate-spin size-3" />
          <span>Saving...</span>
        </div>
      );
    }

    if (status === 'saved') {
      return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Check className="size-4 text-green-500" />
          <span>Autosaved</span>
        </div>
      );
    }
    
    return <div className="h-5" />; // Placeholder to prevent layout shift
};

export function NotesSidebar({ notes, setNotes, disabled, saveStatus }: NotesSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-semibold">Notes</h2>
          <AutosaveIndicator status={disabled ? 'idle' : saveStatus} />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {disabled ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                <p>Notes are available when you launch a specific module from the main hub.</p>
            </div>
        ) : (
            <div className="flex flex-col h-full gap-2">
                <Label htmlFor="notes-textarea" className="sr-only">Module Notes</Label>
                <Textarea
                    id="notes-textarea"
                    placeholder="Type your notes for this module here..."
                    className="flex-grow h-full bg-muted/50 border-0 resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
