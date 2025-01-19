'use client';

import { useState } from "react";
import { FilterPanel } from "@/components/FilterPanel";
import { MainContent } from "@/components/MainContent";
import { Board } from "@/types/board";
import { FilterState } from "@/utils/filters";
import { ModeToggle } from "@/components/mode-toggle";
import { CircuitBoard } from "lucide-react";
import { ContributeButton } from "@/components/ContributeButton";

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
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CircuitBoard className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-medium">devboards.dev</h1>
          </div>
          <div className="flex items-center gap-2">
            <ContributeButton />
            <ModeToggle />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-72">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              boards={boards}
            />
          </aside>
          <main className="flex-1">
            <MainContent
              boards={boards}
              filters={filters}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
