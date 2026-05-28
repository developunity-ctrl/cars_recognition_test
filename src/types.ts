import {
  ZeroShotImageClassificationOutput,
  type ZeroShotImageClassificationPipeline,
} from "@xenova/transformers";

export type PipelineTaskTypeMap = {
  "zero-shot-image-classification": ZeroShotImageClassificationPipeline;
};

export type OutputTaskTypeMap = {
  "zero-shot-image-classification":
    | ZeroShotImageClassificationOutput[]
    | ZeroShotImageClassificationOutput[][];
};

export type ResultTaskTypeMap = {
  "zero-shot-image-classification":
    | ZeroShotImageClassificationOutput
    | ZeroShotImageClassificationOutput[];
};


