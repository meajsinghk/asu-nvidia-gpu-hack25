'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModuleCard } from '@/components/module-card';
import { Search, BarChart, Tag, ArrowUpDown, Rocket } from 'lucide-react';
import { useCompletion } from '@/hooks/use-completion';
import { modulesData } from '@/lib/modules';

const categories = ['All', ...Array.from(new Set(modulesData.map(m => m.category)))];
const difficulties = ['All', '1', '2', '3'];

export function ModuleCanvas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('difficulty_asc');
  
  const { completedModules } = useCompletion();

  const filteredAndSortedModules = useMemo(() => {
    let modules = [...modulesData];

    if (searchTerm) {
      modules = modules.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'All') {
      modules = modules.filter(m => m.category === categoryFilter);
    }
    
    if (difficultyFilter !== 'All') {
      modules = modules.filter(m => m.difficulty === parseInt(difficultyFilter));
    }

    switch (sortOrder) {
      case 'difficulty_asc':
        modules.sort((a, b) => a.difficulty - b.difficulty);
        break;
      case 'difficulty_desc':
        modules.sort((a, b) => b.difficulty - a.difficulty);
        break;
      case 'time_asc':
        modules.sort((a, b) => a.time - b.time);
        break;
      case 'time_desc':
        modules.sort((a, b) => b.time - a.time);
        break;
      case 'title_asc':
        modules.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return modules;
  }, [searchTerm, categoryFilter, difficultyFilter, sortOrder]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-screen-xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">GPU Learning Hub</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our catalog of interactive modules to master GPU-accelerated computing.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/universe" passHref>
            <Button variant="outline">
              <Rocket className="mr-2" /> Run in Multiverse
            </Button>
          </Link>
          <Link href="/test" passHref>
            <Button variant="outline">
              Test
            </Button>
          </Link>
          <Link href="/test2" passHref>
            <Button variant="outline">
              Test2
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-4 mb-8 rounded-lg bg-card/60 border border-border sticky top-4 z-10 backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search modules..."
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11">
                <Tag className="mr-2 h-5 w-5" />
                <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-1">
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="h-11">
                  <BarChart className="mr-2 h-5 w-5" />
                  <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(d => <SelectItem key={d} value={d}>{d === 'All' ? 'All' : `Level ${d}`}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-11">
                  <ArrowUpDown className="mr-2 h-5 w-5" />
                  <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="difficulty_asc">Difficulty (Low-High)</SelectItem>
                  <SelectItem value="difficulty_desc">Difficulty (High-Low)</SelectItem>
                  <SelectItem value="time_asc">Time (Shortest)</SelectItem>
                  <SelectItem value="time_desc">Time (Longest)</SelectItem>
                  <SelectItem value="title_asc">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedModules.map(module => {
            const isLocked = module.prerequisites?.some(p => !completedModules.has(p)) ?? false;
            const isCompleted = completedModules.has(module.id);
            const prerequisitesNames = module.prerequisites?.map(pId => modulesData.find(m => m.id === pId)?.title || '').filter(Boolean) || [];

            return <ModuleCard key={module.id} module={module} isLocked={isLocked} isCompleted={isCompleted} prerequisitesNames={prerequisitesNames} />;
        })}
         {filteredAndSortedModules.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16 text-muted-foreground">
                <p className="text-xl font-medium">No modules found.</p>
                <p>Try adjusting your search or filters.</p>
            </div>
        )}
      </div>
    </div>
  );
}
