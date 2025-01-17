'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, X } from "lucide-react";
import { FILTER_CATEGORIES, FilterState } from "@/utils/filters";
import { Board } from "@/types/board";
import { useState } from "react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  boards: Board[];
}

export function FilterPanel({ filters, onFilterChange, boards }: FilterPanelProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    usb: true,
    connectivity: true,
    sensors: true,
    power: true,
    features: true,
    interfaces: true,
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleFilterClick = (category: string, id: string) => {
    const currentFilters = filters[category as keyof FilterState] as string[];
    const newFilters = currentFilters.includes(id)
      ? currentFilters.filter(f => f !== id)
      : [...currentFilters, id];

    onFilterChange({
      ...filters,
      [category]: newFilters,
    });
  };

  const isFilterActive = (category: string, id: string) => {
    const currentFilters = filters[category as keyof FilterState] as string[];
    return currentFilters.includes(id);
  };

  const getBoardCountForFilter = (category: string, id: string) => {
    if (!Array.isArray(boards)) {
      console.error('boards prop is not an array:', boards);
      return 0;
    }

    if (category === 'usb') {
      return boards.filter(board => board.usbConnectorType === id).length;
    }
    return boards.filter(board => board[id as keyof Board] === true).length;
  };

  const getActiveFilters = () => {
    const active: { category: string; id: string; label: string }[] = [];
    Object.entries(FILTER_CATEGORIES).forEach(([category, { options }]) => {
      const currentFilters = filters[category as keyof FilterState] as string[];
      currentFilters.forEach(id => {
        const option = options.find(opt => opt.id === id);
        if (option) {
          active.push({
            category,
            id,
            label: option.label,
          });
        }
      });
    });
    return active;
  };

  const resetFilters = () => {
    onFilterChange({
      cpu: [],
      usb: [],
      connectivity: [],
      sensors: [],
      power: [],
      features: [],
      interfaces: [],
    });
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="w-64 shrink-0 space-y-4 bg-card rounded-lg border p-4">
      <div className="font-semibold text-lg">Filters</div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Active Filters</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 px-2 text-xs"
            >
              Reset All
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {activeFilters.map(({ category, id, label }) => (
              <Badge
                key={`${category}-${id}`}
                variant="secondary"
                className="flex items-center gap-1 text-xs"
              >
                {label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleFilterClick(category, id)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filter Categories */}
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4 pr-4">
          {Object.entries(FILTER_CATEGORIES).map(([category, { label, options }]) => (
            <Collapsible
              key={category}
              open={openCategories[category]}
              onOpenChange={() => toggleCategory(category)}
              className="space-y-2"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      openCategories[category] ? "transform rotate-90" : ""
                    }`}
                  />
                  <h3 className="font-medium">{label}</h3>
                </div>
                {filters[category as keyof FilterState].length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {filters[category as keyof FilterState].length}
                  </Badge>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pl-6">
                <div className="flex flex-wrap gap-1">
                  {options.map(({ id, label }) => {
                    const count = getBoardCountForFilter(category, id);
                    return (
                      <Badge
                        key={id}
                        variant={isFilterActive(category, id) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/90 transition-colors text-xs"
                        onClick={() => handleFilterClick(category, id)}
                        title={`${count} board${count !== 1 ? 's' : ''}`}
                      >
                        {label}
                      </Badge>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
