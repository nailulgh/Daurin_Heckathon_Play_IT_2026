import { haversineDistance } from "./haversine";

export interface RoutePoint {
  id: string;
  lat: number;
  lng: number;
  label: string; // listing address/description
  wasteType: string;
}

export interface OptimizedRoute {
  orderedPoints: RoutePoint[];
  totalDistanceKm: number;
  estimatedCostRp: number; // based on 40km/liter, Rp10000/liter
  estimatedDurationMin: number; // based on 30km/h avg urban speed
}

/**
 * Nearest-neighbor greedy algorithm.
 * Starts from the collector's current position and iteratively picks
 * the closest unvisited point.
 */
export function optimizeRoute(
  startLat: number,
  startLng: number,
  points: RoutePoint[]
): OptimizedRoute {
  if (points.length === 0) {
    return {
      orderedPoints: [],
      totalDistanceKm: 0,
      estimatedCostRp: 0,
      estimatedDurationMin: 0,
    };
  }

  const unvisited = [...points];
  const orderedPoints: RoutePoint[] = [];
  let currentLat = startLat;
  let currentLng = startLng;
  let totalDistanceKm = 0;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = haversineDistance(
        currentLat,
        currentLng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const nextPoint = unvisited[nearestIndex];
    orderedPoints.push(nextPoint);
    totalDistanceKm += minDistance;
    
    // update current position
    currentLat = nextPoint.lat;
    currentLng = nextPoint.lng;
    
    // remove visited point
    unvisited.splice(nearestIndex, 1);
  }

  // Cost and duration estimates based on AGENTS.md rules
  // "estimatedCostRp: number; // based on 40km/liter, Rp10000/liter"
  const FUEL_EFFICIENCY_KM_PER_LITER = 40;
  const FUEL_PRICE_PER_LITER = 10000;
  
  // "estimatedDurationMin: number; // based on 30km/h avg urban speed"
  const AVG_SPEED_KM_PER_H = 30;

  const litersNeeded = totalDistanceKm / FUEL_EFFICIENCY_KM_PER_LITER;
  const estimatedCostRp = litersNeeded * FUEL_PRICE_PER_LITER;

  const hoursNeeded = totalDistanceKm / AVG_SPEED_KM_PER_H;
  const estimatedDurationMin = hoursNeeded * 60;

  return {
    orderedPoints,
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    estimatedCostRp: Math.round(estimatedCostRp),
    estimatedDurationMin: Math.round(estimatedDurationMin),
  };
}
