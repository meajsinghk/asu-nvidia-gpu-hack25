import { Clock, Cpu, GitBranch, Zap, SlidersHorizontal } from 'lucide-react';
import type { UniverseOutcome } from '@/ai/flows/multiverse-flow';
import { cn } from '@/lib/utils';
import React from 'react';

type MetricProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const Metric = ({ icon, label, value }: MetricProps) => (
  <div className="flex items-center gap-2 text-sm text-cyan-200/80">
    <div className="text-primary">{icon}</div>
    <span className="font-medium">{label}:</span>
    <span className="font-mono text-white">{value}</span>
  </div>
);

export function UniverseCard({ universe }: { universe: UniverseOutcome }) {
  return (
    <div className={cn(
        "bg-slate-900/30 border border-cyan-400/20 rounded-md backdrop-blur-sm p-4 relative transition-all duration-300",
        "shadow-[0_0_10px_rgba(0,192,255,0.1)] hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
        )}
    >
       {/* Corner accents */}
      <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-primary/80 rounded-tl-md" />
      <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-primary/80 rounded-tr-md" />
      <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-primary/80 rounded-bl-md" />
      <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-primary/80 rounded-br-md" />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
            <h3 className="text-xl font-bold flex items-center gap-2 text-cyan-200">
                <Zap className="text-primary size-5" />
                {universe.universeId}
            </h3>
             <p className="text-sm text-cyan-200/70 mb-3 flex items-center gap-2 font-mono">
                <SlidersHorizontal className="size-4" />
                {universe.parameters}
            </p>
            <p className="text-neutral-300 leading-relaxed text-sm">{universe.narrative}</p>
        </div>

        <div className="flex-shrink-0 sm:border-l sm:pl-4 border-cyan-400/20 space-y-2">
            <Metric icon={<Clock className="size-4" />} label="Time" value={universe.simulatedMetrics.executionTime} />
            <Metric icon={<Cpu className="size-4" />} label="Warp Occupancy" value={universe.simulatedMetrics.warpOccupancy} />
            <Metric icon={<GitBranch className="size-4" />} label="Divergence" value={universe.simulatedMetrics.threadDivergence} />
        </div>
      </div>
    </div>
  );
}
