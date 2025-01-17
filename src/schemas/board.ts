import { z } from 'zod';
import { UsbConnectorType } from '../types/board';

const UsbConnectorTypeSchema = z.nativeEnum(UsbConnectorType);

export const BoardSchema = z.object({
  // Basic Information
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  imageUrl: z.string().url(),
  purchaseUrl: z.string().url().optional(),
  price: z.number().positive().optional(),
  releaseDate: z.string().optional(),
  
  // Technical Specifications
  cpuArchitecture: z.string(),
  cpuFrequency: z.number().positive().optional(),
  flashSize: z.number().positive().optional(),
  ramSize: z.number().positive().optional(),
  usbConnectorType: UsbConnectorTypeSchema,
  
  // All boolean fields
  wifi: z.boolean(),
  bluetooth: z.boolean(),
  lora: z.boolean(),
  ethernet: z.boolean(),
  zigbee: z.boolean(),
  threadProtocol: z.boolean(),
  matter: z.boolean(),
  can: z.boolean(),
  i2c: z.boolean(),
  spi: z.boolean(),
  batteryPowered: z.boolean(),
  batteryConnector: z.boolean(),
  batteryMonitoring: z.boolean(),
  liPoCharging: z.boolean(),
  barrelJack5V: z.boolean(),
  dualLDOs: z.boolean(),
  ultraLowPower: z.boolean(),
  lowPowerDeepSleep: z.boolean(),
  nativeUSB: z.boolean(),
  pioUSB: z.boolean(),
  usbHost: z.boolean(),
  usbDetection: z.boolean(),
  dualUSB: z.boolean(),
  hid: z.boolean(),
  accelerometer: z.boolean(),
  gyroscope: z.boolean(),
  temperatureSensor: z.boolean(),
  hallSensor: z.boolean(),
  lightSensor: z.boolean(),
  altitudeSensor: z.boolean(),
  motionSensor: z.boolean(),
  display: z.boolean(),
  touchScreen: z.boolean(),
  camera: z.boolean(),
  speaker: z.boolean(),
  microphone: z.boolean(),
  sdCard: z.boolean(),
  rtc: z.boolean(),
  openSource: z.boolean(),
  breadBoardFriendly: z.boolean(),
  stemmaConnector: z.boolean(),
  groveConnector: z.boolean(),
  uextConnector: z.boolean(),
  poe: z.boolean(),
  solarCharging: z.boolean(),
  // Optional fields
  uartPins: z.number().positive().optional(),
  gpio: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
  githubUrl: z.string().url().optional(),
  documentationUrl: z.string().url().optional(),
  schematicUrl: z.string().url().optional(),
});

export type BoardSchemaType = z.infer<typeof BoardSchema>;
