import {
  ImageClassificationOutput,
  pipeline,
  RawImage,
  ZeroShotImageClassificationOutput,
} from "@xenova/transformers";
import { readdir } from "fs/promises";
import { extname, join } from "path";
import {
  success,
  error,
  pipeResult,
  type Result,
  match,
  pureResult,
} from "./src/utils/result.js";

const IMAGES_DIR = "./images";
const IMAGES_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const CAR_LABELS = [
  "Nissan Leaf White",
  "Toyota Camry Blue",
  "Honda Civic Red",
  "BMW 3 Series Black",
  "Mercedes-Benz C-Class Silver",
  "Ford Mustang Yellow",
  "Chevrolet Corvette White",
];

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

async function logProcessingStart(filename: string) {
  console.log(`Processing image: ${filename} ... `);
  return success(filename);
}

async function loadImage(filename: string) {
  try {
    const image = await RawImage.read(join(IMAGES_DIR, filename));

    return success({ filename, image });
  } catch (err) {
    return error(err instanceof Error ? err.message : String(err));
  }
}

async function performRecognition(image: {
  filename: string;
  image: RawImage;
}) {
  try {
    const model = await pipeline(
      "zero-shot-image-classification",
      "Xenova/clip-vit-base-patch32",
    );

    const results = await model(image.image, CAR_LABELS);
    return success({ filename: image.filename, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return error(
      `Failed to perform recognition on ${image.filename}\n: ${message}`,
    );
  }
}

async function extractRecognitionResults(data: {
  filename: string;
  results:
    | ZeroShotImageClassificationOutput[]
    | ZeroShotImageClassificationOutput[][];
}) {
  const { filename, results } = data;
  const topResult = results[0];

  console.log(`Image: ${filename}`);
  if (Array.isArray(topResult)) {
    topResult.forEach((res) => {
      console.log(`  Label: ${res.label}, Score: ${res.score.toFixed(4)}`);
    });
  } else {
    console.log(
      `  Label: ${topResult.label}, Score: ${topResult.score.toFixed(4)}`,
    );
  }

  return success({ filename, results: topResult });
}

type ProcessingPipeResult = (
  initialData: Result<string, string> | Promise<Result<string, string>>,
) => Promise<
  Result<
    {
      filename: string;
      results:
        | ZeroShotImageClassificationOutput
        | ZeroShotImageClassificationOutput[];
    },
    string
  >
>;

function run(processingPipe: ProcessingPipeResult) {
  return async (images: string[]) => {
    const results = await Promise.allSettled(
      images.map((filename) => processingPipe(pureResult(filename))),
    );

    results
      .filter(
        (res) =>
          res.status === "rejected" ||
          (res.status === "fulfilled" && !res.value.success),
      )
      .forEach((error) => {
        console.error(
          error.status === "rejected" ? error.reason : error.value.error,
          "\n-------------------------------\n\n",
        );
      });
  };
}

async function main() {
  const processingPipe = await pipeResult(
    logProcessingStart,
    loadImage,
    performRecognition,
    extractRecognitionResults,
  );
  const imagesResult = await getImagesList();

  match(imagesResult, run(processingPipe), (err) => {
    console.error("Failed to read images directory:", err);
  });
}

main().catch((err) => {
  console.error(
    "An error occurred:",
    err instanceof Error ? err.message : String(err),
  );
});
