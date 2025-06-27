'use client';

import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Loader2 } from "lucide-react";

type ControlPanelProps = {
  onRun: () => void;
  onReset: () => void;
  isLoading: boolean;
};

export function ControlPanel({ onRun, onReset, isLoading }: ControlPanelProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onRun} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2" />}
        Run Analysis
      </Button>
      <Button variant="outline" onClick={onReset} disabled={isLoading}>
        <RotateCcw className="mr-2" /> Reset
      </Button>
    </div>
  );
}
