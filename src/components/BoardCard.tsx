import Image from 'next/image';
import { Board } from '../types/board';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Wifi, 
  Bluetooth, 
  Github, 
  ShoppingCart, 
  Thermometer,
  Droplets,
  Gauge,
  Move,
  Mic,
  Network,
  Radio,
  Battery,
  Monitor,
  Camera
} from 'lucide-react';

interface BoardCardProps {
  board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <div className="relative h-full flex flex-col bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      {/* Image container with fixed height */}
      <div className="relative h-48 bg-gray-200">
        <Image
          src={board.urls.image || '/placeholder.png'}
          alt={board.name}
          fill
          className="object-contain"
        />
      </div>

      {/* Content container with flex-grow */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title and badges section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{board.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{board.manufacturer}</p>
          
          {/* CPU and Memory Info */}
          <div className="space-y-1 mb-3">
            <p className="text-sm">
              <span className="font-medium">CPU:</span> {board.cpu.model} @ {board.cpu.frequency}MHz
            </p>
            <p className="text-sm">
              <span className="font-medium">Flash:</span> {board.memory.flash}MB
              {board.memory.ram > 0 && <span>, <span className="font-medium">RAM:</span> {board.memory.ram}MB</span>}
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-1">
            {/* Connectivity badges */}
            {board.connectivity.wifi && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-muted-foreground" />WiFi
              </Badge>
            )}
            {board.connectivity.bluetooth && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bluetooth className="w-2.5 h-2.5 text-muted-foreground" />BLE
              </Badge>
            )}
            {board.connectivity.ethernet && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Network className="w-2.5 h-2.5 text-muted-foreground" />Ethernet
              </Badge>
            )}
            {board.connectivity.lora && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-muted-foreground" />LoRa
              </Badge>
            )}
            {board.connectivity.zigbee && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-muted-foreground" />Zigbee
              </Badge>
            )}
            {board.connectivity.thread && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-muted-foreground" />Thread
              </Badge>
            )}
            
            {/* Sensor badges */}
            {board.sensors?.temperature && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Thermometer className="w-2.5 h-2.5 text-muted-foreground" />Temperature
              </Badge>
            )}
            {board.sensors?.humidity && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Droplets className="w-2.5 h-2.5 text-muted-foreground" />Humidity
              </Badge>
            )}
            {board.sensors?.pressure && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Gauge className="w-2.5 h-2.5 text-muted-foreground" />Pressure
              </Badge>
            )}
            {board.sensors?.imu && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Move className="w-2.5 h-2.5 text-muted-foreground" />IMU
              </Badge>
            )}
            {board.sensors?.microphone && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Mic className="w-2.5 h-2.5 text-muted-foreground" />Microphone
              </Badge>
            )}
            {board.sensors?.camera && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Camera className="w-2.5 h-2.5 text-muted-foreground" />Camera
              </Badge>
            )}
            
            {/* Display badge */}
            {board.display?.builtin && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Monitor className="w-2.5 h-2.5 text-muted-foreground" />
                {board.display.touch ? 'Touch Display' : 'Display'}
              </Badge>
            )}
            
            {/* Power badges */}
            {board.power.battery.supported && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Battery className="w-2.5 h-2.5 text-muted-foreground" />Battery
              </Badge>
            )}
          </div>
        </div>

        {/* Links section - pushed to bottom with mt-auto */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          {board.urls.purchase && (
            <Button asChild variant="default" size="sm">
              <a href={board.urls.purchase} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </a>
            </Button>
          )}
          {board.urls.github && (
            <Button asChild variant="outline" size="sm">
              <a href={board.urls.github} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
