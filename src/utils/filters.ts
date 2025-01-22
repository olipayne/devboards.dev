import { Board } from '../types/board';

export interface FilterState {
  cpu: string[];
  usb: string[];
  connectivity: string[];
  sensors: string[];
  power: string[];
  display: string[];
  interfaces: string[];
  searchQuery?: string;
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

  // Count frequencies of features
  const connectivityCounts = {
    wifi: boards.filter(board => board?.connectivity?.wifi).length,
    bluetooth: boards.filter(board => board?.connectivity?.bluetooth).length,
    lora: boards.filter(board => board?.connectivity?.lora).length,
    ethernet: boards.filter(board => board?.connectivity?.ethernet).length,
    zigbee: boards.filter(board => board?.connectivity?.zigbee).length,
    thread: boards.filter(board => board?.connectivity?.thread).length,
    matter: boards.filter(board => board?.connectivity?.matter).length,
    can: boards.filter(board => board?.connectivity?.can).length,
  };

  const sensorCounts = {
    temperature: boards.filter(board => board?.sensors?.temperature).length,
    humidity: boards.filter(board => board?.sensors?.humidity).length,
    pressure: boards.filter(board => board?.sensors?.pressure).length,
    imu: boards.filter(board => board?.sensors?.imu).length,
    microphone: boards.filter(board => board?.sensors?.microphone).length,
    camera: boards.filter(board => board?.sensors?.camera).length,
    hall: boards.filter(board => board?.sensors?.hall).length,
  };

  const interfaceCounts = {
    i2c: boards.filter(board => board?.interfaces?.i2c).length,
    spi: boards.filter(board => board?.interfaces?.spi).length,
    uart: boards.filter(board => board?.interfaces?.uart).length,
    jtag: boards.filter(board => board?.interfaces?.jtag).length,
    qwiic: boards.filter(board => board?.interfaces?.qwiic).length,
    grove: boards.filter(board => board?.interfaces?.grove).length,
    stemma: boards.filter(board => board?.interfaces?.stemma).length,
  };

  const powerCounts = {
    battery: boards.filter(board => board?.power?.battery?.supported).length,
    battery_connector: boards.filter(board => board?.power?.battery?.connector).length,
    charging: boards.filter(board => board?.power?.battery?.charging).length,
    monitoring: boards.filter(board => board?.power?.battery?.monitoring).length,
    solar: boards.filter(board => board?.power?.solar).length,
    poe: boards.filter(board => board?.power?.poe).length,
  };

  const displayCounts = {
    builtin: boards.filter(board => board?.display?.builtin).length,
    touch: boards.filter(board => board?.display?.touch).length,
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
        { id: 'wifi', label: 'WiFi', count: connectivityCounts.wifi },
        { id: 'bluetooth', label: 'Bluetooth', count: connectivityCounts.bluetooth },
        { id: 'lora', label: 'LoRa', count: connectivityCounts.lora },
        { id: 'ethernet', label: 'Ethernet', count: connectivityCounts.ethernet },
        { id: 'zigbee', label: 'Zigbee', count: connectivityCounts.zigbee },
        { id: 'thread', label: 'Thread', count: connectivityCounts.thread },
        { id: 'matter', label: 'Matter', count: connectivityCounts.matter },
        { id: 'can', label: 'CAN', count: connectivityCounts.can },
      ].filter(option => option.count > 0),
    },
    sensors: {
      label: 'Sensors',
      options: [
        { id: 'temperature', label: 'Temperature', count: sensorCounts.temperature },
        { id: 'humidity', label: 'Humidity', count: sensorCounts.humidity },
        { id: 'pressure', label: 'Pressure', count: sensorCounts.pressure },
        { id: 'imu', label: 'IMU', count: sensorCounts.imu },
        { id: 'microphone', label: 'Microphone', count: sensorCounts.microphone },
        { id: 'camera', label: 'Camera', count: sensorCounts.camera },
        { id: 'hall', label: 'Hall Effect', count: sensorCounts.hall },
      ].filter(option => option.count > 0),
    },
    power: {
      label: 'Power',
      options: [
        { id: 'battery', label: 'Battery Support', count: powerCounts.battery },
        { id: 'battery_connector', label: 'Battery Connector', count: powerCounts.battery_connector },
        { id: 'charging', label: 'Battery Charging', count: powerCounts.charging },
        { id: 'monitoring', label: 'Battery Monitoring', count: powerCounts.monitoring },
        { id: 'solar', label: 'Solar', count: powerCounts.solar },
        { id: 'poe', label: 'PoE', count: powerCounts.poe },
      ].filter(option => option.count > 0),
    },
    display: {
      label: 'Display',
      options: [
        { id: 'builtin', label: 'Built-in Display', count: displayCounts.builtin },
        { id: 'touch', label: 'Touch Screen', count: displayCounts.touch },
      ].filter(option => option.count > 0),
    },
    interfaces: {
      label: 'Interfaces',
      options: [
        { id: 'i2c', label: 'I2C', count: interfaceCounts.i2c },
        { id: 'spi', label: 'SPI', count: interfaceCounts.spi },
        { id: 'uart', label: 'UART', count: interfaceCounts.uart },
        { id: 'jtag', label: 'JTAG', count: interfaceCounts.jtag },
        { id: 'qwiic', label: 'Qwiic', count: interfaceCounts.qwiic },
        { id: 'grove', label: 'Grove', count: interfaceCounts.grove },
        { id: 'stemma', label: 'STEMMA', count: interfaceCounts.stemma },
      ].filter(option => option.count > 0),
    },
  };
}

export const filterBoards = (boards: Board[], filters: FilterState): Board[] => {
  return boards.filter((board) => {
    // Handle search query
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const searchMatches = 
        board.name.toLowerCase().includes(searchLower) ||
        board.manufacturer.toLowerCase().includes(searchLower) ||
        board.cpu.model.toLowerCase().includes(searchLower);
      
      if (!searchMatches) {
        return false;
      }
    }

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
      if (!filters.interfaces.every(feature => {
        if (feature === 'usb') return true; // USB is handled separately
        return board?.interfaces && board.interfaces[feature as keyof typeof board.interfaces];
      })) {
        return false;
      }
    }

    return true;
  });
};
