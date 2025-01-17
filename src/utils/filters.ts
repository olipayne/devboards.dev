import { Board } from '../types/board';

export interface FilterState {
  cpu: string[];
  usb: string[];
  connectivity: string[];
  sensors: string[];
  power: string[];
  features: string[];
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
      { id: 'STM32', label: 'STM32' },
      { id: 'ATmega328P', label: 'ATmega328P' },
      { id: 'ATmega2560', label: 'ATmega2560' },
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
      { id: 'can', label: 'CAN' },
      { id: 'matter', label: 'Matter' },
    ],
  },
  sensors: {
    label: 'Sensors',
    options: [
      { id: 'accelerometer', label: 'Accelerometer' },
      { id: 'gyroscope', label: 'Gyroscope' },
      { id: 'temperatureSensor', label: 'Temperature' },
      { id: 'hallSensor', label: 'Hall Effect' },
      { id: 'lightSensor', label: 'Light' },
      { id: 'altitudeSensor', label: 'Altitude' },
      { id: 'motionSensor', label: 'Motion' },
    ],
  },
  power: {
    label: 'Power',
    options: [
      { id: 'batteryPowered', label: 'Battery Powered' },
      { id: 'liPoCharging', label: 'LiPo Charging' },
      { id: 'solarCharging', label: 'Solar Charging' },
    ],
  },
  features: {
    label: 'Features',
    options: [
      { id: 'display', label: 'Display' },
      { id: 'camera', label: 'Camera' },
      { id: 'speaker', label: 'Speaker' },
      { id: 'microphone', label: 'Microphone' },
      { id: 'sdCard', label: 'SD Card' },
      { id: 'rtc', label: 'RTC' },
    ],
  },
  interfaces: {
    label: 'Interfaces',
    options: [
      { id: 'i2c', label: 'I2C' },
      { id: 'spi', label: 'SPI' },
      { id: 'uart', label: 'UART' },
      { id: 'pwm', label: 'PWM' },
      { id: 'adc', label: 'ADC' },
      { id: 'dac', label: 'DAC' },
    ],
  },
};

export function filterBoards(boards: Board[], filters: FilterState): Board[] {
  return boards.filter(board => {
    // CPU filter
    if (filters.cpu.length > 0 && !filters.cpu.includes(board.cpuArchitecture)) {
      return false;
    }

    // USB filter
    if (filters.usb.length > 0 && !filters.usb.includes(board.usbConnectorType)) {
      return false;
    }

    // Connectivity filters
    if (filters.connectivity.length > 0) {
      if (!filters.connectivity.every(feature => board[feature as keyof Board])) {
        return false;
      }
    }

    // Sensor filters
    if (filters.sensors.length > 0) {
      if (!filters.sensors.every(sensor => board[sensor as keyof Board])) {
        return false;
      }
    }

    // Power filters
    if (filters.power.length > 0) {
      if (!filters.power.every(feature => board[feature as keyof Board])) {
        return false;
      }
    }

    // Feature filters
    if (filters.features.length > 0) {
      if (!filters.features.every(feature => board[feature as keyof Board])) {
        return false;
      }
    }

    // Interface filters
    if (filters.interfaces.length > 0) {
      if (!filters.interfaces.every(feature => board[feature as keyof Board])) {
        return false;
      }
    }

    return true;
  });
}
