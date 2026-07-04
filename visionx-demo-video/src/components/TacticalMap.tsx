import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';
import { useCurrentFrame, delayRender, continueRender, interpolate } from 'remotion';

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
        map.fitBounds(bounds, { padding: [60, 60] });
      }
      onMapReady(); // signal that map is loaded
    }, 500);

    return () => clearTimeout(timer);
  }, [map, markers, onMapReady]);

  return null;
}

function RoutingController({ ops, incident, hospital, onRouteReady }: { ops: [number, number], incident: [number, number], hospital: [number, number], onRouteReady: () => void }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let readyCount = 0;
    const checkReady = () => {
      readyCount++;
      if (readyCount === 2) onRouteReady();
    };

    const routingControlA = L.Routing.control({
      plan: L.Routing.plan([L.latLng(ops[0], ops[1]), L.latLng(incident[0], incident[1])], { createMarker: () => false }),
      lineOptions: { styles: [{ color: '#00e676', weight: 4, opacity: 0.9, className: 'route-segment-1' }], extendToWaypoints: true, missingRouteTolerance: 0 },
      show: false, addWaypoints: false, fitSelectedRoutes: false, showAlternatives: false,
    }).addTo(map);

    const routingControlB = L.Routing.control({
      plan: L.Routing.plan([L.latLng(incident[0], incident[1]), L.latLng(hospital[0], hospital[1])], { createMarker: () => false }),
      lineOptions: { styles: [{ color: '#3b82f6', weight: 4, opacity: 0.9, className: 'route-segment-2' }], extendToWaypoints: true, missingRouteTolerance: 0 },
      show: false, addWaypoints: false, fitSelectedRoutes: false, showAlternatives: false,
    }).addTo(map);

    routingControlA.on('routesfound', checkReady);
    routingControlB.on('routesfound', checkReady);

    return () => {
      try {
        if (!map) return;
        // Prevent async routing callbacks from crashing after unmount
        // @ts-ignore
        if (routingControlA._clearLines) routingControlA._clearLines = () => {};
        // @ts-ignore
        if (routingControlB._clearLines) routingControlB._clearLines = () => {};
        
        map.removeControl(routingControlA);
        map.removeControl(routingControlB);
      } catch (e) {}
    };
  }, [map, ops, incident, hospital, onRouteReady]);

  return null;
}

const TacticalMap = () => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender());

  const [mapReady, setMapReady] = useState(false);
  const [routeReady, setRouteReady] = useState(false);

  useEffect(() => {
    if (mapReady && routeReady) {
      continueRender(handle);
    }
  }, [mapReady, routeReady, handle]);

  // Animate the routes drawing in:
  // Route 1 (Green) draws from frame 290 to 330
  // Route 2 (Blue) draws from frame 330 to 370
  // Note: Since this is mounted when map appears, the local frame for the map is actually `frame` from the root.
  // The path length is roughly 2000.
  const route1Draw = interpolate(frame, [290, 330], [2000, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const route2Draw = interpolate(frame, [330, 370], [2000, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <style>
        {`
          .route-segment-1 {
            stroke-dasharray: 2000;
            stroke-dashoffset: ${route1Draw};
            transition: stroke-dashoffset 0.1s linear;
          }
          .route-segment-2 {
            stroke-dasharray: 2000;
            stroke-dashoffset: ${route2Draw};
            transition: stroke-dashoffset 0.1s linear;
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
        
        <RoutingController ops={OPS_CENTER} incident={INCIDENT_SITE} hospital={MEDICAL_CITY} onRouteReady={() => setRouteReady(true)} />
        
        <Marker position={OPS_CENTER} icon={customMarkerIcon('#00e676')} />
        <Marker position={INCIDENT_SITE} icon={customMarkerIcon('#ef4444')} />
        <Marker position={MEDICAL_CITY} icon={customMarkerIcon('#3b82f6')} />
        
        <MapController markers={[OPS_CENTER, INCIDENT_SITE, MEDICAL_CITY]} onMapReady={() => setMapReady(true)} />
      </MapContainer>
    </div>
  );
};

export default TacticalMap;
