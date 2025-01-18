import { Board } from '../types/board';

export interface FilterState {
  cpu: string[];
  usb: string[];
  connectivity: string[];
  sensors: string[];
  power: string[];
  display: string[];
  interfaces: string[];
}

export const FILTER_CATEGORIES = {
  cpu: {
    label: 'CPU',
    options: [
      { id: 'ESP32', label: 'ESP32' },
      { id: 'ESP32-S2', label: 'ESP32-S2' },
      { id: 'ESP32-S3', label: 'ESP32-S3' },
      { id: 'ESP32-C3', label: 'ESP32-C3' },
      { id: 'ESP32-C6', label: 'ESP32-C6' },
      { id: 'ESP32-H2', label: 'ESP32-H2' },
      { id: 'RP2040', label: 'RP2040' },
      { id: 'SAMD21', label: 'SAMD21' },
      { id: 'nRF52840', label: 'nRF52840' },
    ],
  },
  usb: {
    label: 'USB Connector',
    options: [
      { id: 'Type-C', label: 'Type-C' },
      { id: 'Micro-USB', label: 'Micro-USB' },
      { id: 'Mini-USB', label: 'Mini-USB' },
      { id: 'USB-A', label: 'USB-A' },
      { id: 'USB-B', label: 'USB-B' },
    ],
  },
  connectivity: {
    label: 'Connectivity',
    options: [
      { id: 'wifi', label: 'WiFi' },
      { id: 'bluetooth', label: 'Bluetooth' },
      { id: 'lora', label: 'LoRa' },
      { id: 'ethernet', label: 'Ethernet' },
      { id: 'zigbee', label: 'Zigbee' },
      { id: 'thread', label: 'Thread' },
      { id: 'matter', label: 'Matter' },
      { id: 'can', label: 'CAN' },
    ],
  },
  sensors: {
    label: 'Sensors',
    options: [
      { id: 'temperature', label: 'Temperature' },
      { id: 'humidity', label: 'Humidity' },
      { id: 'pressure', label: 'Pressure' },
      { id: 'imu', label: 'IMU' },
      { id: 'microphone', label: 'Microphone' },
      { id: 'camera', label: 'Camera' },
      { id: 'hall', label: 'Hall Effect' },
    ],
  },
  power: {
    label: 'Power',
    options: [
      { id: 'battery', label: 'Battery Support' },
      { id: 'charging', label: 'Battery Charging' },
      { id: 'monitoring', label: 'Battery Monitoring' },
      { id: 'solar', label: 'Solar Charging' },
      { id: 'poe', label: 'Power over Ethernet' },
    ],
  },
  display: {
    label: 'Display',
    options: [
      { id: 'builtin', label: 'Built-in Display' },
      { id: 'touch', label: 'Touch Screen' },
    ],
  },
  interfaces: {
    label: 'Interfaces',
    options: [
      { id: 'i2c', label: 'I2C' },
      { id: 'spi', label: 'SPI' },
      { id: 'uart', label: 'UART' },
      { id: 'jtag', label: 'JTAG' },
      { id: 'qwiic', label: 'Qwiic' },
      { id: 'grove', label: 'Grove' },
      { id: 'stemma', label: 'STEMMA' },
    ],
  },
};

export function filterBoards(boards: Board[] = [], filters: FilterState): Board[] {
  if (!Array.isArray(boards)) return [];
  
  return boards.filter((board) => {
    // CPU filter - check if the CPU model includes any of the selected CPU types
    if (filters.cpu.length > 0 && !filters.cpu.some(cpu => board?.cpu?.model?.toLowerCase().includes(cpu.toLowerCase()))) {
      return false;
    }

    // USB filter - exact match on USB type
    if (filters.usb.length > 0 && !filters.usb.includes(board?.interfaces?.usb?.type)) {
      return false;
    }

    // Connectivity filters
    if (filters.connectivity.length > 0 && board.connectivity) {
      if (!filters.connectivity.every(feature => board.connectivity?.[feature as keyof typeof board.connectivity])) {
        return false;
      }
    }

    // Sensor filters
    if (filters.sensors.length > 0 && board.sensors) {
      if (!filters.sensors.every(sensor => board.sensors?.[sensor as keyof typeof board.sensors])) {
        return false;
      }
    }

    // Power source filters
    if (filters.power.length > 0 && board.power) {
      if (!filters.power.every(source => {
        if (source === 'battery') return board.power?.battery?.supported;
        if (source === 'solar') return board.power?.solar;
        if (source === 'poe') return board.power?.poe;
        return false;
      })) {
        return false;
      }
    }

    // Display filters
    if (filters.display.length > 0 && board.display) {
      if (!filters.display.every(feature => board.display?.[feature as keyof typeof board.display])) {
        return false;
      }
    }

    // Interface filters
    if (filters.interfaces.length > 0 && board.interfaces) {
      if (!filters.interfaces.every(iface => {
        if (iface === 'usb') return !!board.interfaces?.usb;
        return board.interfaces?.[iface as keyof typeof board.interfaces];
      })) {
        return false;
      }
    }

    return true;
  });
}
