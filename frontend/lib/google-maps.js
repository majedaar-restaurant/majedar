/**
 * Google Maps JavaScript API Loader & Utilities for Majedaar Restaurant
 * Authoritative location, Places Autocomplete (New), and Driving Route Distance.
 */

// Authoritative Majedaar Restaurant location from verified Google Maps listing:
// https://maps.app.goo.gl/SbpB8kBUHZnyjfku9
export const RESTAURANT_LOCATION = {
  latitude: 26.7828564,
  longitude: 82.1624034,
  name: "Majedaar Restaurant & Cafe",
  city: "Ayodhya",
};

export const DELIVERY_RULES = {
  maxDistanceMetres: 7000,
  maxDistanceKm: 7,
  tier1: {
    maxMetres: 3000,
    fee: 15,
    label: "0–3 km",
  },
  tier2: {
    maxMetres: 7000,
    fee: 30,
    label: "3–7 km",
  },
};

let googleMapsPromise = null;

export function getGoogleMapsApiKey() {
  return process.env.GOOGLE_MAPS_THREE_API_KEY || "";
}

/**
 * Loads the Google Maps JavaScript API using the modern async pattern
 * with Places (New) and Geocoding libraries.
 */
export function loadGoogleMaps() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only be loaded in the browser."));
  }

  // If already loaded and ready
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google.maps);
  }

  // Reuse existing promise
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    console.warn(
      "[Google Maps] GOOGLE_MAPS_THREE_API_KEY is not configured in frontend/.env. Google Places Autocomplete will run in fallback manual mode."
    );
    return Promise.reject(new Error("GOOGLE_MAPS_API_KEY_MISSING"));
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // If places is already available
    if (window.google?.maps?.places) {
      resolve(window.google.maps);
      return;
    }

    const callbackName = "__initGoogleMapsCallback_" + Math.random().toString(36).substring(2, 9);

    window[callbackName] = () => {
      delete window[callbackName];
      if (window.google?.maps?.places) {
        resolve(window.google.maps);
      } else {
        reject(new Error("Google Maps places library was not initialized."));
      }
    };

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      if (window.google?.maps?.places) {
        resolve(window.google.maps);
        return;
      }
      existingScript.addEventListener("load", () => {
        if (window.google?.maps?.places) {
          resolve(window.google.maps);
        } else {
          setTimeout(() => {
            if (window.google?.maps?.places) resolve(window.google.maps);
            else reject(new Error("Google Maps places library load timeout."));
          }, 300);
        }
      });
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&v=weekly&loading=async&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.id = "google-maps-script";

    script.onerror = (err) => {
      googleMapsPromise = null;
      delete window[callbackName];
      console.error("[Google Maps] Failed to load Google Maps script tag:", err);
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Reverse geocodes latitude and longitude into a readable street address using Google Geocoder.
 * Never returns raw coordinates as address text.
 *
 * @param {Object} coords - { latitude, longitude }
 * @returns {Promise<{ formattedAddress: string, placeId: string, addressComponents: Array }>}
 */
export async function reverseGeocode({ latitude, longitude }) {
  const maps = await loadGoogleMaps();
  const geocoder = new maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK" && Array.isArray(results) && results.length > 0) {
          const topResult = results[0];
          if (topResult.formatted_address && topResult.formatted_address.trim()) {
            resolve({
              formattedAddress: topResult.formatted_address.trim(),
              placeId: topResult.place_id || null,
              addressComponents: topResult.address_components || [],
            });
            return;
          }
        }
        reject(new Error(`Reverse geocoding failed or returned no address (status: ${status})`));
      }
    );
  });
}

/**
 * Authoritatively calculates driving distance and delivery fee from restaurant to customer coordinates
 * by delegating solely to the backend Routes API distance service.
 *
 * Strictly enforces:
 * - 0–3 km (<= 3,000 m) = ₹15
 * - Above 3 km up to 7 km (> 3,000 m and <= 7,000 m) = ₹30
 * - Above 7 km (> 7,000 m) = Ineligible / delivery unavailable
 *
 * @param {Object} coords - { latitude, longitude }
 * @returns {Promise<{
 *   isEligible: boolean,
 *   distanceMeters: number,
 *   distanceKm: number,
 *   formattedDistance: string,
 *   fee: number|null,
 *   tier: string|null,
 *   message?: string
 * }>}
 */
export async function checkDeliveryRoute({ latitude, longitude }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(
      `${apiUrl}/delivery-zones/check-distance?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const json = await res.json().catch(() => ({}));

    if (res.ok && json.data && typeof json.data.distanceMeters === "number") {
      return json.data;
    }

    if (json?.message) {
      throw new Error(json.message);
    }

    throw new Error("Unable to verify delivery distance from the server.");
  } catch (err) {
    throw new Error(
      err.message || "Unable to calculate delivery distance. Please verify your address or try again."
    );
  }
}
