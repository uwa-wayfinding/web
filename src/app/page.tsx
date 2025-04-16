'use client';

import { useState } from 'react';
import MapComponent from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import { IMDFData } from '@/types/imdf';

// UWA POIs with building and level information
const uwaPOIs = [
  {
    id: 'aed1',
    name: 'AED - Reid Library',
    coordinates: [115.8167, -31.9805] as [number, number],
    description: 'Located near the main entrance',
    category: 'aed',
    building: 'Reid Library',
    level: '0'
  },
  {
    id: 'aed2',
    name: 'AED - Science Library',
    coordinates: [115.8187, -31.9815] as [number, number],
    description: 'Ground floor, near reception',
    category: 'aed',
    building: 'Science Library',
    level: '0'
  },
  {
    id: 'toilet1',
    name: 'Toilets - Reid Library',
    coordinates: [115.8165, -31.9803] as [number, number],
    description: 'Ground floor, near the main entrance',
    category: 'toilet',
    building: 'Reid Library',
    level: '0'
  },
  {
    id: 'toilet2',
    name: 'Toilets - Science Library',
    coordinates: [115.8185, -31.9813] as [number, number],
    description: 'Ground floor, near the study area',
    category: 'toilet',
    building: 'Science Library',
    level: '0'
  },
  {
    id: 'bench1',
    name: 'Bench - Oak Lawn',
    coordinates: [115.8170, -31.9800] as [number, number],
    description: 'Under the oak tree',
    category: 'bench'
  },
  {
    id: 'bench2',
    name: 'Bench - Sunken Garden',
    coordinates: [115.8150, -31.9790] as [number, number],
    description: 'Near the fountain',
    category: 'bench'
  },
  {
    id: 'cafe1',
    name: 'Café - Reid Library',
    coordinates: [115.8168, -31.9804] as [number, number],
    description: 'Ground floor, serves coffee and snacks',
    category: 'cafe'
  },
  {
    id: 'library1',
    name: 'Reid Library',
    coordinates: [115.8167, -31.9805] as [number, number],
    description: 'Main library with study spaces and resources',
    category: 'library'
  },
  {
    id: 'library2',
    name: 'Science Library',
    coordinates: [115.8187, -31.9815] as [number, number],
    description: 'Specialized science and engineering resources',
    category: 'library'
  },
  {
    id: 'parking1',
    name: 'Parking - Reid Library',
    coordinates: [115.8157, -31.9807] as [number, number],
    description: 'Multi-level parking facility',
    category: 'parking'
  }
];

// Sample IMDF data (you'll need to replace this with actual IMDF data)
const sampleIMDFData: IMDFData = {
  buildings: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [115.8160, -31.9800],
            [115.8170, -31.9800],
            [115.8170, -31.9810],
            [115.8160, -31.9810],
            [115.8160, -31.9800]
          ]]
        },
        properties: {
          name: 'Reid Library'
        }
      }
    ]
  },
  units: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [115.8162, -31.9802],
            [115.8168, -31.9802],
            [115.8168, -31.9808],
            [115.8162, -31.9808],
            [115.8162, -31.9802]
          ]]
        },
        properties: {
          name: 'Main Hall',
          level: '0'
        }
      }
    ]
  },
  openings: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [115.8165, -31.9802],
            [115.8165, -31.9800]
          ]
        },
        properties: {
          level: '0'
        }
      }
    ]
  },
  levels: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [115.8160, -31.9800],
            [115.8170, -31.9800],
            [115.8170, -31.9810],
            [115.8160, -31.9810],
            [115.8160, -31.9800]
          ]]
        },
        properties: {
          level: '0',
          name: 'Ground Floor'
        }
      }
    ]
  }
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>('0');

  return (
    <main className="min-h-screen">
      <div className="flex h-screen">
        <div className="flex flex-col">
          <Sidebar 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <div className="p-4 bg-white border-t">
            <h3 className="font-bold mb-2">Select Level</h3>
            <select 
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="0">Ground Floor</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
            </select>
          </div>
        </div>
        <div className="flex-1 h-full">
          <MapComponent 
            pois={uwaPOIs}
            selectedCategory={selectedCategory}
            imdfData={sampleIMDFData}
          />
        </div>
      </div>
    </main>
  );
}
