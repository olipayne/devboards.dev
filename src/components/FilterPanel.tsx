'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Search,
  Square,
  Filter
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FilterState } from "@/utils/filters";
import { UsbConnectorType } from "@/types/board";
import { Board } from "@/types/board"; // Import Board type

interface FilterPanelProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onReset?: () => void;
  boards: Board[]; // Updated type to Board[]
}

interface FilterOption {
  id: string;
  label: string;
}

interface FilterCategory {
  label: string;
  options: FilterOption[];
}

interface FilterConfig {
  [key: string]: FilterCategory;
}

const FILTER_CATEGORIES: FilterConfig = {
  cpu: {
    label: "CPU",
    options: [
      { id: "esp32", label: "ESP32" },
      { id: "esp32s2", label: "ESP32-S2" },
      { id: "esp32s3", label: "ESP32-S3" },
      { id: "esp32c3", label: "ESP32-C3" },
      { id: "esp8266", label: "ESP8266" },
      { id: "rp2040", label: "RP2040" },
      { id: "samd21", label: "SAMD21" },
      { id: "nrf52840", label: "nRF52840" },
      { id: "atmega", label: "ATmega" },
    ],
  },
  usb: {
    label: "USB",
    options: Object.entries(UsbConnectorType)
      .filter(([key]) => key !== 'None')
      .map(([, value]) => ({
        id: value,
        label: value === 'Type-C' ? 'USB-C' :
               value === 'Micro-USB' ? 'Micro USB' :
               value === 'Mini-USB' ? 'Mini USB' :
               value === 'USB-B' ? 'USB-B' :
               value === 'USB-A' ? 'USB-A' : value
      })),
  },
  connectivity: {
    label: "Connectivity",
    options: [
      { id: "wifi", label: "WiFi" },
      { id: "bluetooth", label: "Bluetooth" },
      { id: "ethernet", label: "Ethernet" },
      { id: "lora", label: "LoRa" },
      { id: "zigbee", label: "Zigbee" },
      { id: "thread", label: "Thread" },
    ],
  },
  sensors: {
    label: "Sensors",
    options: [
      { id: "temperature", label: "Temperature" },
      { id: "humidity", label: "Humidity" },
      { id: "pressure", label: "Pressure" },
      { id: "imu", label: "IMU" },
      { id: "microphone", label: "Microphone" },
      { id: "camera", label: "Camera" },
    ],
  },
  power: {
    label: "Power",
    options: [
      { id: "battery", label: "Battery" },
      { id: "usb", label: "USB" },
      { id: "solar", label: "Solar" },
    ],
  },
  display: {
    label: "Display",
    options: [
      { id: "builtin", label: "Built-in Display" },
      { id: "touch", label: "Touch Screen" },
    ],
  },
  interfaces: {
    label: "Interfaces",
    options: [
      { id: "gpio", label: "GPIO" },
      { id: "i2c", label: "I2C" },
      { id: "spi", label: "SPI" },
      { id: "uart", label: "UART" },
      { id: "can", label: "CAN" },
    ],
  },
};

