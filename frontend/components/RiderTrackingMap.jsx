"use client";

import { useEffect, useRef, useState } from "react";
import { getGoogleMapsApiKey, loadGoogleMaps } from "../lib/google-maps";

export default function RiderTrackingMap({ location, destination, className = "" }) {
  const locationLatitude = location?.latitude;
  const locationLongitude = location?.longitude;
  const destinationLatitude = destination?.latitude;
  const destinationLongitude = destination?.longitude;
  const hasRiderLocation = Number.isFinite(locationLatitude) && Number.isFinite(locationLongitude);
  const hasDestination = Number.isFinite(destinationLatitude) && Number.isFinite(destinationLongitude);
  const element = useRef(null);
  const map = useRef(null);
  const directions = useRef(null);
  const markers = useRef(null);
  const [mapError, setMapError] = useState("");
  const [mapUnavailable, setMapUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    if (!hasRiderLocation || !hasDestination || !element.current) return undefined;
    if (!getGoogleMapsApiKey()) {
      setMapError("Live map unavailable: Google Maps is not configured for this app.");
      setMapUnavailable(true);
      return undefined;
    }

    loadGoogleMaps()
      .then((maps) => {
        if (!active || !element.current) return;
        const origin = { lat: locationLatitude, lng: locationLongitude };
        const target = { lat: destinationLatitude, lng: destinationLongitude };
        map.current = map.current || new maps.Map(element.current, {
          center: origin,
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
        if (!markers.current) {
          markers.current = {
            rider: new maps.Marker({ map: map.current, position: origin, title: "Rider" }),
            destination: new maps.Marker({ map: map.current, position: target, title: "Delivery destination" }),
          };
        } else {
          markers.current.rider.setPosition(origin);
          markers.current.destination.setPosition(target);
        }
        setMapUnavailable(false);
        if (!directions.current) {
          directions.current = new maps.DirectionsRenderer({
            map: map.current,
            suppressMarkers: false,
            preserveViewport: false,
          });
        }
        new maps.DirectionsService().route({
          origin,
          destination: target,
          travelMode: maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (!active) return;
          if (status === "OK" && result) {
            directions.current.setDirections(result);
            setMapError("");
          } else {
            setMapError("Road directions are temporarily unavailable.");
          }
        });
      })
      .catch((error) => {
        if (active) {
          setMapUnavailable(true);
          setMapError(error?.message === "GOOGLE_MAPS_API_KEY_MISSING"
            ? "Live map unavailable: Google Maps is not configured for this app."
            : "Unable to load the live map.");
        }
      });

    return () => {
      active = false;
    };
  }, [hasRiderLocation, hasDestination, locationLatitude, locationLongitude, destinationLatitude, destinationLongitude]);

  if (!hasRiderLocation || !hasDestination) {
    return (
      <div className={`rounded-2xl bg-[#F2F7F4] border border-[#1B3B2B]/10 p-4 text-sm text-stone-600 ${className}`}>
        {!hasRiderLocation
          ? "The rider's live location is not available yet. The map will appear when location sharing resumes."
          : "The delivery address does not have map coordinates, so a live route cannot be shown."}
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;

  return (
    <div className={className}>
      {mapUnavailable ? (
        <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          {mapError || "Live map is currently unavailable."}
        </div>
      ) : (
        <div ref={element} className="h-56 w-full rounded-2xl border border-stone-200 bg-stone-100 sm:h-72" />
      )}
      {mapError && <p className="mt-2 text-xs text-stone-500">{mapError}</p>}
      <a
        href={directionsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex text-xs font-bold text-[#1B3B2B] underline"
      >
        Open road directions in Google Maps
      </a>
    </div>
  );
}
