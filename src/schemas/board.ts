import { z } from 'zod';

// Dimensions schema
const DimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
}).strict();

// CPU specifications schema
const CpuSpecsSchema = z.object({
  model: z.string(),
  architecture: z.string().nullable(),
  frequency: z.number().positive().nullable(),
}).strict();

// Memory specifications schema
const MemorySpecsSchema = z.object({
  flash: z.number().nonnegative(), // Allow 0 for unknown values
  ram: z.number().nonnegative(), // Allow 0 for unknown values
}).strict();

// GPIO specifications schema
const GpioSpecsSchema = z.object({
  gpio: z.number().int().nonnegative(), // Allow 0 for unknown values
  analog: z.number().int().positive().nullable(),
  pwm: z.number().int().positive().nullable(),
}).strict();

// Connectivity features schema
const ConnectivitySchema = z.object({
  wifi: z.boolean(),
  bluetooth: z.boolean(),
  lora: z.boolean(),
  ethernet: z.boolean(),
  zigbee: z.boolean(),
  thread: z.boolean(),
  matter: z.boolean(),
  can: z.boolean(),
}).strict();

// Interface specifications schema
const InterfacesSchema = z.object({
  usb: z.object({
    type: z.enum(['Type-C', 'Micro-USB', 'Mini-USB', 'USB-B', 'USB-A', 'None']),
    otg: z.boolean(),
  }).strict(),
  i2c: z.boolean(),
  spi: z.boolean(),
  uart: z.boolean(),
  jtag: z.boolean(),
  qwiic: z.boolean(),
  grove: z.boolean(),
  stemma: z.boolean(),
}).strict();

// Power specifications schema
const PowerSpecsSchema = z.object({
  battery: z.object({
    supported: z.boolean(),
    connector: z.boolean(),
    monitoring: z.boolean(),
    charging: z.boolean(),
  }).strict(),
  solar: z.boolean(),
  poe: z.boolean(),
}).strict();

// Display specifications schema
const DisplaySchema = z.object({
  builtin: z.boolean(),
  touch: z.boolean(),
}).strict();

// Sensors specifications schema
const SensorsSchema = z.object({
  temperature: z.boolean(),
  humidity: z.boolean(),
  pressure: z.boolean(),
  imu: z.boolean(),
  microphone: z.boolean(),
  camera: z.boolean(),
  hall: z.boolean(),
}).strict();

// URLs schema
const UrlsSchema = z.object({
  product: z.string().url().nullable(),
  image: z.string().url().nullable(),
  purchase: z.string().url().nullable(),
  github: z.string().url().nullable(),
  documentation: z.string().url().nullable(),
}).strict();

// Main board schema
export const BoardSchema = z.object({
  // Basic Information
  name: z.string(),
  manufacturer: z.string(),
  releaseDate: z.string().date().nullable(),
  price: z.number().positive().nullable(),
  
  // Physical Specifications
  dimensions: DimensionsSchema,
  
  // Technical Specifications
  cpu: CpuSpecsSchema,
  memory: MemorySpecsSchema,
  gpio: GpioSpecsSchema,
  
  // Features
  connectivity: ConnectivitySchema,
  interfaces: InterfacesSchema,
  power: PowerSpecsSchema,
  display: DisplaySchema.nullable(),
  sensors: SensorsSchema.nullable(),
  
  // URLs and Resources
  urls: UrlsSchema,
  
  // Additional Properties
  openSource: z.boolean(),
}).strict();

export type BoardSchemaType = z.infer<typeof BoardSchema>;
