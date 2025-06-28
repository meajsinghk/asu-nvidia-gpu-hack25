import { GpuInsightsApp } from "@/components/gpu-insights-app";
import type { Metadata } from 'next';
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'GPU Insights Lab',
  description: 'Compare CPU and GPU performance with AI-powered insights.',
};

function LabPageContent() {
  return (
    <main className="relative h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-full w-full"
      >
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
      </div>
      <GpuInsightsApp />
    </main>
  );
}

export default function LabPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LabPageContent />
    </Suspense>
  )
}
