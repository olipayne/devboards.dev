'use client';

import { useState } from 'react';
import { Board } from '../types/board';
import { FilterState, filterBoards } from '../utils/filters';
import { BoardCard } from './BoardCard';
import { FilterPanel } from './FilterPanel';
import { Cpu } from 'lucide-react';

interface MainContentProps {
  initialBoards: Board[];
}

export function MainContent({ initialBoards }: MainContentProps) {
  const [filteredBoards, setFilteredBoards] = useState<Board[]>(initialBoards);
  const [filters, setFilters] = useState<FilterState>({
    cpu: [],
    usb: [],
    connectivity: [],
    sensors: [],
    power: [],
    features: [],
    interfaces: [],
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setFilteredBoards(filterBoards(initialBoards, newFilters));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-8 h-8" />
            <h1 className="text-3xl font-bold">DevBoards</h1>
          </div>
          <p className="text-muted-foreground">
            Find the perfect ESP32 development board for your next project
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            boards={initialBoards}
          />
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoards.map(board => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
            {filteredBoards.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No boards match your current filters
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
