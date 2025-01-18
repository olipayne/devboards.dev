'use client';

import { useState } from 'react';
import { FilterPanel } from './FilterPanel';
import { MainContent } from './MainContent';
import { Board } from '@/types/board';
import { FilterState } from '@/utils/filters';
import { Cpu } from 'lucide-react';

interface ClientPageProps {
  boards: Board[];
}

export function ClientPage({ boards }: ClientPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    cpu: [],
    usb: [],
    connectivity: [],
    sensors: [],
    power: [],
    display: [],
    interfaces: [],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-3">
            <Cpu className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold tracking-tight">DevBoards</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Find the perfect development board for your next project
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-none">
            <div className="lg:sticky lg:top-[120px]">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                boards={boards}
              />
            </div>
          </aside>
          <MainContent boards={boards} filters={filters} />
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground text-center">
            DevBoards helps you find and compare development boards for your projects.
          </p>
        </div>
      </footer>
    </div>
  );
}
