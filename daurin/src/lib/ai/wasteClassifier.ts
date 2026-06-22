import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

// Define the exact string literals required by the API contract
export type WasteClass =
  | "PLASTIK_PET"
  | "PLASTIK_HDPE"
  | "KERTAS_KARDUS"
  | "LOGAM_KALENG"
  | "KACA"
  | "ELEKTRONIK";

export interface ClassificationResult {
  topClass: WasteClass;
  confidence: number; // 0-1
  allPredictions: Array<{
    class: WasteClass;
    confidence: number;
  }>;
  needsManualReview: boolean; // true if confidence < 0.5
}

// Global singleton cache for the model
let cachedModel: mobilenet.MobileNet | null = null;

/**
 * Loads the MobileNet model. Caches it in module scope to prevent multiple downloads.
 */
export async function loadModel(): Promise<void> {
  if (cachedModel) return;

  // Make sure we have a WebGL or fallback backend initialized
  await tf.ready();
  
  cachedModel = await mobilenet.load({
    version: 2,
    alpha: 1.0,
  });
}

/**
 * Checks if the MobileNet model has been successfully loaded into the cache.
 */
export function isModelLoaded(): boolean {
  return cachedModel !== null;
}

/**
 * Heuristics mapping from ImageNet (MobileNet) classes to Daurin's WasteClass.
 * This is a proof-of-concept map since MobileNet recognizes 1000 general objects.
 */
function mapMobileNetClassToDaurin(className: string): WasteClass {
  const lowerName = className.toLowerCase();

  // PLASTIK_PET (Bottles, clear plastic)
  if (lowerName.includes("bottle") || lowerName.includes("water") || lowerName.includes("pop") || lowerName.includes("nipple")) {
    return "PLASTIK_PET";
  }

  // PLASTIK_HDPE (Opaque plastics, tubs, barrels)
  if (lowerName.includes("bucket") || lowerName.includes("pail") || lowerName.includes("barrel") || lowerName.includes("tub") || lowerName.includes("jug")) {
    return "PLASTIK_HDPE";
  }

  // KERTAS_KARDUS (Cardboard, paper)
  if (lowerName.includes("carton") || lowerName.includes("box") || lowerName.includes("envelope") || lowerName.includes("paper") || lowerName.includes("binder")) {
    return "KERTAS_KARDUS";
  }

  // LOGAM_KALENG (Metal cans, tins)
  if (lowerName.includes("can") || lowerName.includes("tin") || lowerName.includes("pot") || lowerName.includes("pan") || lowerName.includes("bucket")) {
    return "LOGAM_KALENG";
  }

  // KACA (Glass containers)
  if (lowerName.includes("glass") || lowerName.includes("beer") || lowerName.includes("wine") || lowerName.includes("pitcher") || lowerName.includes("jar") || lowerName.includes("beaker") || lowerName.includes("cup")) {
    return "KACA";
  }

  // ELEKTRONIK (Electronics)
  if (lowerName.includes("computer") || lowerName.includes("phone") || lowerName.includes("keyboard") || lowerName.includes("mouse") || lowerName.includes("monitor") || lowerName.includes("television") || lowerName.includes("modem") || lowerName.includes("printer") || lowerName.includes("remote") || lowerName.includes("laptop")) {
    return "ELEKTRONIK";
  }

  // Default fallback if unknown
  return "PLASTIK_PET";
}

/**
 * Classifies an image using MobileNet and maps it to Daurin's WasteClass.
 */
export async function classifyWasteImage(
  input: File | HTMLImageElement
): Promise<ClassificationResult> {
  if (!cachedModel) {
    await loadModel();
  }

  if (!cachedModel) {
    throw new Error("Failed to load MobileNet model.");
  }

  let imgElement: HTMLImageElement;

  if (input instanceof File) {
    imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(input);
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(objectUrl);
      };
      img.onerror = (e) => {
        reject(new Error("Failed to load image file into HTMLImageElement."));
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    });
  } else {
    imgElement = input;
  }

  // Predict top 3 classes
  const predictions = await cachedModel.classify(imgElement, 3);

  // Map ImageNet classes to Daurin's WasteClass
  const mappedPredictions = predictions.map((p) => ({
    class: mapMobileNetClassToDaurin(p.className),
    confidence: p.probability,
  }));

  // Consolidate duplicate mapped classes by taking the max confidence
  const consolidatedMap = new Map<WasteClass, number>();
  for (const p of mappedPredictions) {
    const existing = consolidatedMap.get(p.class) || 0;
    if (p.confidence > existing) {
      consolidatedMap.set(p.class, p.confidence);
    }
  }

  const allPredictions = Array.from(consolidatedMap.entries())
    .map(([cls, conf]) => ({ class: cls, confidence: conf }))
    .sort((a, b) => b.confidence - a.confidence); // Highest confidence first

  const topPrediction = allPredictions[0] || {
    class: "PLASTIK_PET",
    confidence: 0,
  };

  return {
    topClass: topPrediction.class,
    confidence: topPrediction.confidence,
    allPredictions: allPredictions,
    needsManualReview: topPrediction.confidence < 0.5,
  };
}
