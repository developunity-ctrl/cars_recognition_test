import { readdir } from "fs/promises";
import { extname, join } from "path";

import {
  pipeline,
  RawImage,
  ZeroShotImageClassificationOutput,
  ZeroShotImageClassificationPipeline,
} from "@xenova/transformers";

import {
  success,
  error,
  pipeResult,
  type Result,
  match,
  pureResult,
} from "./src/utils/result.js";

import { IMAGES_DIR, IMAGES_EXTENSIONS } from "./constatnts.js";

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

async function loadImage(filename: string) {
  try {
    const image = await RawImage.read(join(IMAGES_DIR, filename));

    return success({ filename, image });
  } catch (err) {
    return error(err instanceof Error ? err.message : String(err));
  }
}

function performRecognition(pipeline: ZeroShotImageClassificationPipeline) {
  return async (image: { filename: string; image: RawImage }) => {
    try {
      const results = await pipeline(image.image, CAR_LABELS);

      const rand = Math.random();
      if (rand < 0.2) {
        throw new Error("Simulated random error while loading image");
      }

      return success({ filename: image.filename, results });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return error(
        `Failed to perform recognition on ${image.filename}\n: ${message}`,
      );
    }
  };
}

async function extractRecognitionResults(data: {
  filename: string;
  results:
    | ZeroShotImageClassificationOutput[]
    | ZeroShotImageClassificationOutput[][];
}) {
  const { filename, results } = data;
  const topResult = results[0];

  return success({ filename, results: topResult });
}

type ProcessingPipeResult<T> = (
  initialData: Result<string, string> | Promise<Result<string, string>>,
) => Promise<Result<{ filename: string; results: T }, string>>;

async function cratePipeline() {
  const model = await pipeline(
    "zero-shot-image-classification",
    "Xenova/clip-vit-base-patch32",
  );

  return model;
}

async function handleResolve(
  result: Result<
    {
      filename: string;
      results:
        | ZeroShotImageClassificationOutput
        | ZeroShotImageClassificationOutput[];
    },
    string
  >,
) {
  match(
    result,
    (data) => {
      console.log(`TopResult for ${data.filename}:`, data.results);
    },
    (err) => {
      console.error(`Error processing:`, err);
    },
  );
}

function run(
  processingPipe: ProcessingPipeResult<
    ZeroShotImageClassificationOutput | ZeroShotImageClassificationOutput[]
  >,
) {
  return async (images: string[]) => {
    console.log("Started processing images. Count:", images.length);

    const promises = images.map((filename) =>
      processingPipe(pureResult(filename))
        .then(handleResolve)
        .catch((err) => {
          console.error(`Unexpected error processing ${filename}:`, err);
        }),
    );

    await Promise.all(promises);
  };
}

async function main() {
  const pipeline = await cratePipeline();

  const processingPipe = await pipeResult(
    loadImage,
    performRecognition(pipeline),
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
