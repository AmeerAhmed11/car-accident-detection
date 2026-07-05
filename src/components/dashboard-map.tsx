'use client';

import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

async function fetchOSRMRoute(start: [number, number], end: [number, number]): Promise<[number, number][]> {
  const url = `http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
    }
  } catch (err) {
    console.error("OSRM Fetch Error:", err);
  }
  return [start, end];
}

function MapController({ markers }: { markers: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (markers.length > 0) {
        const bounds = L.latLngBounds(markers);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [map, markers]);
  return null;
}

export default function DashboardMap({ mode }: { mode: 'normal' | 'alert' }) {
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

  return (
    <div className="absolute inset-0 w-full h-full z-10">
      <style>
        {`
          .leaflet-container {
            background: #0a0a0a !important;
          }
          .route-dash-1 {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: drawLine 2s forwards linear;
          }
          .route-dash-2 {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: drawLine 2s forwards linear 1s; /* delayed */
          }
          @keyframes drawLine {
            to { stroke-dashoffset: 0; }
          }
        `}
      </style>
      <MapContainer
        center={INCIDENT_SITE}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        {mode === 'alert' && route1Coords.length > 0 && (
          <Polyline positions={route1Coords} pathOptions={{ color: '#f59e0b', weight: 4, opacity: 0.8, className: 'route-dash-1' }} />
        )}
        {mode === 'alert' && route2Coords.length > 0 && (
          <Polyline positions={route2Coords} pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.8, className: 'route-dash-2' }} />
        )}

        <Marker position={OPS_CENTER} icon={customMarkerIcon('#00e676')} />
        <Marker position={INCIDENT_SITE} icon={customMarkerIcon('#f59e0b')} />
        {mode === 'alert' && (
           <Marker position={MEDICAL_CITY} icon={customMarkerIcon('#ef4444')} />
        )}

        <MapController markers={mode === 'alert' ? [OPS_CENTER, INCIDENT_SITE, MEDICAL_CITY] : [OPS_CENTER, INCIDENT_SITE]} />
      </MapContainer>
    </div>
  );
}
