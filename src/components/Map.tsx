'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { IMDFData } from '@/types/imdf';

// You'll need to replace this with your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface PointOfInterest {
  id: string;
  name: string;
  coordinates: [number, number];
  description?: string;
  category: string;
  level?: string;
  building?: string;
}

interface MapComponentProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  pois?: PointOfInterest[];
  selectedCategory?: string | null;
  imdfData?: IMDFData;
}

// UWA's approximate center coordinates
const UWA_CENTER: [number, number] = [115.8167, -31.9805];

export default function MapComponent({ 
  initialCenter = UWA_CENTER,
  initialZoom = 16,
  pois = [],
  selectedCategory = null,
  imdfData
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [lng] = useState(initialCenter[0]);
  const [lat] = useState(initialCenter[1]);
  const [zoom] = useState(initialZoom);
  const [currentLevel, setCurrentLevel] = useState<string>('0'); // Default to ground level

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    map.current = mapInstance;

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add IMDF data when the map loads
    mapInstance.on('load', () => {
      if (imdfData) {
        // Add IMDF layers
        addIMDFLayers(mapInstance, imdfData);
      }
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [lng, lat, zoom, imdfData]);

  // Function to add IMDF layers
  const addIMDFLayers = (map: mapboxgl.Map, imdfData: IMDFData) => {
    // Add building outlines
    map.addSource('buildings', {
      type: 'geojson',
      data: imdfData.buildings
    });

    map.addLayer({
      id: 'building-outlines',
      type: 'line',
      source: 'buildings',
      paint: {
        'line-color': '#888',
        'line-width': 2
      }
    });

    // Add unit outlines (rooms, etc.)
    map.addSource('units', {
      type: 'geojson',
      data: imdfData.units
    });

    map.addLayer({
      id: 'unit-outlines',
      type: 'line',
      source: 'units',
      paint: {
        'line-color': '#666',
        'line-width': 1
      },
      filter: ['==', ['get', 'level'], currentLevel]
    });

    // Add unit fills
    map.addLayer({
      id: 'unit-fills',
      type: 'fill',
      source: 'units',
      paint: {
        'fill-color': '#f0f0f0',
        'fill-opacity': 0.5
      },
      filter: ['==', ['get', 'level'], currentLevel]
    });

    // Add openings (doors, etc.)
    map.addSource('openings', {
      type: 'geojson',
      data: imdfData.openings
    });

    map.addLayer({
      id: 'openings',
      type: 'line',
      source: 'openings',
      paint: {
        'line-color': '#000',
        'line-width': 1
      },
      filter: ['==', ['get', 'level'], currentLevel]
    });
  };

  // Update markers when POIs or selected category changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    for (const marker of markers.current) {
      marker.remove();
    }
    markers.current = [];

    // Add new markers
    for (const poi of pois) {
      if (selectedCategory && poi.category !== selectedCategory) continue;
      if (poi.level && poi.level !== currentLevel) continue;

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h3 class="font-bold">${poi.name}</h3>
          ${poi.building ? `<p class="text-sm text-gray-600">Building: ${poi.building}</p>` : ''}
          ${poi.level ? `<p class="text-sm text-gray-600">Level: ${poi.level}</p>` : ''}
          ${poi.description ? `<p>${poi.description}</p>` : ''}
        `);

      const marker = new mapboxgl.Marker({
        color: selectedCategory ? '#3B82F6' : '#EF4444'
      })
        .setLngLat(poi.coordinates)
        .setPopup(popup)
        .addTo(map.current);

      markers.current.push(marker);
    }
  }, [pois, selectedCategory, currentLevel]);

  return (
    <div className="w-full h-[600px]">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
} 