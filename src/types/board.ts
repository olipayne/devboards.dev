export enum UsbConnectorType {
  TypeC = 'Type-C',
  MicroUsb = 'Micro-USB',
  MiniUsb = 'Mini-USB',
  UsbB = 'USB-B',
  UsbA = 'USB-A',
  None = 'None'
}

// Helper function to validate USB connector types
export function isValidUsbConnectorType(type: string): type is UsbConnectorType {
  return Object.values(UsbConnectorType).includes(type as UsbConnectorType);
}

export interface Board {
  // Basic Information
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  purchaseUrl?: string;
  price?: number;
  releaseDate?: string;
  
  // Technical Specifications
  cpuArchitecture: string;
  cpuFrequency?: number; // MHz
  flashSize?: number; // MB
  ramSize?: number; // MB
  usbConnectorType: UsbConnectorType;
  
  // Connectivity
  wifi: boolean;
  bluetooth: boolean;
  lora: boolean;
  ethernet: boolean;
  zigbee: boolean;
  threadProtocol: boolean;
  matter: boolean;
  can: boolean;
  
  // Communication Interfaces
  i2c: boolean;
  spi: boolean;
  uartPins?: number;
  gpio?: number;
  
  // Power
  batteryPowered: boolean;
  batteryConnector: boolean;
  batteryMonitoring: boolean;
  liPoCharging: boolean;
  barrelJack5V: boolean;
  dualLDOs: boolean;
  ultraLowPower: boolean;
  lowPowerDeepSleep: boolean;
  
  // USB Features
  nativeUSB: boolean;
  pioUSB: boolean;
  usbHost: boolean;
  usbDetection: boolean;
  dualUSB: boolean;
  hid: boolean;
  
  // Sensors
  accelerometer: boolean;
  gyroscope: boolean;
  temperatureSensor: boolean;
  hallSensor: boolean;
  altitudeSensor: boolean;
  lightSensor: boolean;
  motionSensor: boolean;
  soilMoisture: boolean;
  waterLevelSensor: boolean;
  
  // Display & Visual
  display: boolean;
  screenConnector: boolean;
  touchScreen: boolean;
  ledMatrix: boolean;
  rgbLED: boolean;
  hdmi: boolean;
  miniHDMI: boolean;
  dvi: boolean;
  
  // Audio & Media
  audioJack: boolean;
  microphone: boolean;
  speaker: boolean;
  camera: boolean;
  cameraconnector: boolean;
  mipicsiconnector: boolean;
  lens: boolean;
  thermalCamera: boolean;
  
  // Storage
  sdCard: boolean;
  tfCard: boolean;
  
  // Additional Features
  rtc: boolean;
  imu: boolean;
  irEmitter: boolean;
  irReceiver: boolean;
  relay: boolean;
  pumpConnector: boolean;
  button: boolean;
  onOffSwitch: boolean;
  
  // Form Factor
  breadBoardFriendly: boolean;
  mountingHoles: boolean;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // Connectors & Expansion
  stemmaConnector: boolean;
  groveConnector: boolean;
  uextConnector: boolean;
  uFL: boolean;
  pci: boolean;
  poe: boolean;
  
  // Project Information
  openSource: boolean;
  githubUrl?: string;
  documentationUrl?: string;
  schematicUrl?: string;
  
  // Coin Cell
  lir2450CoinCell: boolean;
}
