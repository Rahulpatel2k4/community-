import { SavedLocation, UserRadiusLocation, LocationTag, NeighborhoodCluster } from '../types';
import { MAX_COMMUNITY_POOL_RADIUS_KM, NEIGHBORHOODS } from '../data/mockData';

export const DEFAULT_SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: 'loc-home-1',
    tag: 'home',
    title: 'Home (Silver Springs)',
    flatTower: 'Flat 402, Tower B (Emerald)',
    societyName: 'Silver Springs Enclave',
    area: 'Hennur Ring Road, Bangalore North',
    pincode: '560043',
    landmark: 'Opposite Bio-Park Gate 2',
    deliveryInstructions: 'Ring doorbell and leave crate on doorstep stand',
    distanceKm: 1.8,
    isDefault: true,
    latitude: 13.0358,
    longitude: 77.6432,
    accuracyMeters: 10,
    detectedViaGps: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'loc-work-1',
    tag: 'work',
    title: 'Work / Office (Cyber Tech Park)',
    flatTower: 'Floor 4, Wing A, ByteTower',
    societyName: 'Cyber Oasis Tech Park',
    area: 'Outer Ring Road, Kadubeesanahalli',
    pincode: '560103',
    landmark: 'Behind Building 2 Cafeteria',
    deliveryInstructions: 'Hand over parcel to Main Gate Reception Desk',
    distanceKm: 2.1,
    isDefault: false,
    latitude: 12.9352,
    longitude: 77.6944,
    accuracyMeters: 15,
    detectedViaGps: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'loc-parents-1',
    tag: 'parents',
    title: 'Parents’ House (Palm Meadows)',
    flatTower: 'Villa 44-B, Boulevard 2',
    societyName: 'Palm Meadows Gated Villas',
    area: 'Whitefield Main Road, East Bengaluru',
    pincode: '560066',
    landmark: 'Near Club House Pool',
    deliveryInstructions: 'Call on arrival (+91 98450 •••••)',
    distanceKm: 2.4,
    isDefault: false,
    latitude: 12.9698,
    longitude: 77.7499,
    accuracyMeters: 12,
    detectedViaGps: false,
    createdAt: new Date().toISOString(),
  },
];

// Local storage keys
const SAVED_LOCATIONS_KEY = 'community_saved_user_locations';
const ACTIVE_LOCATION_KEY = 'community_active_user_location';
const GPS_PERMISSION_STATE_KEY = 'community_gps_permission_preference';

/**
 * Loads saved locations from localStorage with fallback defaults
 */
export function getSavedLocations(): SavedLocation[] {
  try {
    const saved = localStorage.getItem(SAVED_LOCATIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load saved locations', e);
  }
  return DEFAULT_SAVED_LOCATIONS;
}

/**
 * Saves location list to localStorage
 */
export function saveLocationsToStorage(locations: SavedLocation[]): void {
  try {
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(locations));
  } catch (e) {
    console.error('Failed to save locations to storage', e);
  }
}

/**
 * Loads the active selected location
 */
export function getActiveUserLocation(): UserRadiusLocation {
  try {
    const saved = localStorage.getItem(ACTIVE_LOCATION_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load active location', e);
  }

  const all = getSavedLocations();
  const defaultLoc = all.find((l) => l.isDefault) || all[0];
  return savedLocationToUserRadiusLocation(defaultLoc);
}

/**
 * Sets active user location
 */
export function setActiveUserLocation(location: UserRadiusLocation): void {
  try {
    localStorage.setItem(ACTIVE_LOCATION_KEY, JSON.stringify(location));
  } catch (e) {
    console.error('Failed to save active location', e);
  }
}

/**
 * Converts a SavedLocation object to UserRadiusLocation
 */
export function savedLocationToUserRadiusLocation(saved: SavedLocation): UserRadiusLocation {
  return {
    id: saved.id,
    address: `${saved.flatTower ? saved.flatTower + ', ' : ''}${saved.societyName}`,
    society: saved.societyName,
    distanceKm: saved.distanceKm,
    isWithinRadius: saved.distanceKm <= MAX_COMMUNITY_POOL_RADIUS_KM,
    flatTower: saved.flatTower,
    area: saved.area,
    pincode: saved.pincode,
    tag: saved.tag,
    deliveryInstructions: saved.deliveryInstructions,
    latitude: saved.latitude,
    longitude: saved.longitude,
    accuracyMeters: saved.accuracyMeters,
    detectedViaGps: saved.detectedViaGps,
  };
}

/**
 * Calculates Haversine distance in KM between two coordinates
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Find closest neighborhood cluster from coordinates
 */
export function findClosestNeighborhood(
  lat: number,
  lng: number,
  neighborhoods: NeighborhoodCluster[]
): { neighborhood: NeighborhoodCluster; distanceKm: number } {
  // Approximate coordinates for known hubs
  const hubCoordinates: Record<string, { lat: number; lng: number }> = {
    'silver-springs': { lat: 13.0358, lng: 77.6432 },
    'palm-meadows': { lat: 12.9698, lng: 77.7499 },
    'cyber-oasis': { lat: 12.9352, lng: 77.6944 },
    'green-acres': { lat: 13.0125, lng: 77.6821 },
  };

  let closest = neighborhoods[0];
  let minDistance = 999;

  for (const n of neighborhoods) {
    const coords = hubCoordinates[n.id] || { lat: 13.0, lng: 77.6 };
    const dist = calculateHaversineDistance(lat, lng, coords.lat, coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = n;
    }
  }

  // Ensure reasonable distance display
  const simulatedDist = Math.max(0.4, Math.min(minDistance, 4.8));
  return { neighborhood: closest, distanceKm: Math.round(simulatedDist * 10) / 10 };
}

export interface GeolocationResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  address?: string;
  society?: string;
  distanceKm?: number;
  isWithinRadius?: boolean;
  errorMessage?: string;
  permissionDenied?: boolean;
}

/**
 * Requests device GPS via browser Geolocation API
 */
export async function requestDeviceLocation(
  neighborhoods: NeighborhoodCluster[]
): Promise<GeolocationResult> {
  if (!('geolocation' in navigator)) {
    return {
      success: false,
      errorMessage: 'Geolocation is not supported by your browser or device.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const { neighborhood, distanceKm } = findClosestNeighborhood(
          latitude,
          longitude,
          neighborhoods
        );

        const isWithinRadius = distanceKm <= MAX_COMMUNITY_POOL_RADIUS_KM;
        const resolvedAddress = `Live GPS: Near ${neighborhood.shortName} (${Math.round(latitude * 1000) / 1000}°, ${Math.round(longitude * 1000) / 1000}°)`;

        resolve({
          success: true,
          latitude,
          longitude,
          accuracyMeters: Math.round(accuracy),
          address: resolvedAddress,
          society: neighborhood.name,
          distanceKm,
          isWithinRadius,
        });
      },
      (error) => {
        let message = 'Unable to retrieve your location.';
        let isDenied = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission was denied. Please allow location access in your phone/browser settings.';
            isDenied = true;
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is currently unavailable from your device GPS.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        }

        resolve({
          success: false,
          errorMessage: message,
          permissionDenied: isDenied,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
}
