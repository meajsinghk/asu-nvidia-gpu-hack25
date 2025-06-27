import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { BarChart, Clock, Tag, Lock, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import React from 'react';

export type Module = {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  category: 'General' | 'Data Science' | 'Deep Learning' | 'Scientific Computing';
  time: number; // in minutes
  tags: string[];
  prerequisites?: string[];
};

const difficultyMap: { [key in 1 | 2 | 3]: { label: string; variant: BadgeProps['variant'] } } = {
  1: { label: 'Beginner', variant: 'success' },
  2: { label: 'Medium', variant: 'default' },
  3: { label: 'Hard', variant: 'destructive' },
};

const importantTags = new Set(['Basics', 'NumPy', 'Pandas', 'AI', 'Memory', 'Kernels']);

type ModuleCardProps = {
    module: Module;
    isLocked: boolean;
    isCompleted: boolean;
    prerequisitesNames: string[];
}

export function ModuleCard({ module, isLocked, isCompleted, prerequisitesNames }: ModuleCardProps) {
  const difficulty = difficultyMap[module.difficulty];

  const CardContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isLocked) {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="h-full w-full cursor-not-allowed">{children}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Module Locked</AlertDialogTitle>
              <AlertDialogDescription>
                To unlock this module, you first need to complete the following prerequisite(s):
                <ul className="list-disc list-inside mt-2 font-semibold">
                  {prerequisitesNames.map(name => <li key={name}>{name}</li>)}
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
    return <Link href={`/lab?id=${module.id}`} passHref className='h-full'>{children}</Link>
  }

  return (
    <CardContentWrapper>
      <Card className={cn(
          "flex flex-col h-full bg-card/60 transition-all duration-300 group", 
          isLocked ? "opacity-60 bg-muted/50 border-dashed" : "hover:border-primary/80 hover:bg-card/90 cursor-pointer",
          isCompleted && "border-green-500/50"
          )}>
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <span className={cn( !isLocked && "group-hover:text-primary transition-colors")}>{module.title}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isCompleted && <CheckCircle className="size-5 text-green-500" />}
              {isLocked && <Lock className="size-5 text-muted-foreground" />}
            </div>
          </CardTitle>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {module.tags.map((tag) => (
              <Badge key={tag} variant={importantTags.has(tag) ? 'default' : 'outline'}>{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BarChart className="size-4" />
            <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            <span>{module.time} min</span>
          </div>
           <div className="flex items-center gap-1.5">
            <Tag className="size-4" />
            <span>{module.category}</span>
          </div>
        </CardFooter>
      </Card>
    </CardContentWrapper>
  );
}