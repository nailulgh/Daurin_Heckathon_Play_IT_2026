<<<<<<< HEAD
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'

// Mapping MobileNet ImageNet labels → our 6 waste categories
const LABEL_MAP: Record<string, string> = {
  'plastic bag': 'PLASTIK_PET',
  'water bottle': 'PLASTIK_PET',
  'pop bottle': 'PLASTIK_PET',
  'milk can': 'PLASTIK_HDPE',
  'carton': 'KERTAS_KARDUS',
  'paper towel': 'KERTAS_KARDUS',
  'envelope': 'KERTAS_KARDUS',
  'can opener': 'LOGAM_KALENG',
  'beer bottle': 'KACA',
  'wine bottle': 'KACA',
  'laptop': 'ELEKTRONIK',
  'computer keyboard': 'ELEKTRONIK',
  'cellular telephone': 'ELEKTRONIK',
  'remote control': 'ELEKTRONIK',
}

// Default fallback mapping by top-level category
const FALLBACK_MAP: Record<string, string> = {
  'bottle': 'KACA',
  'can': 'LOGAM_KALENG',
  'bag': 'PLASTIK_PET',
  'paper': 'KERTAS_KARDUS',
  'electronic': 'ELEKTRONIK',
}

let model: mobilenet.MobileNet | null = null

export async function loadModel() {
  if (!model) {
    model = await mobilenet.load({ version: 2, alpha: 1.0 })
  }
}

export function isModelLoaded() {
  return model !== null
}

export async function classifyWasteImage(file: File) {
  if (!model) await loadModel()
  
  const img = await createImageElement(file)
  const predictions = await model!.classify(img, 5)
  
  // Map to our categories
  const mapped = predictions.map(p => ({
    label: p.className.toLowerCase(),
    confidence: p.probability,
    wasteClass: mapToWasteClass(p.className.toLowerCase())
  }))

  const topPrediction = mapped[0]
  
  return {
    topClass: topPrediction.wasteClass,
    confidence: topPrediction.confidence,
    allPredictions: mapped.map(m => ({ class: m.wasteClass, confidence: m.confidence })),
    needsManualReview: topPrediction.confidence < 0.5
  }
}

function mapToWasteClass(label: string): string {
  // Direct match
  for (const [key, val] of Object.entries(LABEL_MAP)) {
    if (label.includes(key)) return val
  }
  // Fallback
  for (const [key, val] of Object.entries(FALLBACK_MAP)) {
    if (label.includes(key)) return val
  }
  return 'PLASTIK_PET' // safe default
}

async function createImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = url
  })
=======
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
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
}
