'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CircuitBoard } from "lucide-react";
import { Board } from "@/types/board";
import { FilterPanel } from "@/components/FilterPanel";
import { FilterState } from "@/utils/filters";
import { ModeToggle } from "@/components/mode-toggle";
import { ContributeButton } from "@/components/ContributeButton";

function BoardCard({ board }: { board: Board }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg">
      {board.urls?.image && (
        <div className="relative aspect-square">
          <Image
            src={board.urls.image}
            alt={`${board.name} development board`}
            fill
            className="object-contain p-4"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold">{board.name}</h3>
        <p className="text-sm text-muted-foreground">{board.manufacturer}</p>
        {board.price && (
          <p className="mt-4 text-lg font-medium">${board.price.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}

interface ClientPageProps {
  children: React.ReactNode;
  showFilter?: boolean;
}

const ClientPage = ({ children, showFilter = false }: ClientPageProps) => {
  const [filterState, setFilterState] = React.useState<FilterState>({
    manufacturer: [],
    connectivity: [],
    interfaces: [],
    priceRange: { min: 0, max: 100 },
    searchQuery: "",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <CircuitBoard className="h-6 w-6" />
            <h1 className="text-xl font-bold">DevBoards</h1>
          </Link>
          <div className="flex items-center gap-4">
            <ContributeButton />
            <ModeToggle />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {showFilter && (
            <aside className="w-64 shrink-0">
              <FilterPanel
                filterState={filterState}
                onFilterChange={setFilterState}
              />
            </aside>
          )}
          <main className={showFilter ? 'flex-1 max-w-[calc(100%-16rem)]' : 'flex-1 max-w-full'}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

ClientPage.Card = BoardCard;

export { ClientPage, BoardCard };
