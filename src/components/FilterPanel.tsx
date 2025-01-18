'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Check } from "lucide-react";
import { FilterState } from "@/utils/filters";
import { UsbConnectorType } from "@/types/board";

interface FilterPanelProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onReset?: () => void;
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

export function FilterPanel({ filters, setFilters, onReset }: FilterPanelProps) {
  const handleFilterClick = (category: string, id: string) => {
    setFilters({
      ...filters,
      [category]: filters[category as keyof FilterState]?.includes(id)
        ? filters[category as keyof FilterState]?.filter((item) => item !== id)
        : [...(filters[category as keyof FilterState] || []), id],
    });
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

  return (
    <div className="w-full lg:w-64 shrink-0">
      {/* Header */}
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Filters</h2>
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
        <div className="space-y-6 pr-4">
          {Object.entries(FILTER_CATEGORIES).map(([category, { label, options }]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-medium" id={`${category}-heading`}>
                {label}
              </h3>
              <div 
                className="flex flex-wrap gap-1.5" 
                role="group" 
                aria-labelledby={`${category}-heading`}
              >
                {options.map((option) => {
                  const isSelected = filters[category as keyof FilterState]?.includes(option.id);
                  return (
                    <button
                      key={option.id}
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
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
