import { readdir } from "fs/promises";
import { extname, join } from "path";

import { pipeline, RawImage } from "@xenova/transformers";

import {
  success,
  error,
  pipeResult,
  type Result,
  match,
  pureResult,
} from "./utils/result.js";

import {
  BATCH_SIZE,
  CAR_LABELS,
  IMAGES_DIR,
  IMAGES_EXTENSIONS,
} from "./constatnts.js";

import {
  OutputTaskTypeMap,
  PipelineTaskTypeMap,
  ResultTaskTypeMap,
} from "./types.js";

async function* getImagesList(): AsyncGenerator<Result<string[], string>> {
  try {
    const files: string[] = await readdir(IMAGES_DIR);
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const validImages = batch.filter((file) =>
        IMAGES_EXTENSIONS.includes(extname(file).toLowerCase()),
      );

      yield success(validImages);
    }
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

function performRecognition<T extends keyof PipelineTaskTypeMap>(
  pipeline: PipelineTaskTypeMap[T],
) {
  return async (image: { filename: string; image: RawImage }) => {
    try {
      const results = await pipeline(image.image, CAR_LABELS);

      return success({ filename: image.filename, results });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return error(
        `Failed to perform recognition on ${image.filename}\n: ${message}`,
      );
    }
  };
}

async function extractRecognitionResults<
  T extends keyof OutputTaskTypeMap,
>(data: { filename: string; results: OutputTaskTypeMap[T] }) {
  const { filename, results } = data;
  const topResult = results[0];

  return success({ filename, results: topResult });
}

type ProcessingPipeResult<T> = (
  initialData: Result<string, string> | Promise<Result<string, string>>,
) => Promise<Result<{ filename: string; results: T }, string>>;

async function cratePipeline<T extends keyof PipelineTaskTypeMap>(task: T) {
  const model = await pipeline(task, "Xenova/clip-vit-base-patch32");

  return model;
}

async function handleResolve<T extends keyof ResultTaskTypeMap>(
  result: Result<{ filename: string; results: ResultTaskTypeMap[T] }, string>,
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

function executeImagePipeline<T extends keyof ResultTaskTypeMap>(
  processingPipe: ProcessingPipeResult<ResultTaskTypeMap[T]>,
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
  const pipeline = await cratePipeline("zero-shot-image-classification");

  const processingPipe = await pipeResult(
    loadImage,
    performRecognition(pipeline),
    extractRecognitionResults,
  );

  const imagesResult = await getImagesList();

  const pipelineRunner =
    () => async (iteratorResult: IteratorResult<Result<string[], string>>) => {
      if (iteratorResult.done) {
        console.log("Finished processing all images.");
        return;
      }

      await match(
        iteratorResult.value,
        executeImagePipeline(processingPipe),
        (err) => {
          console.error("Failed to read images directory:", err);
        },
      );

      const nextInteratorResult = await imagesResult.next();
      await pipelineRunner()(nextInteratorResult);
    };

  await pipelineRunner()(await imagesResult.next());
}

main().catch((err) => {
  console.error(
    "An error occurred:",
    err instanceof Error ? err.message : String(err),
  );
});
