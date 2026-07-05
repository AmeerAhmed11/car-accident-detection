import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useCurrentFrame, delayRender, continueRender, interpolate } from 'remotion';
import 'leaflet/dist/leaflet.css';

// ── Real Baghdad GPS Coordinates ──────────────────────────────
const CAM_COORDS: Record<string, [number, number]> = {
  '01': [33.2847, 44.3744],
  '02': [33.2750, 44.3770],
  '03': [33.2900, 44.3850],
  '04': [33.2810, 44.3450],
};

const OPS_CENTER: [number, number] = CAM_COORDS['02'];
const INCIDENT_SITE: [number, number] = CAM_COORDS['03'];
const MEDICAL_CITY: [number, number] = [33.3500, 44.3800];

const customMarkerIcon = (color: string) =>
  L.divIcon({
    className: `custom-marker`,
    html: `<div style="width: 14px; height: 14px; background-color: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

function MapController({ markers, onMapReady }: { markers: [number, number][], onMapReady: () => void }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (markers.length > 0) {
        const bounds = L.latLngBounds(markers);
        map.fitBounds(bounds, { padding: [160, 160] });
      }
      onMapReady(); // signal that map is loaded
    }, 500);

    return () => clearTimeout(timer);
  }, [map, markers, onMapReady]);

  return null;
}

async function fetchOSRMRoute(start: [number, number], end: [number, number]): Promise<[number, number][]> {
  const url = `http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      // GeoJSON coordinates are [lon, lat], Leaflet needs [lat, lon]
      const mapped = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
      return [start, ...mapped, end];
    }
  } catch (err) {
    console.error("OSRM Fetch Error:", err);
  }
  // Fallback to straight line if API fails
  return [start, end];
}

function AnimatedRouteLabel({ routeCoords, text, delayFrame, color }: { routeCoords: [number, number][], text: string, delayFrame: number, color: string }) {
  const map = useMap();
  const frame = useCurrentFrame();

  if (routeCoords.length === 0) return null;

  // Find the exact middle coordinate of the route to point to
  const midPoint = routeCoords[Math.floor(routeCoords.length / 2)];
  const point = map.latLngToContainerPoint(midPoint);

  // Fade in starts at delayFrame and takes 15 frames
  const opacity = interpolate(frame, [delayFrame, delayFrame + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const yOffset = interpolate(frame, [delayFrame, delayFrame + 15], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (opacity === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      left: point.x,
      top: point.y,
      zIndex: 1000,
      opacity,
      transform: `translate(20px, calc(-50% + ${yOffset}px))`,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
    }}>
      <svg width="40" height="10" style={{ marginRight: '10px', overflow: 'visible' }}>
        <line x1="0" y1="5" x2="40" y2="5" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="0" cy="5" r="3" fill={color} />
      </svg>
      <div style={{
        background: 'rgba(11, 15, 25, 0.9)',
        border: `2px solid ${color}`,
        padding: '12px 20px',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        boxShadow: `0 0 20px ${color}80`,
        whiteSpace: 'nowrap',
      }}>
        {text}
      </div>
    </div>
  );
}

interface TacticalMapProps {
  animationStartFrame?: number;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({ animationStartFrame = 290 }) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender());

  const [mapReady, setMapReady] = useState(false);
  const [route1Coords, setRoute1Coords] = useState<[number, number][]>([]);
  const [route2Coords, setRoute2Coords] = useState<[number, number][]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadRoutes() {
      const r1 = await fetchOSRMRoute(OPS_CENTER, INCIDENT_SITE);
      const r2 = await fetchOSRMRoute(INCIDENT_SITE, MEDICAL_CITY);
      if (mounted) {
        setRoute1Coords(r1);
        setRoute2Coords(r2);
      }
    }
    loadRoutes();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (mapReady && route1Coords.length > 0 && route2Coords.length > 0) {
      continueRender(handle);
    }
  }, [mapReady, route1Coords, route2Coords, handle]);

  // Determine how many coordinates to draw based on frame interpolation
  const route1Progress = interpolate(frame, [animationStartFrame, animationStartFrame + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const route2Progress = interpolate(frame, [animationStartFrame + 40, animationStartFrame + 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const currentRoute1 = route1Coords.slice(0, Math.max(1, Math.floor(route1Progress * route1Coords.length)));
  const currentRoute2 = route2Coords.slice(0, Math.max(1, Math.floor(route2Progress * route2Coords.length)));

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <style>
        {`
          .leaflet-container {
            background: #0B0F19 !important;
          }
        `}
      </style>
      <MapContainer
        center={INCIDENT_SITE}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {/* Draw the sliced route polylines deterministically */}
        {route1Progress > 0 && (
          <Polyline positions={currentRoute1} pathOptions={{ color: '#00e676', weight: 4, opacity: 0.9 }} />
        )}
        {route2Progress > 0 && (
          <Polyline positions={currentRoute2} pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.9 }} />
        )}

        <Marker position={OPS_CENTER} icon={customMarkerIcon('#00e676')} />
        <Marker position={INCIDENT_SITE} icon={customMarkerIcon('#ef4444')} />
        <Marker position={MEDICAL_CITY} icon={customMarkerIcon('#3b82f6')} />

        <AnimatedRouteLabel
          routeCoords={route1Coords}
          text="ROUTE: OPERATIONAL CENTER TO ACCIDENT LOCATION"
          delayFrame={animationStartFrame + 40}
          color="#00e676"
        />

        <AnimatedRouteLabel
          routeCoords={route2Coords}
          text="ROUTE: ACCIDENT LOCATION TO NEAREST HOSPITAL"
          delayFrame={animationStartFrame + 80}
          color="#3b82f6"
        />

        <MapController markers={[OPS_CENTER, INCIDENT_SITE, MEDICAL_CITY]} onMapReady={() => setMapReady(true)} />
      </MapContainer>
    </div>
  );
};


