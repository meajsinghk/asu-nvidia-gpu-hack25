'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, BarChart2, Database } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const renderAiAnalysis = (text: string | null): React.ReactNode[] => {
  if (!text)
    return [
      <p key="placeholder">
        AI analysis will appear here after running the code.
      </p>,
    ];

  const blocks: React.ReactNode[] = [];
  const lines = text.split('\n');
  let currentList: string[] = [];
  let key = 0;

  function flushList() {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`list-${key++}`} className="list-disc pl-5 space-y-1 my-2">
          {currentList.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  }

  const parseInline = (line: string): React.ReactNode => {
    // Regex to find **bolded** text
    const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line) => {
    if (
      line.trim().startsWith('**') &&
      line.trim().endsWith('**') &&
      !line.includes('NumPy:**')
    ) {
      flushList();
      blocks.push(
        <h4
          key={`heading-${key++}`}
          className="font-bold text-base mt-4 mb-2"
        >
          {line.trim().slice(2, -2)}
        </h4>
      );
      return;
    }

    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      currentList.push(trimmedLine.substring(2));
      return;
    }

    flushList();

    if (trimmedLine) {
      blocks.push(
        <p key={`p-${key++}`} className="mb-3 last:mb-0">
          {parseInline(trimmedLine)}
        </p>
      );
    }
  });

  flushList(); // Make sure the last list is rendered
  return blocks;
};

type ResultsPanelProps = {
  numpyOutput: string | null;
  cupyOutput: string | null;
  numpyTime: number | null;
  cupyTime: number | null;
  aiAnalysis: string | null;
  isAiLoading: boolean;
  metrics: { utilization: number; temp: number } | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
};

// Custom shape for the bar with rounded corners on top
const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const radius = 8;
  return (
    <g>
      <path
        d={`M${x},${y + height} 
           L${x},${y + radius} 
           Q${x},${y} ${x + radius},${y} 
           L${x + width - radius},${y} 
           Q${x + width},${y} ${x + width},${y + radius} 
           L${x + width},${y + height} 
           Z`}
        fill={fill}
      />
    </g>
  );
};


