export default function Map({ posts = [] }) {
  // Default location (NYC area - can be updated with user location later)
  const defaultLat = 40.7128;
  const defaultLng = -74.0060;

  // Google Maps embed URL using place mode (works without API key for basic maps)
  // This is a simple embed that doesn't require authentication
  const mapUrl = `https://www.google.com/maps?q=${defaultLat},${defaultLng}&output=embed`;

  // TODO: Add markers for posts with locations
  // This will be implemented when we connect post locations to the map

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-neutral-800/50 shadow-2xl">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Map"
      />
    </div>
  );
}

