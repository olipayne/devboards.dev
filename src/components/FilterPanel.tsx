'use client';

import { useState } from 'react';
import { FilterState } from '@/utils/filters';
import { filterOptions } from '@/utils/filterOptions';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  ChevronDown, 
  ChevronRight, 
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
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
}

export function FilterPanel({ filterState, onFilterChange }: FilterPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    manufacturer: true,
    connectivity: true,
    interfaces: true,
  });

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
          activeFilters.push({ category, value });
        });
      }
    });

    return activeFilters;
  };

  const removeFilter = (category: string, value: string) => {
    const currentValues = filterState[category as keyof FilterState] as string[];
    onFilterChange({
      ...filterState,
      [category]: currentValues.filter(v => v !== value),
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      manufacturer: [],
      connectivity: [],
      interfaces: [],
      priceRange: { min: 0, max: 100 },
      searchQuery: "",
    });
  };

  const activeFilters = getActiveFilters();

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
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
      <CardContent className="pb-6">
        <Accordion type="multiple" className="w-full space-y-4">
          {Object.entries(filterOptions).map(([category, options]) => (
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
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                {expanded[category] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`${category}-${option}`}
                      checked={(filterState[category as keyof FilterState] as string[]).includes(option)}
                      onCheckedChange={() => handleFilterChange(category, option)}
                    />
                    <label
                      htmlFor={`${category}-${option}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
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
