import Image from 'next/image';
import { Board } from '../types/board';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Wifi, Bluetooth, Github, Cpu } from 'lucide-react';

interface BoardCardProps {
  board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative h-48 bg-black/5 group-hover:bg-black/10 transition-colors">
        <Image
          src={board.imageUrl}
          alt={board.name}
          fill
          className="object-contain p-4 mix-blend-multiply"
        />
      </div>
      
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{board.name}</CardTitle>
            <CardDescription className="text-sm font-medium">
              {board.brand}
            </CardDescription>
          </div>
          {board.price ? (
            <div className="text-lg font-semibold">
              ${board.price.toFixed(2)}
            </div>
          ) : (
            <div className="text-muted-foreground italic">Price not available</div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
       
        <div className="flex flex-wrap gap-2 mb-4">
          {board.cpuArchitecture && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Cpu className="w-3 h-3" /> {board.cpuArchitecture}
            </Badge>
          )}
          {board.wifi && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Wifi className="w-3 h-3" /> WiFi
            </Badge>
          )}
          {board.bluetooth && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Bluetooth className="w-3 h-3" /> Bluetooth
            </Badge>
          )}
          {board.openSource && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Github className="w-3 h-3" /> Open Source
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">CPU Architecture</span>
            <span className="font-medium">{board.cpuArchitecture}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">USB Type</span>
            <span className="font-medium">{board.usbConnectorType}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        {board.githubUrl && (
          <a
            href={board.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        )}
        {board.purchaseUrl && (
          <a
            href={board.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Buy Now <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
