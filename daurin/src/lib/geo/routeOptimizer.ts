import { haversineDistance } from './haversine'

export function optimizeRoute(
  startLat: number, startLng: number,
  points: Array<{ id: string; lat: number; lng: number; label: string; wasteType: string }>
) {
  const unvisited = [...points]
  const ordered = []
  let currentLat = startLat
  let currentLng = startLng
  let totalKm = 0

  while (unvisited.length > 0) {
    let nearest = unvisited[0]
    let minDist = haversineDistance(currentLat, currentLng, nearest.lat, nearest.lng)
    
    for (const point of unvisited.slice(1)) {
      const dist = haversineDistance(currentLat, currentLng, point.lat, point.lng)
      if (dist < minDist) { minDist = dist; nearest = point }
    }
    
    ordered.push({ ...nearest, distanceFromPrevKm: minDist })
    totalKm += minDist
    currentLat = nearest.lat
    currentLng = nearest.lng
    unvisited.splice(unvisited.indexOf(nearest), 1)
  }

  const fuelCostPerKm = 10000 / 40  // Rp 10.000/liter, 40km/liter
  return {
    orderedPoints: ordered,
    totalDistanceKm: Math.round(totalKm * 10) / 10,
    estimatedCostRp: Math.round(totalKm * fuelCostPerKm),
    estimatedDurationMin: Math.round((totalKm / 30) * 60)  // 30km/h avg
  }
}
