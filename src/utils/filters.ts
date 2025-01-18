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

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterCategory {
  label: string;
  options: FilterOption[];
}

export interface FilterConfig {
  [key: string]: FilterCategory;
}

export function generateFilterOptions(boards: Board[]): FilterConfig {
  // Get all CPU models and count frequencies
  const cpuModels = boards
    .map(board => board?.cpu?.model)
    .filter(model => model);

  const frequencyMap = cpuModels.reduce((acc, model) => {
    acc[model] = (acc[model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort CPU models by frequency, only including those with 3 or more boards
  const sortedUniqueModels = [...new Set(cpuModels)]
    .filter(model => frequencyMap[model] >= 3)
    .sort((a, b) => {
      const freqDiff = frequencyMap[b] - frequencyMap[a];
      return freqDiff !== 0 ? freqDiff : a.localeCompare(b);
    });

  // Get all USB connector types and count frequencies
  const usbConnectors = boards
    .map(board => board.interfaces?.usb?.type)
    .filter(type => type && type !== 'None') as string[];

  const usbFrequencyMap = usbConnectors.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort USB connectors by frequency
  const sortedUniqueConnectors = [...new Set(usbConnectors)].sort((a, b) => {
    const freqDiff = usbFrequencyMap[b] - usbFrequencyMap[a];
    return freqDiff !== 0 ? freqDiff : a.localeCompare(b);
  });

  // Count frequencies of power features
  const powerFeatures = {
    battery: boards.filter(board => board?.power?.battery?.supported).length,
    battery_connector: boards.filter(board => board?.power?.battery?.connector).length,
    charging: boards.filter(board => board?.power?.battery?.charging).length,
    monitoring: boards.filter(board => board?.power?.battery?.monitoring).length,
    solar: boards.filter(board => board?.power?.solar).length,
    poe: boards.filter(board => board?.power?.poe).length,
  };

  return {
    cpu: {
      label: 'CPU',
      options: sortedUniqueModels.map(model => ({
        id: model,
        label: model,
        count: frequencyMap[model],
      })),
    },
    usb: {
      label: 'USB',
      options: sortedUniqueConnectors.map(type => ({
        id: type,
        label: type,
        count: usbFrequencyMap[type],
      })),
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
        { id: 'battery', label: 'Battery Support', count: powerFeatures.battery },
        { id: 'battery_connector', label: 'Battery Connector', count: powerFeatures.battery_connector },
        { id: 'charging', label: 'Battery Charging', count: powerFeatures.charging },
        { id: 'monitoring', label: 'Battery Monitoring', count: powerFeatures.monitoring },
        { id: 'solar', label: 'Solar', count: powerFeatures.solar },
        { id: 'poe', label: 'PoE', count: powerFeatures.poe },
      ].filter(option => option.count > 0),
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
}

export const filterBoards = (boards: Board[], filters: FilterState): Board[] => {
  return boards.filter((board) => {
    // Check CPU model if filter is set
    if (filters.cpu.length > 0 && !filters.cpu.includes(board?.cpu?.model || '')) {
      return false;
    }

    // Check USB connector types if filter is set
    if (filters.usb.length > 0) {
      const boardConnectors = board.interfaces?.usb?.type;
      if (!boardConnectors || !filters.usb.includes(boardConnectors)) {
        return false;
      }
    }

    // Check connectivity filters
    if (filters.connectivity.length > 0) {
      if (!filters.connectivity.every(feature => 
        board?.connectivity && board.connectivity[feature as keyof typeof board.connectivity]
      )) {
        return false;
      }
    }

    // Check sensor filters
    if (filters.sensors.length > 0) {
      if (!filters.sensors.every(sensor => 
        board?.sensors && board.sensors[sensor as keyof typeof board.sensors]
      )) {
        return false;
      }
    }

    // Check power filters
    if (filters.power.length > 0) {
      if (!filters.power.every(feature => {
        if (feature === 'battery') return board?.power?.battery?.supported;
        if (feature === 'battery_connector') return board?.power?.battery?.connector;
        if (feature === 'charging') return board?.power?.battery?.charging;
        if (feature === 'monitoring') return board?.power?.battery?.monitoring;
        return board?.power && board.power[feature as keyof typeof board.power];
      })) {
        return false;
      }
    }

    // Check display filters
    if (filters.display.length > 0) {
      if (!filters.display.every(feature => 
        board?.display && board.display[feature as keyof typeof board.display]
      )) {
        return false;
      }
    }

    // Check interface filters
    if (filters.interfaces.length > 0) {
      if (!filters.interfaces.every(feature => 
        board?.interfaces && board.interfaces[feature as keyof typeof board.interfaces]
      )) {
        return false;
      }
    }

    return true;
  });
};
