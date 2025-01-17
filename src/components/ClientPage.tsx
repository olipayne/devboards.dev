'use client';

import React, { useState, useEffect, Children, isValidElement, cloneElement, ReactElement } from 'react';
import { Board } from '../types/board';
import { FilterState, filterBoards } from '../utils/filters';

interface ClientPageProps {
  initialBoards: Board[];
  children: React.ReactNode;
}

interface ChildProps {
  boards: Board[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function ClientPage({ initialBoards, children }: ClientPageProps) {
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

  useEffect(() => {
    setFilteredBoards(filterBoards(initialBoards, filters));
  }, [initialBoards, filters]);

  // Clone the children and inject the filtered boards and filter state
  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child)) {
      return cloneElement(child as ReactElement<ChildProps>, {
        boards: filteredBoards,
        filters,
        onFilterChange: setFilters,
      });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
}
