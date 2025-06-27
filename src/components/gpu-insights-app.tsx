'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from './app-header';
import { CodePanel } from './code-panel';
import { ControlPanel } from './control-panel';
import { MetricsPanel } from './metrics-panel';
import { ResultsPanel } from './results-panel';
import { getAiAnalysis } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { useCompletion } from '@/hooks/use-completion';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { NotesSidebar } from './notes-sidebar';
import { ChatPanel } from './chat-panel';
import { cn } from '@/lib/utils';
import { DatasetInfoPanel } from './dataset-info-panel';
import { modulesData, type Module } from '@/lib/modules';
import { SolBackendService } from '@/lib/sol-backend';

const SESSIONS_KEY = 'gpuInsightsSessions';

// Initialize Sol backend service
const solBackend = new SolBackendService(
  process.env.NEXT_PUBLIC_SOL_BACKEND_URL || 'http://localhost:8000'
);

type GpuMetrics = {
  utilization: number;
  memory: number;
  temp: number;
};

type SessionData = {
  numpyCode: string;
  cupyCode: string;
  numpyOutput: string | null;
  cupyOutput: string | null;
  numpyTime: number | null;
  cupyTime: number | null;
  gpuMetrics: GpuMetrics | null;
  aiAnalysis: string | null;
};


