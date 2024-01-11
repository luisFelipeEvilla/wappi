import { Ride } from "src/ride/entities/ride.entity";

export function calcDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const radioTierra = 6371000; // Radio de la Tierra en metros

  const deltaLatitud = toRadians(lat2 - lat1);
  const deltaLongitud = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLatitud / 2) * Math.sin(deltaLatitud / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLongitud / 2) *
      Math.sin(deltaLongitud / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = (radioTierra * c) / 1000;

  return distancia;
}

export function toRadians(grados: number): number {
  return grados * (Math.PI / 180);
}

export function calcRideTime(ride: Ride): number {
    const start = new Date(ride.ride_started_at);
    const end = new Date(ride.ride_ended_at);
    
    return Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
}


export function calcRideCost(ride: Ride): number {
    const x1 = ride.start_location.coordinates[0];
    const y1 = ride.start_location.coordinates[1];

    const x2 = ride.end_location.coordinates[0];
    const y2 = ride.end_location.coordinates[1];

    const distance = calcDistance(x1, y1, x2, y2);

    const time = calcRideTime(ride);

    return Math.floor(distance * 1000 + time * 200 + 3500);
}
