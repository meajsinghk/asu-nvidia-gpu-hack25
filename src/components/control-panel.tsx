'use client';

import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Loader2, Wifi } from "lucide-react";

type ControlPanelProps = {
  onRun: () => void;
  onReset: () => void;
  isLoading: boolean;
  onTestSol?: () => void;
  solBackendStatus?: 'checking' | 'connected' | 'disconnected';
};

export function ControlPanel({ onRun, onReset, isLoading, onTestSol, solBackendStatus }: ControlPanelProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onRun} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2" />}
        Run Analysis
      </Button>
      <Button variant="outline" onClick={onReset} disabled={isLoading}>
        <RotateCcw className="mr-2" /> Reset
      </Button>
      {onTestSol && (
        <Button 
          variant="secondary" 
          onClick={onTestSol} 
          disabled={isLoading}
          className={
            solBackendStatus === 'connected' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
            solBackendStatus === 'disconnected' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
            ''
          }
        >
          <Wifi className="mr-2" />
          Test Sol Backend
        </Button>
      )}
    </div>
  );
}
