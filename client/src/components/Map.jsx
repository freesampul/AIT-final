import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map({ posts = [], onLocationSelect, userLocation }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(false);

  // Initialize map
  useEffect(() => {
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

    console.log("Mapbox token check:", MAPBOX_TOKEN ? "Token found" : "Token missing");

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "your_mapbox_token_here" || MAPBOX_TOKEN.trim() === "") {
      console.error("Mapbox token is missing or invalid");
      setMapError(true);
      return;
    }

    if (map.current) {
      console.log("Map already initialized");
      return;
    }

    if (!mapContainer.current) {
      console.error("Map container not found");
      return;
    }

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const defaultCenter = userLocation || [-74.0060, 40.7128]; // [lng, lat]
      console.log("Initializing map with center:", defaultCenter);

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: defaultCenter,
        zoom: userLocation ? 12 : 10,
      });

      map.current.on("load", () => {
        console.log("Map loaded successfully");
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Handle map click to set location
      if (onLocationSelect) {
        map.current.on("click", (e) => {
          const { lng, lat } = e.lngLat;
          onLocationSelect({ latitude: lat, longitude: lng });
        });
      }

      map.current.on("error", (e) => {
        console.error("Map error:", e);
        setMapError(true);
      });
    } catch (error) {
      console.error("Failed to initialize map:", error);
      setMapError(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map center when userLocation changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: userLocation,
        zoom: 12,
        duration: 1000,
      });
    }
  }, [userLocation]);

  // Update markers when posts change
  useEffect(() => {
    if (!map.current || mapError) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for posts with coordinates
    posts.forEach((post) => {
      if (post.latitude && post.longitude) {
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#ef4444";
        el.style.border = "3px solid white";
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        const marker = new mapboxgl.Marker(el)
          .setLngLat([post.longitude, post.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="text-black p-2">
                <p class="font-semibold">${post.user?.username || "User"}</p>
                <p class="text-sm">${post.text.substring(0, 50)}${post.text.length > 50 ? "..." : ""}</p>
              </div>`
            )
          )
          .addTo(map.current);

        markersRef.current.push(marker);
      }
    });
  }, [posts, mapError]);

  if (mapError) {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    return (
      <div className="w-full h-full rounded-3xl overflow-hidden border border-neutral-800/50 shadow-2xl bg-neutral-800/30 flex items-center justify-center">
        <div className="text-center p-8">
          <svg className="w-16 h-16 mx-auto mb-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-neutral-400 text-sm mb-2">Map unavailable</p>
          <p className="text-neutral-500 text-xs mb-2">
            {!token ? "VITE_MAPBOX_TOKEN not found in .env" : "Invalid Mapbox token"}
          </p>
          <p className="text-neutral-600 text-xs">
            Check browser console for details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-neutral-800/50 shadow-2xl relative">
      <div ref={mapContainer} className="w-full h-full" />
      {onLocationSelect && (
        <div className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-neutral-700/50 z-10">
          Click map to set location
        </div>
      )}
    </div>
  );
}

