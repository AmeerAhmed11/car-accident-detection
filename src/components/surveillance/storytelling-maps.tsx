'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const DARK_MATTER_NOLABELS = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
const DARK_MATTER_LABELS = 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png';

// ── Custom Pulsing Marker Icons ──
const customMarkerIcon = (className: string) =>
  L.divIcon({
    className: `marker-pulse ${className}`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `<div style="width: 100%; height: 100%; background: #ef4444; border-radius: 50%; box-shadow: 0 0 15px #ef4444; border: 2px solid white;"></div>`
  });

// ── Custom DivIcons for Scene 4 ──
const createGlowingIcon = (color: string, label: string, isHospital: boolean = false) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; items: center; transform: translate(-50%, -50%);">
      <div style="width: ${isHospital ? '24px' : '32px'}; height: ${isHospital ? '24px' : '32px'}; background-color: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 15px ${color}; display: flex; justify-content: center; align-items: center; margin: 0 auto;">
        ${isHospital ? '<div style="color: white; font-weight: bold; font-size: 14px;">H</div>' : '<div style="color: white; font-weight: bold; font-size: 16px;">!</div>'}
      </div>
      <div style="margin-top: 4px; background: rgba(15,23,42,0.8); backdrop-filter: blur(4px); padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}; color: white; font-size: 10px; font-family: monospace; white-space: nowrap; text-align: center;">
        ${label}
      </div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});

// ── Scene 1 Data (Heatmap) ──
const CAM_COORDS: Record<string, [number, number]> = {
  '01': [33.2847, 44.3744],
  '02': [33.2750, 44.3770],
  '03': [33.2900, 44.3850],
  '04': [33.2810, 44.3450],
};

const MapController = ({ markers }: { markers: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers);
      map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 2 });
    }
  }, [map, markers]);

  // Create a custom pane for labels so they always render ON TOP of the heat arteries
  useEffect(() => {
    if (map && !map.getPane('labelsPane')) {
      const labelsPane = map.createPane('labelsPane');
      labelsPane.style.zIndex = '600'; // High z-index to sit above overlays (400)
      labelsPane.style.pointerEvents = 'none';
    }
  }, [map]);

  return null;
};

// ── Scene 1 Routing Controller ──
function Scene1RoutingController() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const controls: L.Routing.Control[] = [];

    // Define 5 major corridors (2 Severe, 3 Moderate)
    const HEAT_ARTERIES = [
      { start: [33.350, 44.398], end: [33.280, 44.398], type: 'severe' }, // North-South
      { start: [33.310, 44.350], end: [33.310, 44.450], type: 'severe' }, // East-West
      { start: [33.340, 44.360], end: [33.290, 44.420], type: 'moderate' }, // Diagonal/Loop
      { start: [33.325, 44.380], end: [33.345, 44.400], type: 'moderate' }, // Alt Diagonal
      { start: [33.295, 44.360], end: [33.280, 44.420], type: 'moderate' }  // South corridor
    ];

    HEAT_ARTERIES.forEach((route) => {
      const color = route.type === 'severe' ? '#FF0000' : '#FFBF00';
      const className = route.type === 'severe' ? 'heat-artery-severe' : 'heat-artery-moderate';
      
      const c = L.Routing.control({
        plan: L.Routing.plan([L.latLng(route.start[0], route.start[1]), L.latLng(route.end[0], route.end[1])], { createMarker: () => false }),
        lineOptions: { styles: [{ color, weight: 45, opacity: 0.7, className }], extendToWaypoints: true, missingRouteTolerance: 0 },
        show: false, addWaypoints: false, fitSelectedRoutes: false, showAlternatives: false,
      } as any).addTo(map);
      controls.push(c);
    });

    return () => {
      try {
        if (!map) return;
        controls.forEach(c => {
          map.removeControl(c);
          // PREVENT LIFECYCLE CRASH
          // @ts-ignore
          c._map = map;
        });
      } catch (e) {
        console.warn('Scene 1 routing cleanup bypassed:', e);
      }
    };
  }, [map]);

  return null;
}

