import { createBoardSlug } from '@/utils/slugs';

// Test cases
const tests = [
  {
    manufacturer: 'Espressif',
    name: 'ESP32-DevKitC',
    expected: 'espressif-esp32-devkitc'
  },
  {
    manufacturer: 'Adafruit',
    name: 'ESP32 Feather V2',
    expected: 'adafruit-esp32-feather-v2'
  },
  {
    manufacturer: 'M5Stack',
    name: 'ATOM Echo',
    expected: 'm5stack-atom-echo'
  }
];

tests.forEach(test => {
  const result = createBoardSlug(test.manufacturer, test.name);
  console.log(`Testing ${test.manufacturer} ${test.name}:`);
  console.log(`Expected: ${test.expected}`);
  console.log(`Got:      ${result}`);
  console.log(`Match:    ${result === test.expected ? '✅' : '❌'}\n`);
});
