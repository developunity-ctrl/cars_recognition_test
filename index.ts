import {
  ImageClassificationOutput,
  pipeline,
  RawImage,
} from "@xenova/transformers";
import { readdir } from "fs/promises";
import { extname, join } from "path";
import {
  success,
  error,
  pipe,
  type Result,
  match,
} from "./src/utils/result.js";

const IMAGES_DIR = "./images";
const IMAGES_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

async function getImagesList(): Promise<Result<string[], string>> {
  try {
    const files: string[] = await readdir(IMAGES_DIR);
    const images = files.filter((file) =>
      IMAGES_EXTENSIONS.includes(extname(file).toLowerCase()),
    );
    return success(images);
  } catch (err) {
    return error(err instanceof Error ? err.message : String(err));
  }
}

async function loadImages(filenames: string[]) {
  try {
    const images = await Promise.all(
      filenames.map(async (filename) => {
        const image = await RawImage.read(join(IMAGES_DIR, filename));
        return {
          filename,
          image,
        };
      }),
    );
    return success(images);
  } catch (err) {
    return error(err instanceof Error ? err.message : String(err));
  }
}

const CAR_LABELS = [
  "Nissan Leaf White",
  "Toyota Camry Blue",
  "Honda Civic Red",
  "BMW 3 Series Black",
  "Mercedes-Benz C-Class Silver",
  "Ford Mustang Yellow",
  "Chevrolet Corvette White",
];

async function* recognizeCars(images: { filename: string; image: RawImage }[]) {
  try {
    const model = await pipeline(
      "zero-shot-image-classification",
      "Xenova/clip-vit-base-patch32",
    );

    for (const { filename, image } of images) {
      const results = await model(image, CAR_LABELS);
      yield success({ filename, results });
    }
  } catch (err) {
    return error(err instanceof Error ? err.message : String(err));
  }
}

async function runRecognition(images: { filename: string; image: RawImage }[]) {
  const recognitionResults = recognizeCars(images);

  for await (const recognitionResult of recognitionResults) {
    match(recognitionResult, printRecognitionResults, (err) => {
      console.error("Error during car recognition: ", err);
    });
  }
}

async function printRecognitionResults(recognitionResults: {
  filename: string;
  results: ImageClassificationOutput | ImageClassificationOutput[];
}) {
  console.log(
    "Car recognition results for",
    recognitionResults.filename,
    ":",
    recognitionResults.results,
  );
}
async function main() {
  const result = await pipe(getImagesList(), loadImages);

  match(result, runRecognition, (err) => {
    console.error("Error during image loading:", err);
  });
}

main().catch((err) => {
  console.error(
    "An error occurred:",
    err instanceof Error ? err.message : String(err),
  );
});
