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
}
