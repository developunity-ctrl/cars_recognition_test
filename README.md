# Car Recognition Test

A TypeScript application for classifying and recognizing car brands and models from images using zero-shot image classification with AI transformers.

## Project Status

⚠️ **Work in Progress** - Currently in testing phase with hardcoded values for experimentation.

## Features

- **Zero-Shot Image Classification**: Classify car images against custom labels without training
- **Batch Processing**: Process multiple images from a directory
- **Result Mapping**: Structure recognition results with scores for each car brand/model
- **Error Handling**: Comprehensive error handling with Result type pattern

## Current Setup (Hardcoded for Testing)

### Classifier Model
- **Model**: `Xenova/clip-vit-base-patch32` (CLIP - Vision-Language model)
- **Pipeline**: `zero-shot-image-classification`

### Classification Labels (Hardcoded)
Currently testing with predefined car brands/models:
- Toyota Camry
- Honda Civic
- BMW 3 Series
- Mercedes-Benz C-Class
- Ford Mustang
- Chevrolet Corvette

### Image Directory
- **Location**: `./images`
- **Supported Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`

## Installation

```bash
# Install dependencies
pnpm install
```

## Usage

```bash
# Run the application
pnpm start
```

The application will:
1. Scan the `./images` directory for supported image formats
2. Load each image
3. Classify against all predefined car labels
4. Output confidence scores for each label

### Example Output

```
Car recognition results for car1.jpg:
[
  { label: "Toyota Camry", score: 0.89 },
  { label: "Honda Civic", score: 0.05 },
  { label: "BMW 3 Series", score: 0.03 },
  ...
]
```

## Project Structure

```
.
├── index.ts                 # Main application entry point
├── src/
│   └── utils/
│       └── result.ts        # Result type and utility functions
├── images/                  # Input images directory (add car images here)
├── package.json
├── .gitignore
└── README.md
```

## Key Files

- **index.ts**: Main logic for loading images and running recognition
- **src/utils/result.ts**: Result monad pattern for error handling with `success`, `error`, `pipe`, and `match` utilities

## Future Improvements

- [ ] Make classifier model configurable 
- [ ] Make car labels configurable 
- [ ] Add confidence threshold filtering
- [ ] Support for custom/fine-tuned models
- [ ] Batch processing optimization
- [ ] Export results to JSON/CSV

## Dependencies

- `@xenova/transformers`: JavaScript/WebAssembly ML library

## Requirements

- Node.js (v24+)
- pnpm (v11+)

## Notes

This is a testing project to explore zero-shot image classification capabilities. The hardcoded values are intentional for MVP development and will be made configurable in production.

## License

ISC
