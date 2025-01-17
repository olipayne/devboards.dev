This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# ESP32 Development Board Database

A comprehensive database of ESP32 and similar development boards, helping makers and developers find the perfect board for their projects. The website is built with Next.js and is statically generated, making it fast and easy to deploy.

## Features

- 🔍 Filter boards by features (WiFi, Bluetooth, sensors, etc.)
- 💰 Price range filtering
- 🖼️ Visual board gallery with detailed specifications
- 🚀 Fast, static site generation
- 📱 Responsive design
- 🤝 Community-driven board database

## Contributing

### Adding a New Board

1. Fork this repository
2. Create a new JSON file in `src/data/boards/` with your board's information
3. Name the file using the format: `[board-name].json` (use kebab-case)
4. Fill out the board information following this template:

```json
{
  "id": "unique-board-id",
  "name": "Board Name",
  "brand": "Manufacturer",
  "description": "Brief description of the board",
  "imageUrl": "https://example.com/board-image.jpg",
  "purchaseUrl": "https://example.com/purchase",
  "price": 29.99,
  
  // Technical Specifications
  "cpuArchitecture": "Xtensa LX7",
  "usbConnectorType": "USB-C",
  
  // Features (true/false)
  "wifi": true,
  "bluetooth": true,
  "openSource": true,
  // ... other features
}
```

5. Create a Pull Request

### Validation

All board submissions are automatically validated for:
- Correct JSON format
- Required fields
- Valid image URLs
- Duplicate board IDs

The GitHub Actions workflow will check your submission and report any issues.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT License - feel free to use this project for your own board database!
