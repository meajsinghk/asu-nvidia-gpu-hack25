'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const numpyHighlights = [
  { text: 'np', className: 'text-red-400' },
  { text: 'numpy', className: 'text-red-400' }
];
const cupyHighlights = [
  { text: 'cp', className: 'text-green-400' },
  { text: 'cupy', className: 'text-green-400' },
  { text: 'synchronize', className: 'text-yellow-400' },
  { text: 'ElementwiseKernel', className: 'text-yellow-400' },
  { text: 'cudf', className: 'text-green-400' },
  { text: 'pandas', className: 'text-red-400' }
];

const CodeEditorWithHighlighting = ({ code, setCode, highlights, disabled, 'aria-label': ariaLabel }: {
  code: string;
  setCode: (value: string) => void;
  highlights: { text: string; className: string }[];
  disabled: boolean;
  'aria-label': string;
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const preRef = React.useRef<HTMLPreElement>(null);

  const highlightJsx = React.useMemo(() => {
    if (!code) return '';
    const allHighlights = [...highlights];
    const regex = new RegExp(`\\b(${allHighlights.map(h => h.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'g');
    
    return code.split(regex).map((part, i) => {
      const highlight = allHighlights.find(h => h.text === part);
      return highlight ? <span key={i} className={highlight.className}>{part}</span> : part;
    });
  }, [code, highlights]);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="relative w-full h-full bg-background rounded-md border border-input">
        <ScrollArea className="absolute top-0 left-0 w-full h-full">
            <pre
                ref={preRef}
                aria-hidden="true"
                className="relative w-full h-full min-h-[300px] px-3 py-2 font-code text-sm pointer-events-none whitespace-pre-wrap overflow-hidden [&_span]:font-bold"
            >
                <code>{highlightJsx}</code>
            </pre>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Textarea
            ref={textareaRef}
            onScroll={handleScroll}
            className="font-code h-full min-h-[300px] text-sm text-transparent bg-transparent caret-white resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 absolute top-0 left-0"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={disabled}
            aria-label={ariaLabel}
            spellCheck="false"
        />
    </div>
  );
};

type CodePanelProps = {
  numpyCode: string;
  setNumpyCode: (value: string) => void;
  cupyCode: string;
  setCupyCode: (value: string) => void;
  disabled: boolean;
};

export function CodePanel({ numpyCode, setNumpyCode, cupyCode, setCupyCode, disabled }: CodePanelProps) {
  const diffLines = React.useMemo(() => {
    const numpyLines = numpyCode.split('\n');
    const cupyLines = cupyCode.split('\n');
    const numpySet = new Set(numpyLines);
    const cupySet = new Set(cupyLines);
    
    const cpuOnly = numpyLines.filter(line => !cupySet.has(line) && line.trim() !== '').map(line => ({ text: line.trim(), className: 'text-red-400 font-bold' }));
    const gpuOnly = cupyLines.filter(line => !numpySet.has(line) && line.trim() !== '').map(line => ({ text: line.trim(), className: 'text-green-400 font-bold' }));

    return { cpu: cpuOnly, gpu: gpuOnly };
  }, [numpyCode, cupyCode]);
  
  const cpuHighlights = [...numpyHighlights, ...diffLines.cpu];
  const gpuHighlights = [...cupyHighlights, ...diffLines.gpu];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>CPU Code</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CodeEditorWithHighlighting 
            code={numpyCode} 
            setCode={setNumpyCode} 
            highlights={cpuHighlights} 
            disabled={disabled} 
            aria-label="CPU Code Editor"
          />
        </CardContent>
      </Card>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>GPU Code</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
           <CodeEditorWithHighlighting 
            code={cupyCode} 
            setCode={setCupyCode} 
            highlights={gpuHighlights} 
            disabled={disabled} 
            aria-label="GPU Code Editor"
          />
        </CardContent>
      </Card>
    </div>
  );
}
