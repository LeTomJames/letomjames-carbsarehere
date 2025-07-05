# Carbs Are Here - Nutrition Scanner

A mobile-first React app that scans food barcodes and displays detailed nutrition facts, with a focus on carbohydrate information.

## Features

- 📱 Mobile-first design optimized for smartphones
- 📷 Real-time barcode scanning using device camera
- 🍎 Detailed nutrition facts with visual progress bars
- 🏷️ Nutri-Score ratings for food quality assessment
- 📊 Comprehensive macronutrient breakdown
- 🌟 Beautiful, modern UI with Mantine components
- 🔍 Ingredient lists and allergen information
- ⚡ Fast and responsive performance

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Mantine** - Modern React UI library
- **Axios** - HTTP client for API calls
- **@zxing/library** - Barcode scanning
- **react-webcam** - Camera access
- **Open Food Facts API** - Nutrition data source

## Getting Started

This project uses [Yarn](https://yarnpkg.com/) as the package manager. Make sure you have yarn installed:

```bash
# Install yarn globally if you haven't already
npm install -g yarn

# Install dependencies
yarn install

# Start the development server
yarn dev

# Build for production
yarn build

# Run ESLint
yarn lint

# Preview the production build
yarn preview
```

## Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the project for production
- `yarn lint` - Run ESLint to check code quality
- `yarn preview` - Preview the production build locally

## How to Use

1. **Open the app** on your mobile device or desktop
2. **Tap "Scan Barcode"** to activate the camera
3. **Point your camera** at any food product barcode
4. **View instant results** with detailed nutrition information
5. **See carb content** and other macronutrients with visual indicators

## Mobile Optimization

The app is designed mobile-first with:
- Touch-friendly interface elements (minimum 44px touch targets)
- Optimized camera scanning for mobile devices
- Responsive design that works on all screen sizes
- Fast loading and smooth animations
- Proper viewport settings for mobile browsers

## Camera Permissions

The app requires camera permissions to scan barcodes. Make sure to:
- Allow camera access when prompted
- Ensure your device has a working camera
- Use proper lighting for better scanning results

## Data Source

Nutrition data is provided by [Open Food Facts](https://world.openfoodfacts.org/), a collaborative, free and open database of food products from around the world.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

This project is open source and available under the MIT License.
