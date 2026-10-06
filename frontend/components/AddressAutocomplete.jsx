"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  loadGoogleMaps,
  reverseGeocode,
  checkDeliveryRoute,
  RESTAURANT_LOCATION,
  getGoogleMapsApiKey,
} from "../lib/google-maps";
import { toast } from "react-toastify";

// Monkey-patch attachShadow once to keep gmp-place-autocomplete shadow DOM open for styling & value sync
if (typeof window !== "undefined" && !window.__gmpShadowPatched) {
  window.__gmpShadowPatched = true;
  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    if (
      this.localName === "gmp-place-autocomplete" ||
      this.tagName === "GMP-PLACE-AUTOCOMPLETE"
    ) {
      return originalAttachShadow.call(this, { ...init, mode: "open" });
    }
    return originalAttachShadow.call(this, init);
  };
}

/**
 * AddressAutocomplete Component for Majedaar Restaurant
 * Integrates Google Places API (New) via PlaceAutocompleteElement,
 * "Use My Current Location" GPS detection with reverse geocoding,
 * and authoritative driving-route distance verification (<= 3 km: ₹15, 3–7 km: ₹30, > 7 km: ineligible).
 */
export default function AddressAutocomplete({
  value = "",
  onChange,
  onLocationSelect,
  onClearLocation,
  location = null,
  isLocationVerified = false,
  serviceability = null,
  setServiceability,
  zones = [],
  inputClass = "",
  placeholder = "Search house, street, building or locality",
  required = true,
  disabled = false,
}) {
  const containerRef = useRef(null);
  const fallbackInputRef = useRef(null);
  const autocompleteElementRef = useRef(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [useFallbackInput, setUseFallbackInput] = useState(false);
  const [geocodingFailedNotice, setGeocodingFailedNotice] = useState(false);

  // Stable references to prevent tearing down the Google Maps Element during React re-renders
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const onLocationSelectRef = useRef(onLocationSelect);
  onLocationSelectRef.current = onLocationSelect;

  const onClearLocationRef = useRef(onClearLocation);
  onClearLocationRef.current = onClearLocation;

  const setServiceabilityRef = useRef(setServiceability);
  setServiceabilityRef.current = setServiceability;

  const isLocationVerifiedRef = useRef(isLocationVerified);
  isLocationVerifiedRef.current = isLocationVerified;

  // Match address text/components against available delivery zones in Ayodhya (for backward compatibility)
  const matchZoneFromAddress = useCallback(
    (formattedAddress, addressComponents = []) => {
      if (!zones || zones.length === 0) return null;
      const lowerAddress = (formattedAddress || "").toLowerCase();

      for (const zone of zones) {
        const zoneName = (zone.name || "").toLowerCase().trim();
        if (zoneName && lowerAddress.includes(zoneName)) {
          return zone._id;
        }
      }

      for (const comp of addressComponents) {
        const compName = (comp.long_name || comp.longText || "").toLowerCase().trim();
        for (const zone of zones) {
          const zoneName = (zone.name || "").toLowerCase().trim();
          if (zoneName && (compName.includes(zoneName) || zoneName.includes(compName))) {
            return zone._id;
          }
        }
      }

      return null;
    },
    [zones]
  );

  const matchZoneFromAddressRef = useRef(matchZoneFromAddress);
  matchZoneFromAddressRef.current = matchZoneFromAddress;

  // Perform backend authoritative route distance check and update serviceability state
  const handleRouteCheck = useCallback(
    async (lat, lng, formattedAddress, placeId, source, matchedZoneId) => {
      if (setServiceabilityRef.current) {
        setServiceabilityRef.current({
          loading: true,
          isEligible: null,
          distanceMeters: null,
          distanceKm: null,
          formattedDistance: null,
          fee: null,
          tier: null,
          error: "",
        });
      }

      try {
        const routeData = await checkDeliveryRoute({ latitude: lat, longitude: lng });

        if (setServiceabilityRef.current) {
          setServiceabilityRef.current({
            loading: false,
            isEligible: routeData.isEligible,
            distanceMeters: routeData.distanceMeters,
            distanceKm: routeData.distanceKm,
            formattedDistance: routeData.formattedDistance,
            fee: routeData.fee,
            tier: routeData.tier,
            error: routeData.isEligible ? "" : routeData.message || "Address is outside our 7 km service radius.",
          });
        }

        if (onLocationSelectRef.current) {
          onLocationSelectRef.current({
            address: formattedAddress,
            latitude: lat,
            longitude: lng,
            placeId,
            formattedAddress,
            source,
            matchedZoneId,
            routeData,
          });
        }

        if (routeData.isEligible) {
          toast.success(
            `Delivery available · ${routeData.formattedDistance} · Fee ₹${routeData.fee}`,
            { autoClose: 3000 }
          );
        } else {
          toast.warn(
            "Sorry, we currently deliver only within 7 km of our restaurant. Please choose another delivery address.",
            { autoClose: 5000 }
          );
        }
      } catch (err) {
        if (setServiceabilityRef.current) {
          setServiceabilityRef.current({
            loading: false,
            isEligible: false,
            distanceMeters: null,
            distanceKm: null,
            formattedDistance: null,
            fee: null,
            tier: null,
            error: err.message || "Failed to calculate driving route distance.",
          });
        }
        toast.error(err.message || "Unable to calculate road distance. Please verify your address.");
      }
    },
    []
  );

  // Load Google Maps script once on mount
  useEffect(() => {
    let isMounted = true;
    loadGoogleMaps()
      .then(() => {
        if (isMounted) setMapsLoaded(true);
      })
      .catch(() => {
        if (isMounted) setUseFallbackInput(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize modern Google Maps Places API (PlaceAutocompleteElement) ONCE when maps are loaded
  useEffect(() => {
    if (!mapsLoaded || !containerRef.current) return;

    const maps = window.google?.maps;
    const PlaceAutocompleteElementClass =
      maps?.places?.PlaceAutocompleteElement ||
      window.google?.maps?.places?.PlaceAutocompleteElement;

    if (!PlaceAutocompleteElementClass) {
      setUseFallbackInput(true);
      return;
    }

    // Clean up previous instance if already mounted
    containerRef.current.innerHTML = "";

    try {
      const placeAutocomplete = new PlaceAutocompleteElementClass();
      autocompleteElementRef.current = placeAutocomplete;

      // Restrict to India and bias to 7 km around Majedaar Restaurant in Ayodhya
      placeAutocomplete.includedRegionCodes = ["in"];
      placeAutocomplete.locationBias = {
        radius: 7000,
        center: {
          lat: RESTAURANT_LOCATION.latitude,
          lng: RESTAURANT_LOCATION.longitude,
        },
      };

      // Style PlaceAutocompleteElement container
      placeAutocomplete.style.width = "100%";
      placeAutocomplete.style.display = "block";

      // Handle place selection event (supports both standard gmp-select and gmp-placeselect)
      const onSelect = async (event) => {
        try {
          let place = event.place;
          if (!place && event.placePrediction) {
            place = event.placePrediction.toPlace
              ? event.placePrediction.toPlace()
              : event.placePrediction;
          }

          if (!place) return;

          if (typeof place.fetchFields === "function") {
            await place.fetchFields({
              fields: [
                "displayName",
                "formattedAddress",
                "location",
                "addressComponents",
                "id",
              ],
            });
          }

          let lat = null;
          let lng = null;
          if (place.location) {
            lat =
              typeof place.location.lat === "function"
                ? place.location.lat()
                : place.location.lat;
            lng =
              typeof place.location.lng === "function"
                ? place.location.lng()
                : place.location.lng;
          }

          const formattedAddress = place.formattedAddress || place.displayName || "";
          const placeId = place.id || null;

          if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
            setGeocodingFailedNotice(false);

            if (onChangeRef.current) {
              onChangeRef.current({ target: { name: "address", value: formattedAddress } });
            }

            if (placeAutocomplete.shadowRoot) {
              const innerInput = placeAutocomplete.shadowRoot.querySelector("input");
              if (innerInput) {
                innerInput.value = formattedAddress;
              }
            }

            const matchedZoneId = matchZoneFromAddressRef.current
              ? matchZoneFromAddressRef.current(formattedAddress, place.addressComponents || [])
              : null;

            await handleRouteCheck(lat, lng, formattedAddress, placeId, "google_places", matchedZoneId);
          }
        } catch (selErr) {
          console.warn("[AddressAutocomplete] Place select handling failed:", selErr.message);
        }
      };

      placeAutocomplete.addEventListener("gmp-select", onSelect);
      placeAutocomplete.addEventListener("gmp-placeselect", onSelect);

      // Append to DOM container
      containerRef.current.appendChild(placeAutocomplete);

      // Set placeholder and wire typing listener on shadowRoot input
      const setupShadowInput = () => {
        const shadow = placeAutocomplete.shadowRoot;
        if (!shadow) return;

        const innerInput = shadow.querySelector("input");
        if (innerInput) {
          if (value) {
            innerInput.value = value;
          }
          innerInput.placeholder = placeholder;
          innerInput.setAttribute("name", "address");

          // Style inner input to blend seamlessly with Majedaar UI
          innerInput.style.backgroundColor = "#FAF8F5";
          innerInput.style.fontFamily = "inherit";
          innerInput.style.fontSize = "0.875rem";
          innerInput.style.color = "#1c1917";

          // Listen for keyboard typing inside PlaceAutocompleteElement
          innerInput.addEventListener("input", (e) => {
            const currentTypedText = e.target.value;

            if (onChangeRef.current) {
              onChangeRef.current({ target: { name: "address", value: currentTypedText } });
            }

            setGeocodingFailedNotice(false);

            // Typing clears old coordinates and resets serviceability until a new suggestion is selected
            if (isLocationVerifiedRef.current && onClearLocationRef.current) {
              onClearLocationRef.current();
            }
            if (setServiceabilityRef.current) {
              setServiceabilityRef.current(null);
            }
          });
        }
      };

      setTimeout(setupShadowInput, 50);
      setTimeout(setupShadowInput, 250);
    } catch (initErr) {
      console.warn("[AddressAutocomplete] Could not instantiate PlaceAutocompleteElement:", initErr.message);
      setUseFallbackInput(true);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [mapsLoaded, handleRouteCheck, placeholder]);

  // Keep internal input value synchronized when external value changes
  // (e.g. from current location or address book selection) without interrupting active typing!
  useEffect(() => {
    if (autocompleteElementRef.current?.shadowRoot) {
      const innerInput = autocompleteElementRef.current.shadowRoot.querySelector("input");
      if (
        innerInput &&
        document.activeElement !== innerInput &&
        innerInput.value !== (value || "")
      ) {
        innerInput.value = value || "";
      }
    }
  }, [value]);

  // Handle fallback manual input change
  const handleFallbackChange = (e) => {
    const textVal = e.target.value;
    if (onChangeRef.current) {
      onChangeRef.current({ target: { name: "address", value: textVal } });
    }
    setGeocodingFailedNotice(false);
    if (isLocationVerifiedRef.current && onClearLocationRef.current) {
      onClearLocationRef.current();
    }
    if (setServiceabilityRef.current) {
      setServiceabilityRef.current(null);
    }
  };

  // "Use My Current Location" button handler
  const handleUseCurrentLocation = async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser. Please type your address.");
      return;
    }

    setIsDetectingLocation(true);
    setGeocodingFailedNotice(false);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          let formattedAddress = "";
          let placeId = null;
          let matchedZoneId = null;
          let addressComponents = [];

          // Attempt Google Maps reverse geocoding to obtain a human-readable street address
          try {
            const geocodeResult = await reverseGeocode({ latitude, longitude });
            formattedAddress = geocodeResult.formattedAddress || "";
            placeId = geocodeResult.placeId || null;
            addressComponents = geocodeResult.addressComponents || [];
            matchedZoneId = matchZoneFromAddress(formattedAddress, addressComponents);
          } catch (geoErr) {
            console.warn("[Geolocation] Reverse geocoding failed:", geoErr.message);
          }

          if (formattedAddress) {
            // Human-readable address obtained: populate in address state & input
            if (onChangeRef.current) {
              onChangeRef.current({ target: { name: "address", value: formattedAddress } });
            }
            if (autocompleteElementRef.current?.shadowRoot) {
              const innerInput = autocompleteElementRef.current.shadowRoot.querySelector("input");
              if (innerInput) {
                innerInput.value = formattedAddress;
              }
            }
            setGeocodingFailedNotice(false);
            await handleRouteCheck(
              latitude,
              longitude,
              formattedAddress,
              placeId,
              "current_location",
              matchedZoneId
            );
          } else {
            // Fallback if reverse geocoding returned no text
            setGeocodingFailedNotice(true);
            await handleRouteCheck(
              latitude,
              longitude,
              value || "",
              null,
              "current_location",
              null
            );
            toast.info(
              "GPS coordinates detected. Please confirm your house/street name in the address field.",
              { autoClose: 4000 }
            );
          }
        } catch (err) {
          toast.error("Could not process your current location. Please type your address manually.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        let userMessage = "Unable to retrieve your current location. Please enter your address manually.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            userMessage = "Location permission was denied. Please allow location access or type your address manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            userMessage = "GPS position unavailable. Please type your address manually.";
            break;
          case error.TIMEOUT:
            userMessage = "Location request timed out. Please try again or type your address manually.";
            break;
          default:
            break;
        }

        toast.warn(userMessage, { autoClose: 4000 });
      },
      geoOptions
    );
  };

  const hasApiKey = Boolean(getGoogleMapsApiKey());

  return (
    <div className="space-y-2.5">
      {/* Label and "Use My Current Location" button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="delivery-address-input"
          className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider"
        >
          Delivery Street Address *
        </label>

        <button
          type="button"
          id="btn-use-current-location"
          onClick={handleUseCurrentLocation}
          disabled={disabled || isDetectingLocation}
          title="Detect device GPS location and verify delivery distance"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${isDetectingLocation
            ? "bg-stone-100 text-stone-400 border-stone-200 cursor-wait"
            : "bg-[#E3EFE8] text-[#1B3B2B] border-[#1B3B2B]/20 hover:bg-[#1B3B2B] hover:text-white hover:border-[#1B3B2B] shadow-2xs"
            }`}
        >
          {isDetectingLocation ? (
            <>
              <span className="w-3 h-3 border-2 border-[#1B3B2B] border-t-transparent rounded-full animate-spin" />
              <span>Detecting Location...</span>
            </>
          ) : (
            <>
              <span>Use My Current Location</span>
            </>
          )}
        </button>
      </div>

      {/* Main Address Input: PlaceAutocompleteElement Container or Manual Fallback */}
      <div className="relative">
        {/* Modern Google Places API (New) Web Component mount point */}
        {!useFallbackInput && (
          <div
            ref={containerRef}
            className={`min-h-[44px] w-full rounded-xl transition-all ${isLocationVerified && serviceability?.isEligible
              ? "ring-2 ring-[#16a34a]/30"
              : serviceability?.isEligible === false
                ? "ring-2 ring-rose-400"
                : ""
              }`}
          />
        )}

        {/* Fallback input if PlaceAutocompleteElement is unavailable or Maps API is loading */}
        {useFallbackInput && (
          <input
            ref={fallbackInputRef}
            id="delivery-address-input"
            name="address"
            type="text"
            value={value}
            onChange={handleFallbackChange}
            className={`${inputClass} ${isLocationVerified && serviceability?.isEligible
              ? "border-[#16a34a] focus:border-[#16a34a] focus:ring-[#16a34a]/30 pr-10"
              : serviceability?.isEligible === false
                ? "border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-200"
                : ""
              }`}
            placeholder={placeholder}
            required={required}
            disabled={disabled || isDetectingLocation}
            autoComplete="street-address"
          />
        )}

        {/* Hidden input to ensure native form validation checks address value */}
        <input
          type="hidden"
          name="address_hidden_val"
          value={value || ""}
          required={required}
        />

        {/* Verified location green check badge icon */}
        {isLocationVerified && serviceability?.isEligible && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#16a34a] pointer-events-none z-10"
            title="Location Verified"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Serviceability & Route Distance Status Banner */}
      {serviceability?.loading && (
        <div className="flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 animate-pulse">
          <span className="w-3.5 h-3.5 border-2 border-[#1B3B2B] border-t-transparent rounded-full animate-spin" />
          <span>Calculating driving-route distance from Majedaar Restaurant...</span>
        </div>
      )}

      {/* Eligible location: <= 7 km */}
      {!serviceability?.loading && serviceability?.isEligible && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-emerald-800">
              {location?.source === "current_location"
                ? "✓ Current location detected"
                : "✓ Delivery available"}
            </span>
            <span className="text-emerald-700">·</span>
            <span className="font-medium text-emerald-800">
              Delivery distance: <strong>{serviceability.formattedDistance}</strong>
            </span>
            <span className="text-emerald-700">·</span>
            <span className="font-bold text-[#1B3B2B] bg-white px-2 py-0.5 rounded-full border border-emerald-300">
              Delivery fee: ₹{serviceability.fee}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {location && typeof location.latitude === "number" && (
              <a
                href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C85A17] font-bold hover:underline text-[11px]"
              >
                View on Google Maps ↗
              </a>
            )}
            <button
              type="button"
              onClick={onClearLocation}
              className="text-stone-400 hover:text-stone-600 text-[11px] underline cursor-pointer"
              title="Reset verified location to manual entry"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Ineligible location: > 7 km */}
      {!serviceability?.loading && serviceability?.isEligible === false && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div>
            <p className="font-bold text-rose-900 mb-0.5">Delivery Unavailable (&gt; 7 km)</p>
            <p className="text-[11.5px] text-rose-700">
              {serviceability.error ||
                "Sorry, we currently deliver only within 7 km of our restaurant. Please choose another delivery address."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClearLocation}
            className="self-start sm:self-center px-3 py-1 rounded-lg bg-white border border-rose-300 text-rose-800 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer"
          >
            Change Address
          </button>
        </div>
      )}

      {/* Notice when GPS coordinates were detected but reverse geocoding did not return street address */}
      {geocodingFailedNotice && (
        <div className="text-[11.5px] p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          📍 Device GPS location detected. Please type your building, flat, or street name above to complete your delivery details.
        </div>
      )}

      {/* Helpful developer/setup notice if Google Maps API key is not configured */}
      {!hasApiKey && (
        <div className="text-[11px] p-2 rounded-xl bg-stone-50 border border-dashed border-stone-300 text-stone-500">
          ℹ️ Google Maps suggestions &amp; distance calculation require <code>GOOGLE_MAPS_THREE_API_KEY</code> in <code>frontend/.env</code>. Manual address entry is currently active.
        </div>
      )}
    </div>
  );
}
