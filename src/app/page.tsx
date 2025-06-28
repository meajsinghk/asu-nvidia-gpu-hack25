import { ModuleCanvas } from '@/components/module-canvas';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GPU Learning Hub',
  description: 'An interactive canvas to explore GPU programming concepts.',
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-y-auto bg-background text-foreground">
       <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-full w-full"
      >
        <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
      </div>
      <ModuleCanvas />
    </main>
  );
}
