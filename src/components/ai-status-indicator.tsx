/**
 * AI Status Component
 * 
 * Shows the current AI system status and capabilities
 */

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, Cpu, Globe } from 'lucide-react';

interface AIStatus {
  browserLLM: boolean;
  currentSystem: string;
  modelInfo?: {
    textModel: string;
    codeModel: string;
    status: string;
  };
}

export function AIStatusIndicator() {
  const [status, setStatus] = useState<AIStatus>({
    browserLLM: false,
    currentSystem: 'Loading...'
  });

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      // Check browser LLM availability
      const browserAvailable = typeof window !== 'undefined';
      let modelInfo;
      
      if (browserAvailable) {
        try {
          // Import browserLLM dynamically to avoid SSR issues
          const { browserLLM } = await import('@/lib/browser-llm');
          await browserLLM.initialize();
          modelInfo = browserLLM.getModelInfo();
        } catch (error) {
          console.log('Browser LLM check failed:', error);
        }
      }

      const currentSystem = browserAvailable ? 'Browser LLM (Transformers.js)' : 'Rule-based fallback';

      setStatus({
        browserLLM: browserAvailable,
        currentSystem,
        modelInfo
      });
    } catch (error) {
      console.error('Failed to check AI status:', error);
      setStatus({
        browserLLM: false,
        currentSystem: 'Rule-based fallback'
      });
    }
  };

  const getStatusColor = () => {
    if (status.browserLLM) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (status.browserLLM) return 'AI: Browser LLM';
    return 'AI: Fallback Mode';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor()} text-white hover:opacity-80 cursor-help`}
          >
            <Brain className="w-3 h-3 mr-1" />
            {getStatusText()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-sm">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">AI System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">
                  Browser LLM: {status.browserLLM ? (
                    <span className="text-blue-600 font-medium">Ready</span>
                  ) : (
                    <span className="text-gray-500">Initializing...</span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span className="text-sm">
                  Current: <span className="font-medium">{status.currentSystem}</span>
                </span>
              </div>
              
              {status.modelInfo && (
                <div className="mt-2 pt-2 border-t">
                  <div className="text-xs text-gray-600 mb-1">Models:</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {status.modelInfo.textModel}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {status.modelInfo.codeModel}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Status: {status.modelInfo.status}
                  </div>
                </div>
              )}
              
              <div className="mt-2 pt-2 border-t">
                <div className="text-xs text-gray-600">
                  💡 Real AI models running in your browser!
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
