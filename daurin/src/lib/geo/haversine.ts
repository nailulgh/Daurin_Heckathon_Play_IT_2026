/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lng1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lng2 Longitude of point 2 in decimal degrees
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRadian = (angle: number) => (Math.PI / 180) * angle;

  const EARTH_RADIUS_KM = 6371;

  const dLat = toRadian(lat2 - lat1);
  const dLng = toRadian(lng2 - lng1);
  
  const radLat1 = toRadian(lat1);
  const radLat2 = toRadian(lat2);

  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLng / 2), 2) * Math.cos(radLat1) * Math.cos(radLat2);
    
  const c = 2 * Math.asin(Math.sqrt(a));
  return EARTH_RADIUS_KM * c;
}