export const Scene1Map = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-pane { z-index: 0 !important; }
        .leaflet-labelsPane-pane { z-index: 600 !important; }
        
        .marker-pulse { animation: heatPulse 1.5s infinite alternate ease-in-out; }
        @keyframes heatPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 1; }
        }

        .heat-artery-severe {
          stroke-linecap: round;
          filter: blur(12px) drop-shadow(0 0 20px #FF0000);
          animation: heatThrobFast 1.2s infinite alternate ease-in-out;
        }
        .heat-artery-moderate {
          stroke-linecap: round;
          filter: blur(12px) drop-shadow(0 0 20px #FFBF00);
          animation: heatThrobSlow 2.5s infinite alternate ease-in-out;
        }

        @keyframes heatThrobFast {
          0% { stroke-width: 35px; opacity: 0.5; }
          100% { stroke-width: 50px; opacity: 0.8; filter: blur(16px) drop-shadow(0 0 35px #FF0000); }
        }
        @keyframes heatThrobSlow {
          0% { stroke-width: 35px; opacity: 0.5; }
          100% { stroke-width: 45px; opacity: 0.7; filter: blur(16px) drop-shadow(0 0 25px #FFBF00); }
        }
      `}} />
      <MapContainer 
        center={[33.2800, 44.3700]} 
        zoom={13} 
        zoomControl={false} 
        attributionControl={false}
        className="w-full h-full"
        style={{ height: '100%', width: '100%', position: 'absolute', inset: 0, zIndex: 0 }}
      >
        {/* Base Map (No Labels) */}
        <TileLayer url={DARK_MATTER_NOLABELS} />
        
        <MapController markers={Object.values(CAM_COORDS)} />
        
        {/* Generates the thick, pulsing road-following polylines */}
        <Scene1RoutingController />
        
        {/* Pulsing Markers */}
        {Object.entries(CAM_COORDS).map(([id, coords]) => (
          <Marker key={id} position={coords} icon={customMarkerIcon('marker-heat')} />
        ))}

        {/* Labels Overlay (renders on top of the heat arteries) */}
        <TileLayer url={DARK_MATTER_LABELS} pane="labelsPane" />
      </MapContainer>
    </>
  );
};

// ── Scene 4 Data ──
const OPS_CENTER: [number, number] = [33.329, 44.418]; // Tahrir Square
const ACCIDENT_SITE: [number, number] = [33.335, 44.398]; // Near Al-Jumhuriya Bridge
const MEDICAL_CITY: [number, number] = [33.348, 44.385]; // Optimal
const YARMOUK: [number, number] = [33.298, 44.348];
const NAFEES: [number, number] = [33.308, 44.428];
const KINDI: [number, number] = [33.338, 44.430];
const ZAYED: [number, number] = [33.318, 44.408];

function StorytellingRoutingController() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const controls: L.Routing.Control[] = [];

    // Path 1: Ops to Site
    const dispatchControl = L.Routing.control({
      plan: L.Routing.plan([L.latLng(OPS_CENTER[0], OPS_CENTER[1]), L.latLng(ACCIDENT_SITE[0], ACCIDENT_SITE[1])], { createMarker: () => false }),
      lineOptions: { styles: [{ color: '#94a3b8', weight: 4, className: 'route-ops' }], extendToWaypoints: true, missingRouteTolerance: 0 },
      show: false, addWaypoints: false, fitSelectedRoutes: false, showAlternatives: false,
    } as any).addTo(map);
    controls.push(dispatchControl);

    // Path 2: Site to Best Hospital
    const optimalControl = L.Routing.control({
      plan: L.Routing.plan([L.latLng(ACCIDENT_SITE[0], ACCIDENT_SITE[1]), L.latLng(MEDICAL_CITY[0], MEDICAL_CITY[1])], { createMarker: () => false }),
      lineOptions: { styles: [{ color: '#94a3b8', weight: 4, className: 'route-optimal' }], extendToWaypoints: true, missingRouteTolerance: 0 },
      show: false, addWaypoints: false, fitSelectedRoutes: false, showAlternatives: false,
    } as any).addTo(map);
    controls.push(optimalControl);

    // Other 4 Alternative Paths
    [YARMOUK, NAFEES, KINDI, ZAYED].forEach((hosp) => {
      const altControl = L.Routing.control({
        plan: L.Routing.plan([L.latLng(ACCIDENT_SITE[0], ACCIDENT_SITE[1]), L.latLng(hosp[0], hosp[1])], { createMarker: () => false }),
        lineOptions: { styles: [{ color: '#94a3b8', weight: 3, className: 'route-alt' }], extendToWaypoints: true, missingRouteTolerance: 0 },
        show: false, addWaypoints: false, fitSelectedRoutes: false, showAlternatives: false,
      } as any).addTo(map);
      controls.push(altControl);
    });

    return () => {
      try {
        if (!map) return;
        controls.forEach(c => {
          map.removeControl(c);
          // PREVENT LIFECYCLE CRASH
          // @ts-ignore
          c._map = map;
        });
      } catch (e) {
        console.warn('Leaflet routing cleanup bypassed:', e);
      }
    };
  }, [map]);

  return null;
}

export const Scene4Map = () => {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Phase 1: 0 - 3s (Drawing)
    // Phase 2: 3 - 4.5s (Flashing compute)
    const t1 = setTimeout(() => setPhase(2), 3000); 
    // Phase 3: 4.5s+ (Dissolve and Highlight)
    const t2 = setTimeout(() => setPhase(3), 4500); 
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const accidentIcon = useMemo(() => createGlowingIcon('#ef4444', 'Accident Site'), []);
  const opsIcon = useMemo(() => createGlowingIcon('#3b82f6', 'Ops Center'), []);
  const optimalHospIcon = useMemo(() => createGlowingIcon('#22c55e', 'Medical City', true), []);
  const normalHospIcon = useMemo(() => createGlowingIcon('#06b6d4', 'Hospital', true), []);

  const allPoints = [OPS_CENTER, ACCIDENT_SITE, MEDICAL_CITY, YARMOUK, NAFEES, KINDI, ZAYED];

  return (
    <div className={`w-full h-full phase-${phase}`}>
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-pane { z-index: 0 !important; }
        
        .leaflet-overlay-pane path {
          transition: stroke 0.5s ease, opacity 0.5s ease, stroke-width 0.5s ease, filter 0.5s ease;
        }

        /* PHASE 1: Initial Plotting */
        .phase-1 .route-optimal, .phase-1 .route-alt, .phase-1 .route-ops {
          stroke: #94a3b8 !important; /* cyan-grey */
          opacity: 0.8 !important;
          stroke-dasharray: 20, 20;
          animation: drawPath 1s linear infinite;
        }

        /* PHASE 2: Comparison Flashing */
        .phase-2 .route-optimal, .phase-2 .route-alt, .phase-2 .route-ops {
          stroke: #22d3ee !important; /* active computing color */
          animation: flashCompute 0.3s ease-in-out infinite; /* rapid pulse */
        }

        /* PHASE 3: Dissolve and Highlight Winner */
        .phase-3 .route-alt {
          opacity: 0 !important;
        }

        .phase-3 .route-optimal {
          stroke: #4ade80 !important; /* Neon Green */
          stroke-width: 6px !important;
          opacity: 1 !important;
          filter: drop-shadow(0 0 12px rgba(74, 222, 128, 0.8));
        }

        .phase-3 .route-ops {
          stroke: #4ade80 !important; /* Green connection to Ops */
          stroke-width: 4px !important;
          opacity: 1 !important;
          filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5));
          stroke-dasharray: 10, 10;
          animation: flowPath 1.5s linear infinite;
        }

        @keyframes flashCompute {
          0%, 100% { opacity: 0.9; stroke-width: 5px; }
          50% { opacity: 0.3; stroke-width: 2px; }
        }

        @keyframes drawPath {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes flowPath {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
      `}} />
      <MapContainer 
        center={ACCIDENT_SITE} 
        zoom={13} 
        zoomControl={false} 
        attributionControl={false}
        className="w-full h-full"
        style={{ height: '100%', width: '100%', position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <TileLayer url={DARK_MATTER_NOLABELS} />
        <MapController markers={allPoints} />
        
        <StorytellingRoutingController />

        {/* Markers */}
        <Marker position={OPS_CENTER} icon={opsIcon} />
        <Marker position={ACCIDENT_SITE} icon={accidentIcon} />
        <Marker position={MEDICAL_CITY} icon={optimalHospIcon} />
        <Marker position={YARMOUK} icon={normalHospIcon} />
        <Marker position={NAFEES} icon={normalHospIcon} />
        <Marker position={KINDI} icon={normalHospIcon} />
        <Marker position={ZAYED} icon={normalHospIcon} />

        <TileLayer url={DARK_MATTER_LABELS} pane="labelsPane" />
      </MapContainer>
    </div>
  );
};