export function GpuInsightsApp() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('id');
  const { isCompleted, markAsCompleted } = useCompletion();

  const currentModule = useMemo(() => {
    return modulesData.find(m => m.id === moduleId) || modulesData[1]; // Default to Matrix Multiplication
  }, [moduleId]);

  const [numpyCode, setNumpyCode] = useState(currentModule.code.numpy);
  const [cupyCode, setCupyCode] = useState(currentModule.code.cupy);
  
  const [numpyOutput, setNumpyOutput] = useState<string | null>(null);
  const [cupyOutput, setCupyOutput] = useState<string | null>(null);
  const [numpyTime, setNumpyTime] = useState<number | null>(null);
  const [cupyTime, setCupyTime] = useState<number | null>(null);
  
  const [gpuMetrics, setGpuMetrics] = useState<GpuMetrics | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [analysisRunCompleted, setAnalysisRunCompleted] = useState(false);

  const [sessions, setSessions] = useState<Record<string, SessionData>>({});
  const [notes, setNotes] = useState('');
  const [notesSaveStatus, setNotesSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const notesInitialLoad = useRef(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');


  // Reset state when the module changes
  useEffect(() => {
    setNumpyCode(currentModule.code.numpy);
    setCupyCode(currentModule.code.cupy);
    setNumpyOutput(null);
    setCupyOutput(null);
    setNumpyTime(null);
    setCupyTime(null);
    setGpuMetrics(null);
    setAiAnalysis(null);
    setAnalysisRunCompleted(false);
    setActiveTab('ai');
  }, [currentModule]);


  const handleReset = useCallback(() => {
    setNumpyCode(currentModule.code.numpy);
    setCupyCode(currentModule.code.cupy);
    setNumpyOutput(null);
    setCupyOutput(null);
    setNumpyTime(null);
    setCupyTime(null);
    setGpuMetrics(null);
    setAiAnalysis(null);
    setAnalysisRunCompleted(false);
    setActiveTab('ai');
    toast({ title: "Session Reset", description: "The workspace has been reset to its default state." });
  }, [currentModule, toast]);

  const handleRun = async () => {
    setIsLoading(true);
    setIsAiLoading(true);
    setAnalysisRunCompleted(false);
    setAiAnalysis(null);
    setActiveTab('results'); // Switch to results tab on run

    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const MATRIX_SIZE = 1000; // Fixed size for simulation consistency

    // Simulated performance characteristics
    const numpyTimeCalc = Math.pow(MATRIX_SIZE / 1000, 2.8) * 0.8 + Math.random() * 0.1;
    const cupyTimeCalc = Math.pow(MATRIX_SIZE / 1000, 2.1) * 0.05 + Math.random() * 0.01;

    setNumpyTime(numpyTimeCalc);
    setCupyTime(cupyTimeCalc);

    const numpyResultText = `NumPy execution for ${currentModule.dataset.title} completed.\nExecution time: ${numpyTimeCalc.toFixed(4)} seconds`;
    const cupyResultText = `CuPy execution for ${currentModule.dataset.title} completed.\nExecution time: ${cupyTimeCalc.toFixed(4)} seconds`;

    setNumpyOutput(numpyResultText);
    setCupyOutput(cupyResultText);
    
    // Simulate GPU metrics
    const simulatedGpuMetrics = {
        utilization: 80 + Math.floor(Math.random() * 20),
        memory: 40 + Math.floor(Math.random() * 25) + Math.floor(MATRIX_SIZE / 500) * 5,
        temp: 65 + Math.floor(Math.random() * 15),
    };
    setGpuMetrics(simulatedGpuMetrics);

    setIsLoading(false);

    // Call AI for analysis
    const analysis = await getAiAnalysis({
      numpyCode: numpyCode,
      cupyCode: cupyCode,
      numpyExecutionResult: numpyResultText,
      cupyExecutionResult: cupyResultText,
      gpuMetrics: JSON.stringify(simulatedGpuMetrics, null, 2),
    });

    setAiAnalysis(analysis);
    setIsAiLoading(false);
    setAnalysisRunCompleted(true);

    if (currentModule.id && !isCompleted(currentModule.id)) {
      markAsCompleted(currentModule.id);
      toast({ title: "Progress Saved", description: `Module "${currentModule.title}" marked as complete.`, variant: 'success' });
    }
  };

  const handleSaveSession = (name: string) => {
    try {
      const sessionData: SessionData = {
        numpyCode, cupyCode, numpyOutput, cupyOutput, numpyTime, cupyTime, gpuMetrics, aiAnalysis
      };
      const newSessions = { ...sessions, [name]: sessionData };
      setSessions(newSessions);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions));
      toast({ title: "Session Saved", description: `Session "${name}" has been saved.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: "Could not save session to local storage." });
    }
  };

  const handleLoadSession = (name: string) => {
    try {
      const sessionData = sessions[name];
      if (sessionData) {
        setNumpyCode(sessionData.numpyCode);
        setCupyCode(sessionData.cupyCode);
        setNumpyOutput(sessionData.numpyOutput);
        setCupyOutput(sessionData.cupyOutput);
        setNumpyTime(sessionData.numpyTime);
        setCupyTime(sessionData.cupyTime);
        setGpuMetrics(sessionData.gpuMetrics);
        setAiAnalysis(sessionData.aiAnalysis);
        setAnalysisRunCompleted(true);
        setActiveTab('results');
        toast({ title: "Session Loaded", description: `Successfully loaded session "${name}".` });
      } else {
        toast({ variant: "destructive", title: "Load Failed", description: `Session "${name}" not found.` });
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Load Failed", description: "Could not load session from local storage." });
    }
  };
  
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(SESSIONS_KEY);
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.error("Failed to load sessions from local storage", error);
    }
  }, []);

  // Load notes when module changes
  useEffect(() => {
    if (currentModule.id) {
      try {
        const savedNotes = localStorage.getItem(`notes_${currentModule.id}`);
        if (savedNotes) {
          setNotes(savedNotes);
        } else {
          setNotes('');
        }
        notesInitialLoad.current = true; // Flag that we just loaded notes
        setNotesSaveStatus('idle'); // Start in idle state
      } catch (error) {
        console.error("Failed to load notes from local storage", error);
        setNotes('');
      }
    }
  }, [currentModule.id]);

  // Autosave notes with status indicator
  useEffect(() => {
    // If it's the initial load for this module's notes, don't trigger a save.
    if (notesInitialLoad.current) {
      notesInitialLoad.current = false;
      return;
    }
    
    if (currentModule.id) {
      setNotesSaveStatus('saving');
      const handler = setTimeout(() => {
        try {
          localStorage.setItem(`notes_${currentModule.id}`, notes);
          setNotesSaveStatus('saved');
          // After 2 seconds, fade back to idle
          const idleHandler = setTimeout(() => setNotesSaveStatus('idle'), 2000);
          return () => clearTimeout(idleHandler);
        } catch (error) {
          console.error("Failed to save notes to local storage", error);
          setNotesSaveStatus('idle');
        }
      }, 1500); // Debounce for 1.5 seconds

      return () => clearTimeout(handler);
    }
  }, [notes, currentModule.id]);

  return (
    <SidebarProvider defaultOpen={false}>
      <NotesSidebar notes={notes} setNotes={setNotes} disabled={!currentModule.id} saveStatus={notesSaveStatus} />
      <SidebarInset>
        <div className="flex w-full flex-1 overflow-hidden">
          <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
              <AppHeader 
                savedSessions={Object.keys(sessions)}
                onSave={handleSaveSession} 
                onLoad={handleLoadSession}
                onToggleChat={() => setIsChatOpen(o => !o)}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <DatasetInfoPanel module={currentModule} />
                  <div className="flex flex-col gap-6">
                    <ControlPanel 
                      onRun={handleRun}
                      onReset={handleReset}
                      isLoading={isLoading || isAiLoading}
                    />
                    <MetricsPanel metrics={gpuMetrics} />
                  </div>
              </div>
              
              <CodePanel 
                numpyCode={numpyCode} 
                setNumpyCode={setNumpyCode}
                cupyCode={cupyCode}
                setCupyCode={setCupyCode}
                disabled={isLoading || isAiLoading}
              />

              <ResultsPanel 
                numpyOutput={numpyOutput}
                cupyOutput={cupyOutput}
                numpyTime={numpyTime}
                cupyTime={cupyTime}
                aiAnalysis={aiAnalysis}
                isAiLoading={isAiLoading}
                metrics={gpuMetrics}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>
          <div className={cn(
              "transition-[width] duration-300 ease-in-out overflow-hidden",
              isChatOpen ? "w-full max-w-[450px]" : "w-0"
            )}>
             {isChatOpen && (
                <ChatPanel
                    onClose={() => setIsChatOpen(false)}
                    className="h-full"
                    numpyCode={numpyCode}
                    cupyCode={cupyCode}
                    numpyOutput={numpyOutput}
                    cupyOutput={cupyOutput}
                    gpuMetrics={gpuMetrics ? JSON.stringify(gpuMetrics, null, 2) : null}
                    aiAnalysis={aiAnalysis}
                    onPushToCpu={setNumpyCode}
                    onPushToGpu={setCupyCode}
                />
             )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
