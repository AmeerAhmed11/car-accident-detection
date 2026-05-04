'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';

// ── Real Baghdad GPS Coordinates ──────────────────────────────
const CAM_COORDS: Record<string, [number, number]> = {
  '01': [33.2847, 44.3744], // Jadriya Bridge
  '02': [33.2750, 44.3770], // University Gate
  '03': [33.2900, 44.3850], // Karrada Intersection (INCIDENT)
  '04': [33.2810, 44.3450], // Al-Mustansiriya Road
};

const OPS_CENTER: [number, number] = CAM_COORDS['02'];       // Near Baghdad University
const INCIDENT_SITE: [number, number] = CAM_COORDS['03'];    // Karrada-Jadriya Int.
const MEDICAL_CITY: [number, number] = [33.3500, 44.3800];   // Medical City Hospital

// ── Custom CSS Pulsing Marker Icons ──────────────────────────
const customMarkerIcon = (className: string) =>
  L.divIcon({
    className: `marker-pulse ${className}`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

// ── Force Leaflet to recalculate dimensions ──────────────────
function MapController({ markers }: { markers: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    // Force invalidateSize on mount AND on every re-render (state change)
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (markers.length > 0) {
        const bounds = L.latLngBounds(markers);
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    }, 200);

    // Also re-invalidate after a longer delay for layout animations to settle
    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [map, markers]);

  return null;
}

// ── Street-Level Routing Controller ──────────────────────────
function RoutingController({ ops, incident, hospital }: { ops: [number, number], incident: [number, number], hospital: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Path A: Amber Deployment Route (Ops -> Site)
    const routingControlA = L.Routing.control({
      plan: L.Routing.plan([
        L.latLng(ops[0], ops[1]),
        L.latLng(incident[0], incident[1])
      ], {
        createMarker: () => false // Hide default routing markers, keep ours
      }),
      lineOptions: {
        styles: [{ color: '#FACC15', weight: 4, dashArray: '15, 10', opacity: 0.8, className: 'route-amber-pulse' }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false, // Hide instruction panel
      addWaypoints: false,
      // @ts-ignore - Leaflet Routing Machine config
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true, // Auto-zooms to fit the path perfectly
      showAlternatives: false,
    }).addTo(map);

    // Path B: Red Evacuation Route (Site -> Hospital)
    const routingControlB = L.Routing.control({
      plan: L.Routing.plan([
        L.latLng(incident[0], incident[1]),
        L.latLng(hospital[0], hospital[1])
      ], {
        createMarker: () => false // Hide default routing markers, keep ours
      }),
      lineOptions: {
        styles: [
          // @ts-ignore - Custom shadow/glow renderer props
          { color: '#EF4444', weight: 5, opacity: 0.9, shadowBlur: 15, shadowColor: 'rgba(239, 68, 68, 0.6)', className: 'route-red-glow' }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false, // Hide instruction panel
      addWaypoints: false,
      // @ts-ignore - Leaflet Routing Machine config
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true, // Auto-zooms to fit the path perfectly
      showAlternatives: false,
    }).addTo(map);

    return () => {
      try {
        if (!map) return;

        // Remove controls from map
        map.removeControl(routingControlA);
        map.removeControl(routingControlB);

        // PREVENT LIFECYCLE CRASH (TypeError: cannot read properties of null (reading removeLayer))
        // Leaflet Routing Machine fires async callbacks that try to access this._map after unmount.
        // We restore the map reference so it gracefully calls removeLayer without throwing null errors.
        // @ts-ignore
        routingControlA._map = map;
        // @ts-ignore
        routingControlB._map = map;
      } catch (e) {
        console.warn('Leaflet routing cleanup bypassed:', e);
      }
    };
  }, [map, ops, incident, hospital]);

  return null;
}

// ── Main Component ───────────────────────────────────────────
const TacticalMap = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '600px' }} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]">
      <MapContainer
        center={INCIDENT_SITE}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* FREE CartoDB Dark Matter Tiles — No API Key Required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* ── Street-Level Routing Paths ── */}
        <RoutingController ops={OPS_CENTER} incident={INCIDENT_SITE} hospital={MEDICAL_CITY} />

        {/* ── Ops Center Marker ── */}
        <Marker position={OPS_CENTER} icon={customMarkerIcon('marker-ops') as L.DivIcon}>
          <Tooltip direction="top" offset={[0, -10]} permanent className="tactical-tooltip">
            [BASE] OPS CENTER
          </Tooltip>
          <Popup closeButton={false}>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
              BAGHDAD OPERATIONS CENTER<br />
              <span style={{ color: '#888', fontSize: '9px' }}>33.2750°N, 44.3770°E</span>
            </div>
          </Popup>
        </Marker>

        {/* ── Accident Site Marker ── */}
        <Marker position={INCIDENT_SITE} icon={customMarkerIcon('marker-incident') as L.DivIcon}>
          <Tooltip direction="top" offset={[0, -10]} permanent className="tactical-tooltip">
            [ACCIDENT] SECTOR_07
          </Tooltip>
          <Popup closeButton={false}>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>
              COLLISION DETECTED<br />
              <span style={{ color: '#888', fontSize: '9px' }}>33.2900°N, 44.3850°E</span>
            </div>
          </Popup>
        </Marker>

        {/* ── Hospital Marker ── */}
        <Marker position={MEDICAL_CITY} icon={customMarkerIcon('marker-hospital') as L.DivIcon}>
          <Tooltip direction="top" offset={[0, -10]} permanent className="tactical-tooltip">
            [HOSPITAL] MEDICAL CITY
          </Tooltip>
          <Popup closeButton={false}>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: '#3b82f6', fontWeight: 'bold' }}>
              MEDICAL CITY HOSPITAL<br />
              <span style={{ color: '#888', fontSize: '9px' }}>33.3500°N, 44.3800°E</span>
            </div>
          </Popup>
        </Marker>

        <MapController markers={[OPS_CENTER, INCIDENT_SITE, MEDICAL_CITY]} />
      </MapContainer>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none leaflet-vignette rounded-2xl z-[1000]" />

      {/* HUD Overlays */}
      <div className="absolute top-4 left-4 z-[1001] space-y-2">
        <div className="px-4 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded text-[9px] font-orbitron text-brand-emerald font-bold tracking-widest uppercase shadow-xl">
          GPS_ENGINE: CARTODB_DARK // ZERO_COST
        </div>
        <div className="px-4 py-1.5 bg-black/80 backdrop-blur-md border border-brand-red/30 rounded text-[9px] font-orbitron text-brand-red font-bold tracking-widest uppercase shadow-xl animate-pulse">
          DIJKSTRA_ROUTE: ACTIVE
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1001] bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-amber-500 rounded" style={{ boxShadow: '0 0 8px #f59e0b' }} />
          <span className="text-[8px] font-orbitron text-zinc-400 uppercase">Deployment (Ops → Site)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-red-500 rounded" style={{ boxShadow: '0 0 8px #ef4444' }} />
          <span className="text-[8px] font-orbitron text-zinc-400 uppercase">Evacuation (Site → Hospital)</span>
        </div>
      </div>
    </div>
  );
};

export default TacticalMap;