export function ResultsPanel({
  numpyOutput,
  cupyOutput,
  numpyTime,
  cupyTime,
  aiAnalysis,
  isAiLoading,
  metrics,
  activeTab,
  onTabChange,
}: ResultsPanelProps) {
  const hasResults = numpyTime !== null && cupyTime !== null;

  const speedup = hasResults && cupyTime > 0 ? numpyTime / cupyTime : 0;

  const timeChartData = React.useMemo(
    () =>
      hasResults ? [{ name: 'Time (s)', CPU: numpyTime, GPU: cupyTime }] : [],
    [numpyTime, cupyTime, hasResults]
  );

  const carbonChartData = React.useMemo(() => {
    if (!hasResults) return [];

    const CPU_POWER_WATT = 150; // Average CPU power consumption
    const GPU_POWER_WATT = 300; // Average GPU power consumption under load
    const CARBON_INTENSITY_G_PER_KWH = 475; // Global average gCO2eq/kWh

    const calculateFootprint = (timeSec: number, powerWatt: number) => {
      const timeHours = timeSec / 3600;
      const energyKWh = (powerWatt / 1000) * timeHours;
      const carbonGrams = energyKWh * CARBON_INTENSITY_G_PER_KWH;
      return carbonGrams;
    };

    const cpuFootprint = calculateFootprint(numpyTime, CPU_POWER_WATT);
    const gpuFootprint = calculateFootprint(cupyTime, GPU_POWER_WATT);

    return [{ name: 'CO₂e', CPU: cpuFootprint, GPU: gpuFootprint }];
  }, [numpyTime, cupyTime, hasResults]);

  const vizChartData = React.useMemo(() => {
    if (!hasResults) return [];
    return Array.from({ length: 150 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.floor(i / 50),
    }));
  }, [hasResults]);

  const tableData = React.useMemo(() => {
    if (!hasResults) return [];
    return vizChartData.slice(0, 5).map(d => ({ x: d.x.toFixed(2), y: d.y.toFixed(2), z: d.z }));
  }, [vizChartData, hasResults]);


  if (!hasResults && !isAiLoading && !aiAnalysis) {
    return null;
  }

  return (
    <Card className="transition-all duration-500">
      <CardHeader>
        <CardTitle>Analysis & Results</CardTitle>
        <CardDescription>
          View execution outputs, benchmark charts, and AI-powered performance
          insights. Charts appear after running an analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Execution Results</TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="mr-2 text-accent" /> AI Insights
            </TabsTrigger>
          </TabsList>
          <TabsContent value="results" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-center">
                  Execution Time Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center justify-around gap-8 p-6 pt-2">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">CPU Time</p>
                  <p className="text-3xl font-bold font-mono">
                    {hasResults ? `${numpyTime.toFixed(4)}s` : 'N/A'}
                  </p>
                </div>
                {hasResults && (
                  <div className="text-center text-primary p-2 rounded-lg bg-primary/10">
                    <p className="text-sm font-medium">Speedup</p>
                    <p className="text-2xl font-bold">{speedup.toFixed(2)}x</p>
                    <p className="text-xs">
                      {speedup > 1 ? 'Faster on GPU' : 'Faster on CPU'}
                    </p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">GPU Time</p>
                  <p className="text-3xl font-bold font-mono">
                    {hasResults ? `${cupyTime.toFixed(4)}s` : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {hasResults && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BarChart2 className="mr-2 text-primary" />
                  Benchmark Charts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Execution Time</CardTitle>
                      <CardDescription>Lower is better.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          CPU: {
                            label: 'CPU',
                            color: 'hsl(var(--chart-1))',
                          },
                          GPU: {
                            label: 'GPU',
                            color: 'hsl(var(--chart-2))',
                          },
                        }}
                        className="h-[250px] w-full"
                      >
                        <BarChart
                          data={timeChartData}
                          layout="vertical"
                          margin={{ left: 10 }}
                        >
                          <CartesianGrid horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={60}
                          />
                          <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<ChartTooltipContent indicator="line" />}
                          />
                          <Legend />
                          <Bar
                            dataKey="CPU"
                            fill="var(--color-CPU)"
                            radius={[0, 8, 8, 0]}
                            shape={<CustomBar />}
                          />
                          <Bar
                            dataKey="GPU"
                            fill="var(--color-GPU)"
                            radius={[0, 8, 8, 0]}
                            shape={<CustomBar />}
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Estimated Carbon Footprint
                      </CardTitle>
                      <CardDescription>
                        Lower is better. Based on simulated power draw.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                           CPU: {
                            label: 'CPU',
                            color: 'hsl(var(--chart-1))',
                          },
                          GPU: {
                            label: 'GPU',
                            color: 'hsl(var(--chart-2))',
                          },
                        }}
                        className="h-[250px] w-full"
                      >
                        <BarChart
                          data={carbonChartData}
                          layout="vertical"
                          margin={{ left: 10 }}
                        >
                          <CartesianGrid horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={60}
                          />
                          <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={
                              <ChartTooltipContent
                                formatter={(value) =>
                                  `${Number(value).toExponential(2)} g`
                                }
                                indicator="line"
                              />
                            }
                          />
                          <Legend />
                          <Bar
                            dataKey="CPU"
                            fill="var(--color-CPU)"
                            radius={[0, 8, 8, 0]}
                            shape={<CustomBar />}
                          />
                          <Bar
                            dataKey="GPU"
                            fill="var(--color-GPU)"
                            radius={[0, 8, 8, 0]}
                            shape={<CustomBar />}
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
             {hasResults && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Database className="mr-2 text-primary" />
                  Dataset Visualizations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dataset Head (First 5 Rows)</CardTitle>
                      <CardDescription>A preview of the generated dataset, styled like a spreadsheet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16 text-center bg-muted/50 font-semibold">#</TableHead>
                              <TableHead className="font-semibold">X Value</TableHead>
                              <TableHead className="font-semibold">Y Value</TableHead>
                              <TableHead className="font-semibold">Cluster</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono text-center bg-muted/50">{index + 1}</TableCell>
                                <TableCell className="font-mono">{row.x}</TableCell>
                                <TableCell className="font-mono">{row.y}</TableCell>
                                <TableCell className="font-mono">{row.z}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">K-Means Clustering Visualization</CardTitle>
                      <CardDescription>A visual representation of the dataset with simulated clusters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{}} className="h-[250px] w-full">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid />
                          <XAxis type="number" dataKey="x" name="x" unit="" />
                          <YAxis type="number" dataKey="y" name="y" unit="" />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                          <Scatter name="Clusters" data={vizChartData} fill="var(--chart-2-color)">
                            {vizChartData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={['hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'][_entry.z]} />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="ai"
            className="mt-4 p-6 rounded-lg bg-muted border border-dashed border-accent/50 min-h-[280px]"
          >
            <h4 className="font-headline text-lg font-bold mb-2 flex items-center">
              <Sparkles className="mr-2 text-accent" />
              AI Performance Analysis
            </h4>
            {isAiLoading ? (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                {renderAiAnalysis(aiAnalysis)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
