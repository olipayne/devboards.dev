'use client';

import { useState } from 'react';
import { FilterState, generateFilterOptions } from '@/utils/filters';
import { Board } from '@/types/board';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  Search,
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterPanelProps {
  boards: Board[];
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
}

export function FilterPanel({ boards, filterState, onFilterChange }: FilterPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const filterConfig = generateFilterOptions(boards);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filterState,
      searchQuery: e.target.value,
    });
  };

  const handleFilterChange = (category: string, value: string) => {
    const currentValues = filterState[category as keyof FilterState] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filterState,
      [category]: newValues,
    });
  };

  const toggleExpanded = (category: string) => {
    setExpanded(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getActiveFilters = () => {
    const activeFilters: Array<{ category: string; value: string }> = [];
    
    Object.entries(filterState).forEach(([category, values]) => {
      if (Array.isArray(values)) {
        values.forEach(value => {
          const option = filterConfig[category]?.options.find(opt => opt.id === value);
          if (option) {
            activeFilters.push({ 
              category, 
              value: option.label
            });
          }
        });
      }
    });

    return activeFilters;
  };

  const removeFilter = (category: string, value: string) => {
    const currentValues = filterState[category as keyof FilterState] as string[];
    const option = filterConfig[category]?.options.find(opt => opt.label === value);
    if (option) {
      onFilterChange({
        ...filterState,
        [category]: currentValues.filter(v => v !== option.id),
      });
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      cpu: [],
      usb: [],
      connectivity: [],
      sensors: [],
      power: [],
      display: [],
      interfaces: [],
      searchQuery: "",
    });
  };

  const activeFilters = getActiveFilters();
  
  // Sort categories by priority and filter out empty ones
  const sortedCategories = Object.entries(filterConfig)
    .filter(([, category]) => category.options.length > 0)
    .sort(([a], [b]) => {
      const priority: Record<string, number> = {
        cpu: 1,
        usb: 2,
        connectivity: 3,
        interfaces: 4,
        power: 5,
        sensors: 6,
        display: 7,
      };
      return (priority[a] || 99) - (priority[b] || 99);
    });

  return (
    <Card className="sticky top-4 max-h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader className="pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search boards..."
            value={filterState.searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {activeFilters.map(({ category, value }) => (
              <Badge
                key={`${category}-${value}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {value}
                <button
                  onClick={() => removeFilter(category, value)}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-6 overflow-y-auto">
        <Accordion type="multiple" className="w-full space-y-4">
          {sortedCategories.map(([category, { label, options }]) => (
            <AccordionItem
              key={category}
              value={category}
              className="border-none"
            >
              <AccordionTrigger
                onClick={() => toggleExpanded(category)}
                className={`hover:no-underline p-0 ${
                  expanded[category] ? "mb-2" : ""
                }`}
              >
                <span className="flex items-center text-sm font-medium">
                  {label}
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category}-${option.id}`}
                        checked={(filterState[category as keyof FilterState] as string[]).includes(option.id)}
                        onCheckedChange={() => handleFilterChange(category, option.id)}
                      />
                      <label
                        htmlFor={`${category}-${option.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                    {option.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {option.count}
                      </span>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
