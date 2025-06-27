'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, MemoryStick, Thermometer } from "lucide-react";
import React from "react";

type MetricItemProps = {
  icon: React.ReactNode;
  label: string;
  value: number | null | undefined;
  unit: string;
};

const MetricItem = ({ icon, label, value, unit }: MetricItemProps) => (
  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg transition-all duration-300 flex-1 min-w-[150px]">
    <div className="p-2 bg-background rounded-full text-accent shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-bold font-mono transition-all duration-300">
        {value !== null && value !== undefined ? value.toFixed(0) : "N/A"}
        <span className="text-base font-sans text-muted-foreground">{unit}</span>
      </p>
    </div>
  </div>
);

type MetricsPanelProps = {
  metrics: {
    utilization: number;
    memory: number;
    temp: number;
  } | null;
};

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live GPU Metrics</CardTitle>
        <CardDescription>Simulated real-time GPU performance data.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <MetricItem icon={<Cpu className="size-5" />} label="Utilization" value={metrics?.utilization} unit="%" />
        <MetricItem icon={<MemoryStick className="size-5" />} label="Memory" value={metrics?.memory} unit="%" />
        <MetricItem icon={<Thermometer className="size-5" />} label="Temperature" value={metrics?.temp} unit="°C" />
      </CardContent>
    </Card>
  );
}
