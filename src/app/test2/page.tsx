'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarfieldBackground } from '@/components/starfield-background';
import { UniverseCard } from '@/components/universe-card';
import { getMultiverseAnalysis } from '@/app/actions';
import type { MultiverseOutput } from '@/ai/flows/multiverse-flow';
import { ArrowLeft, Loader2, Rocket, AlertTriangle, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultCode = `import cupy as cp

# Define the size of the vectors
size = 10_000_000

# Create two large vectors on the GPU
vec_a = cp.random.rand(size).astype(cp.float32)
vec_b = cp.random.rand(size).astype(cp.float32)

# Perform element-wise addition
# This is a memory-bound operation.
result = vec_a + vec_b

# Synchronize to ensure the operation is complete
cp.cuda.Stream.null.synchronize()

print("Vector addition complete.")
`;

// New component for styling panels
const HudPanel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
    "bg-slate-900/50 border border-cyan-300/20 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,192,255,0.1),inset_0_0_8px_rgba(0,192,255,0.1)] p-6 relative",
    className
    )}>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-300/70 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-300/70 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-300/70 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-300/70 rounded-br-lg" />
      {children}
  </div>
);


export default function Test2Page() {
    const [pythonCode, setPythonCode] = useState(defaultCode);
    const [results, setResults] = useState<MultiverseOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRunSimulation = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);

        const response = await getMultiverseAnalysis({ pythonCode });

        if ('error' in response) {
            setError(response.error);
        } else {
            setResults(response);
        }

        setIsLoading(false);
    };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white overflow-y-auto font-sans">
      <StarfieldBackground />
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,162,255,0.3),rgba(255,255,255,0))] opacity-50" />
      
      <header className="absolute top-0 left-0 p-4 sm:p-6 z-20">
        <Link href="/" passHref>
          <Button variant="outline" className="bg-slate-800/50 border-cyan-300/30 text-cyan-300 backdrop-blur-sm hover:bg-cyan-300/10 hover:border-cyan-300/50">
            <ArrowLeft className="mr-2" />
            Back to Hub
          </Button>
        </Link>
      </header>
       
      <main className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8 pt-20">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            {/* Title */}
            <div className="text-center">
                 <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-300 drop-shadow-[0_2px_4px_rgba(0,192,255,0.4)]">
                    Test 2 Page (from Multiverse)
                </h1>
                <p className="mt-2 text-lg text-cyan-200/80">Input your GPU code to analyze its performance across parallel universes.</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Panel: Code Input */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                     <HudPanel className="flex flex-col flex-grow">
                        <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                           <Wand2 /> Source Code Input
                        </h2>
                        <Textarea 
                            value={pythonCode}
                            onChange={(e) => setPythonCode(e.target.value)}
                            placeholder="Enter your Python GPU code here..."
                            className="font-code h-full min-h-[300px] flex-grow bg-slate-950/70 border-cyan-300/20 text-cyan-200 focus:ring-primary focus:border-primary placeholder:text-cyan-200/50"
                        />
                        <Button 
                            onClick={handleRunSimulation} 
                            disabled={isLoading}
                            size="lg"
                            className="mt-4 w-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 shadow-[0_0_20px_hsl(var(--primary)/0.5)] transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.7)] disabled:shadow-none"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin mr-2" />
                            ) : (
                                <Rocket className="mr-2" />
                            )}
                            {isLoading ? 'Simulating...' : 'Run Simulation'}
                        </Button>
                     </HudPanel>
                </div>

                {/* Right Panel: Results */}
                <div className="lg:col-span-3">
                    <HudPanel className="min-h-full">
                        <h2 className="text-xl font-bold text-primary mb-3">Simulation Results</h2>
                        <div className="space-y-4">
                            {isLoading && (
                                <div className="text-center py-20">
                                    <Loader2 className="size-12 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-lg text-cyan-200/80 animate-pulse">Analyzing Universes...</p>
                                    <p className="text-sm text-cyan-200/60">AI is simulating outcomes across different GPU architectures.</p>
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-20 flex flex-col items-center text-destructive">
                                    <AlertTriangle className="size-12 mx-auto mb-4"/>
                                    <p className="text-lg font-bold">Simulation Failed</p>
                                    <p className="text-sm text-destructive/80 max-w-md">{error}</p>
                                </div>
                            )}

                            {!isLoading && !results && !error && (
                                <div className="text-center py-20 text-cyan-200/70">
                                    <p>Results from parallel universes will appear here.</p>
                                </div>
                            )}

                             {results && (
                                <div className="grid grid-cols-1 gap-4 data-[state=open]:animate-in data-[state=open]:fade-in-50 duration-500">
                                    {results.universes.map((universe) => (
                                        <UniverseCard key={universe.universeId} universe={universe} />
                                    ))}
                                </div>
                             )}
                        </div>
                    </HudPanel>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
