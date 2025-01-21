# Development Board Database

A comprehensive database of development boards (ESP32, RP2040, SAMD21, etc.), helping makers and developers find the perfect board for their projects. The website is built with Next.js and is statically generated, making it fast and easy to deploy.

## Features

- 🔍 Advanced filtering by:
  - CPU type (ESP32, RP2040, etc.)
  - USB connector type
  - Connectivity (WiFi, Bluetooth, LoRa, etc.)
  - Sensors (Temperature, IMU, etc.)
  - Power options (Battery, Solar)
  - Display options
  - Interfaces (I2C, SPI, etc.)
- 🖼️ Visual board gallery with detailed specifications
- 🚀 Static site generation for fast loading
- 📱 Responsive design
- ♿ Accessible UI with ARIA support
- 🌐 Open source and community-driven

## Contributing Boards

1. Fork this repository
2. Create a new JSON file in `src/data/boards/`
3. Name the file using the format: `[Manufacturer]_[BoardName].json` (e.g., `Espressif_ESP32-DevKitC.json`)
4. Fill out the board information following this template:

```json
{
  "name": "Board Name",
  "manufacturer": "Manufacturer Name",
  "imageUrl": "https://example.com/board-image.jpg",
  "purchaseUrl": "https://example.com/purchase",
  "releaseDate": "2023-01-01",
  "price": 29.99,

  "dimensions": {
    "length": 65.0,
    "width": 30.0,
    "height": 8.0
  },

  "cpu": {
    "model": "ESP32-S3",
    "architecture": "Xtensa LX7",
    "frequency": 240
  },

  "memory": {
    "flash": 4,
    "ram": 2
  },

  "gpio": {
    "gpio": 45,
    "analog": 20,
    "pwm": 8
  },

  "usbConnectorType": "Type-C",

  "connectivity": {
    "wifi": true,
    "bluetooth": true,
    "lora": false,
    "ethernet": false,
    "zigbee": false,
    "thread": false,
    "matter": false,
    "can": false
  },

  "interfaces": {
    "usb": {
      "type": "Type-C",
      "otg": true
    },
    "i2c": true,
    "spi": true,
    "uart": true,
    "jtag": false,
    "qwiic": false,
    "grove": false,
    "stemma": false
  },

  "power": {
    "battery": {
      "supported": true,
      "connector": true,
      "monitoring": true,
      "charging": true
    },
    "solar": false,
    "poe": false
  },

  "display": {
    "builtin": false,
    "touch": false
  },

  "sensors": {
    "temperature": false,
    "humidity": false,
    "pressure": false,
    "imu": false,
    "microphone": false,
    "camera": false,
    "hall": false
  },

  "urls": {
    "product": "https://example.com/product",
    "documentation": "https://example.com/docs",
    "github": "https://github.com/manufacturer/board",
    "purchase": "https://example.com/buy"
  },

  "openSource": true
}
```

### Validation

All board submissions are automatically validated for:

- Correct JSON format and schema
- Required fields presence
- Valid URLs and image links
- Proper data types and ranges
- Consistent naming conventions

Run validation locally:

```bash
npm run validate-boards
```

## Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/devboards.git
```

2. Install dependencies:

```bash
cd devboards
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zod](https://zod.dev/) - Schema validation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## Acknowledgments

- Thanks to all [contributors](https://github.com/olipayne/devboards.dev/graphs/contributors)
- Board manufacturers for creating amazing hardware
- Open source community for inspiration and support
