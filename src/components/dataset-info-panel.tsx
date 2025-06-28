'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Database, List, Target } from "lucide-react";
import type { Module } from "@/lib/modules";

export function DatasetInfoPanel({ module }: { module: Module }) {
  return (
    <Card className="flex-grow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database className="text-primary" /> Dataset: {module.dataset.title}</CardTitle>
        <CardDescription>{module.dataset.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm"><List /> Variables</h4>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">View All Variables</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Dataset Variables</SheetTitle>
              </SheetHeader>
              <ul className="mt-4 space-y-2 font-code">
                {module.dataset.variables.map(v => <li key={v} className="p-2 bg-muted rounded-md text-sm">{v}</li>)}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
        <div>
            <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm"><Target /> Goal</h4>
            <p className="text-sm text-muted-foreground">{module.dataset.goal}</p>
        </div>
      </CardContent>
    </Card>
  )
}
