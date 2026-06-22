export const CO2_FACTORS: Record<string, number> = {
  PLASTIK_PET: 1.75, PLASTIK_HDPE: 1.75,
  KERTAS_KARDUS: 0.90, LOGAM_KALENG: 8.75,
  KACA: 0.40, ELEKTRONIK: 20.0,
}

export const WASTE_LABELS: Record<string, string> = {
  PLASTIK_PET: 'Plastik PET', PLASTIK_HDPE: 'Plastik HDPE',
  KERTAS_KARDUS: 'Kertas/Kardus', LOGAM_KALENG: 'Logam/Kaleng',
  KACA: 'Kaca', ELEKTRONIK: 'Elektronik',
}

export function calculateCO2Offset(wasteType: string, weightKg: number): number {
  return (CO2_FACTORS[wasteType] ?? 1.0) * weightKg
}

export function formatCO2(kgCO2: number): string {
  if (kgCO2 >= 1000) return `${(kgCO2 / 1000).toFixed(2)} ton CO₂e`
  return `${kgCO2.toFixed(1)} kg CO₂e`
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(amount)
}
