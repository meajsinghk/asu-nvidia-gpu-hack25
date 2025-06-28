'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { StarfieldBackground } from '@/components/starfield-background';
import { cn } from '@/lib/utils';

export default function MultiverseLaunchPage() {
  const router = useRouter();
  const [isFlashing, setIsFlashing] = useState(false);

  const handleLaunch = () => {
    setIsFlashing(true);
    // Navigate at the peak of the flash animation
    setTimeout(() => {
      router.push('/universe/simulation');
    }, 750);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <StarfieldBackground />
      {isFlashing && (
        <div className="pointer-events-none fixed inset-0 z-50 animate-flash bg-white" />
      )}

      {/* Cockpit Frame Overlay (NON-INTERACTIVE) */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div className="relative h-[95vh] w-[95vw] md:h-[90vh] md:w-[90vw]">
          
          {/* Clipped Container */}
          <div className="absolute inset-0" style={{ clipPath: 'polygon(120px 0, 100% 0, 100% 100%, 0 100%, 0 120px)' }}>
            {/* Main Frame Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400/50 via-cyan-400/20 to-transparent opacity-50 blur-lg" />
            {/* Main Frame Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/30" />
          </div>

          {/* Other Corner Brackets */}
          <div className="absolute -top-1 -right-1 h-24 w-24 border-t-4 border-r-4 border-cyan-400 rounded-tr-3xl" />
          <div className="absolute -bottom-1 -left-1 h-24 w-24 border-b-4 border-l-4 border-cyan-400 rounded-bl-3xl" />
          <div className="absolute -bottom-1 -right-1 h-24 w-24 border-b-4 border-r-4 border-cyan-400 rounded-br-3xl" />
          
          <div className="absolute top-6 right-6 h-8 w-8 border-t-2 border-r-2 border-cyan-400/50" />
          <div className="absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-cyan-400/50" />
          <div className="absolute bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-cyan-400/50" />
        </div>
      </div>

      {/* Interactive Home Button */}
      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <div className="relative h-[95vh] w-[95vw] md:h-[90vh] md:w-[90vw]">
            <div
              className="absolute -top-1 -left-1 z-40 h-[120px] w-[120px] border-t-4 border-l-4 border-cyan-400"
              style={{ clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' }}
            >
              <Link
                href="/"
                className="futuristic-sheen pointer-events-auto group absolute inset-[2px] flex h-[calc(120px-4px)] w-[calc(120px-4px)] items-center justify-center bg-[linear-gradient(135deg,_#2d3748_0%,_#1a2332_100%)] hover:bg-[linear-gradient(135deg,_#4fd1c7_0%,_#38b2ac_100%)]"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' }}
                aria-label="Home"
              >
                <Home
                  className="h-6 w-6 text-cyan-400 transition-colors group-hover:text-slate-900"
                  style={{ transform: 'translate(-28px, -28px)' }}
                />
              </Link>
            </div>
          </div>
      </div>


      <main className="relative z-30 flex min-h-screen flex-col items-center justify-center p-4 text-center sm:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="font-orbitron text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 drop-shadow-[0_2px_10px_rgba(34,211,238,0.4)] whitespace-nowrap">
          The GPU Multiverse
          </h1>
          <p className="font-orbitron mt-6 max-w-2xl mx-auto text-lg text-neutral-200 leading-relaxed">
          Launch an AI simulation to witness how your code performs across parallel universes with unique hardware parameters.
          </p>
        </div>
        
        <div className="mt-12">
            <button 
              onClick={handleLaunch} 
              disabled={isFlashing}
              className="launch-button-futuristic clipped-corners"
            >
              <span className="launch-button-futuristic-text">
                Launch into Multiverse
              </span>
            </button>
        </div>
      </main>
    </div>
  );
}
