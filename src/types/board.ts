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

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface CpuInfo {
  model: string;
  architecture: string | null;
  frequency: number | null; // MHz
}

export interface MemoryInfo {
  flash: number; // MB
  ram: number; // MB
}

export interface GpioInfo {
  gpio: number;
  analog: number | null;
  pwm: number | null;
}

export interface ConnectivityInfo {
  wifi: boolean;
  bluetooth: boolean;
  lora: boolean;
  ethernet: boolean;
  zigbee: boolean;
  thread: boolean;
  matter: boolean;
  can: boolean;
}

export interface UsbInfo {
  type: UsbConnectorType;
  otg: boolean;
}

export interface InterfacesInfo {
  usb: UsbInfo;
  i2c: boolean;
  spi: boolean;
  uart: boolean;
  jtag: boolean;
  qwiic: boolean;
  grove: boolean;
  stemma: boolean;
}

export interface BatteryInfo {
  supported: boolean;
  connector: boolean;
  monitoring: boolean;
  charging: boolean;
}

export interface PowerInfo {
  battery: BatteryInfo;
  solar: boolean;
  poe: boolean;
}

export interface DisplayInfo {
  builtin: boolean;
  touch: boolean;
}

export interface SensorsInfo {
  temperature: boolean;
  humidity: boolean;
  pressure: boolean;
  imu: boolean;
  microphone: boolean;
  camera: boolean;
  hall: boolean;
}

export interface UrlsInfo {
  product: string | null;
  image: string | null;
  purchase: string | null;
  github: string | null;
  documentation: string | null;
}

export interface Board {
  // Basic Information
  id: string;
  name: string;
  manufacturer: string;
  imageUrl: string;
  purchaseUrl: string | null;
  releaseDate: string | null;
  price: number | null;
  
  // Physical Specifications
  dimensions: Dimensions;
  
  // Technical Specifications
  cpu: CpuInfo;
  memory: MemoryInfo;
  gpio: GpioInfo;
  usbConnectorType: UsbConnectorType | null;
  
  // Features
  connectivity: ConnectivityInfo;
  interfaces: InterfacesInfo;
  power: PowerInfo;
  display: DisplayInfo | null;
  sensors: SensorsInfo | null;
  
  // URLs and Resources
  urls: UrlsInfo;
  
  // Additional Properties
  openSource: boolean;
}