export function FilterPanel({ filters, setFilters, onReset, boards }: FilterPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.keys(FILTER_CATEGORIES).reduce((acc, category) => ({
      ...acc,
      [category]: false
    }), {})
  );
  const [filterSearch, setFilterSearch] = useState("");

  const handleFilterClick = (category: string, id: string) => {
    setFilters({
      ...filters,
      [category]: filters[category as keyof FilterState]?.includes(id)
        ? filters[category as keyof FilterState]?.filter((item) => item !== id)
        : [...(filters[category as keyof FilterState] || []), id],
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const clearCategory = (category: string) => {
    setFilters({
      ...filters,
      [category]: []
    });
  };

  const getFilterCount = (category: string, optionId: string): number => {
    // Count how many boards would match with just this filter
    return boards.filter(board => {
      if (category === 'cpu') {
        return board?.cpu?.model?.toLowerCase().includes(optionId.toLowerCase());
      }
      if (category === 'usb') {
        return board?.interfaces?.usb?.type === optionId;
      }
      if (category === 'connectivity') {
        return board?.connectivity && optionId in board.connectivity && board.connectivity[optionId as keyof typeof board.connectivity];
      }
      if (category === 'sensors') {
        return board?.sensors && optionId in board.sensors && board.sensors[optionId as keyof typeof board.sensors];
      }
      if (category === 'power') {
        if (optionId === 'battery') return board?.power?.battery?.supported;
        if (optionId === 'charging') return board?.power?.battery?.charging;
        if (optionId === 'monitoring') return board?.power?.battery?.monitoring;
        return board?.power && optionId in board.power && board.power[optionId as keyof typeof board.power];
      }
      if (category === 'display') {
        return board?.display && optionId in board.display && board.display[optionId as keyof typeof board.display];
      }
      if (category === 'interfaces') {
        return board?.interfaces && optionId in board.interfaces && board.interfaces[optionId as keyof typeof board.interfaces];
      }
      return false;
    }).length;
  };

  const resetFilters = () => {
    setFilters({
      cpu: [],
      usb: [],
      connectivity: [],
      sensors: [],
      power: [],
      display: [],
      interfaces: [],
    });
    onReset?.();
  };

  const getActiveFilters = () => {
    return Object.entries(filters)
      .flatMap(([category, selectedIds]: [string, string[]]) =>
        selectedIds.map((id: string) => ({
          category,
          id,
          label: FILTER_CATEGORIES[category]?.options.find(
            (option) => option.id === id
          )?.label || id,
        }))
      )
      .filter((filter) => filter.label);
  };

  const activeFilters = getActiveFilters();
  const filteredCategories = Object.entries(FILTER_CATEGORIES).filter(([, { label, options }]) =>
    label.toLowerCase().includes(filterSearch.toLowerCase()) ||
    options.some(opt => opt.label.toLowerCase().includes(filterSearch.toLowerCase()))
  );

  return (
    <div className="w-full lg:w-72 shrink-0">
      {/* Header */}
      <div className="pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <h2 className="font-medium">Filters</h2>
          </div>
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2 text-sm hover:bg-destructive/10 hover:text-destructive"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Search Filters */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search filters..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-4">
            <ScrollArea className="w-full" style={{ maxHeight: activeFilters.length > 6 ? '160px' : 'auto' }}>
              <div className="flex flex-wrap gap-1.5 pr-4">
                {activeFilters.map(({ category, id, label }) => (
                  <Button
                    key={`${category}-${id}`}
                    variant="secondary"
                    size="sm"
                    className="h-7 pl-2 pr-1 text-sm group shrink-0"
                    onClick={() => handleFilterClick(category, id)}
                  >
                    <span className="truncate">{label}</span>
                    <X className="w-4 h-4 ml-1 shrink-0 group-hover:text-destructive" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Filter Categories */}
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4 pr-4">
          {filteredCategories.map(([category, { label, options }]) => {
            const selectedCount = filters[category as keyof FilterState]?.length || 0;
            const totalCount = options.length;
            
            return (
              <Collapsible
                key={category}
                open={expandedCategories[category]}
                onOpenChange={() => toggleCategory(category)}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80">
                    {expandedCategories[category] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <h3 className="text-sm font-medium" id={`${category}-heading`}>
                      {label}
                    </h3>
                    {selectedCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedCount}/{totalCount}
                      </Badge>
                    )}
                  </CollapsibleTrigger>
                  
                  <div className="flex items-center gap-1">
                    {selectedCount > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => clearCategory(category)}
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Clear Selection</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                <CollapsibleContent>
                  <div 
                    className="flex flex-wrap gap-1.5 pl-6" 
                    role="group" 
                    aria-labelledby={`${category}-heading`}
                  >
                    {options.filter(option => 
                      option.label.toLowerCase().includes(filterSearch.toLowerCase())
                    ).map((option) => {
                      const isSelected = filters[category as keyof FilterState]?.includes(option.id);
                      const count = getFilterCount(category, option.id);
                      
                      return (
                        <TooltipProvider key={option.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleFilterClick(category, option.id)}
                                className={cn(
                                  "inline-flex items-center h-7 px-2.5 rounded-full text-sm font-medium transition-all shrink-0",
                                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                                  "disabled:opacity-50 disabled:cursor-not-allowed",
                                  isSelected
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                )}
                                role="checkbox"
                                aria-checked={isSelected}
                              >
                                {isSelected && (
                                  <Check className="w-4 h-4 mr-1.5 shrink-0" aria-hidden="true" />
                                )}
                                <span className="truncate">{option.label}</span>
                                {count > 0 && (
                                  <Badge 
                                    variant={isSelected ? "secondary" : "outline"} 
                                    className="ml-1.5 px-1"
                                  >
                                    {count}
                                  </Badge>
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{count} board{count !== 1 ? 's' : ''} available</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
