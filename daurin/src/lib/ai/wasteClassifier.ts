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

/**
 * Heuristics mapping from external API string to Daurin's WasteClass.
 */
function mapExternalApiClassToDaurin(className: string): WasteClass {
  const lowerName = className.toLowerCase();

  if (lowerName.includes("pet") || lowerName.includes("hdpe") || lowerName.includes("plastik")) {
    if (lowerName.includes("hdpe")) return "PLASTIK_HDPE";
    return "PLASTIK_PET";
  }

  if (lowerName.includes("kertas") || lowerName.includes("kardus") || lowerName.includes("paper")) {
    return "KERTAS_KARDUS";
  }

  if (lowerName.includes("logam") || lowerName.includes("kaleng") || lowerName.includes("metal")) {
    return "LOGAM_KALENG";
  }

  if (lowerName.includes("kaca") || lowerName.includes("glass")) {
    return "KACA";
  }

  if (lowerName.includes("elektronik") || lowerName.includes("electronic")) {
    return "ELEKTRONIK";
  }

  // Default fallback if unknown
  return "PLASTIK_PET";
}

/**
 * Classifies an image using the external AI API (Flask).
 */
export async function classifyWasteImage(
  input: File
): Promise<ClassificationResult> {
  const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || "https://racism-relative-antsy.ngrok-free.dev/api/daurin/v1/predict";
  
  const formData = new FormData();
  formData.append('image', input);

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Gagal menghubungi server AI eksternal');
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Server merespon dengan kegagalan');
  }

  const mappedClass = mapExternalApiClassToDaurin(data.classification || "");

  // Simulated confidence since the external API currently only returns the class string
  const simulatedConfidence = 0.95;

  return {
    topClass: mappedClass,
    confidence: simulatedConfidence,
    allPredictions: [
      { class: mappedClass, confidence: simulatedConfidence }
    ],
    needsManualReview: false,
  };
}
