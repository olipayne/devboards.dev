import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Board } from "@/types/board";
import Image from "next/image"; 
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          {board.urls?.image ? (
            <Image
              src={board.urls.image}
              alt={`${board.name} board`}
              fill
              className="object-contain hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{board.name}</h3>
            <p className="text-sm text-muted-foreground">{board.manufacturer}</p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {board.connectivity?.wifi && (
              <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                <Wifi className="w-3 h-3 mr-1" />
                WiFi
              </span>
            )}
            {board.connectivity?.bluetooth && (
              <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                <Bluetooth className="w-3 h-3 mr-1" />
                BLE
              </span>
            )}
            {board.connectivity?.ethernet && (
              <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                <Network className="w-3 h-3 mr-1" />
                Ethernet
              </span>
            )}
            {board.connectivity?.lora && (
              <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                <Radio className="w-3 h-3 mr-1" />
                LoRa
              </span>
            )}
            {board.connectivity?.zigbee && (
              <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                <Radio className="w-3 h-3 mr-1" />
                Zigbee
              </span>
            )}
            {board.connectivity?.thread && (
              <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                <Radio className="w-3 h-3 mr-1" />
                Thread
              </span>
            )}
          </div>

          {/* Sensors */}
          {board.sensors && (
            <div className="flex flex-wrap gap-1">
              {board.sensors.temperature && (
                <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  <Thermometer className="w-3 h-3 mr-1" />
                  Temp
                </span>
              )}
              {board.sensors.humidity && (
                <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  <Droplets className="w-3 h-3 mr-1" />
                  Humidity
                </span>
              )}
              {board.sensors.pressure && (
                <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  <Gauge className="w-3 h-3 mr-1" />
                  Pressure
                </span>
              )}
              {board.sensors.imu && (
                <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  <Move className="w-3 h-3 mr-1" />
                  IMU
                </span>
              )}
              {board.sensors.microphone && (
                <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  <Mic className="w-3 h-3 mr-1" />
                  Mic
                </span>
              )}
              {board.sensors.camera && (
                <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  <Camera className="w-3 h-3 mr-1" />
                  Camera
                </span>
              )}
            </div>
          )}

          {/* Power */}
          {board.power && (
            <div className="flex flex-wrap gap-1">
              {board.power.battery?.supported && (
                <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  <Battery className="w-3 h-3 mr-1" />
                  Battery
                </span>
              )}
              {board.display?.builtin && (
                <span className="inline-flex items-center text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  <Monitor className="w-3 h-3 mr-1" />
                  Display
                </span>
              )}
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2 mt-4">
            {board.urls?.github && (
              <a
                href={board.urls.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-muted-foreground hover:text-primary"
              >
                <Github className="w-4 h-4 mr-1" />
                Source
              </a>
            )}
            {board.purchaseUrl && (
              <a
                href={board.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-muted-foreground hover:text-primary ml-auto"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Buy
                {board.price && ` ($${board.price})`}
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
