'use client';

import { useState } from 'react';

interface POICategory {
  id: string;
  name: string;
  icon: string;
}

interface SidebarProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory: string | null;
}

const categories: POICategory[] = [
  { id: 'aed', name: 'AED', icon: '❤️' },
  { id: 'toilet', name: 'Toilets', icon: '🚻' },
  { id: 'bench', name: 'Benches', icon: '🪑' },
  { id: 'cafe', name: 'Cafes', icon: '☕' },
  { id: 'library', name: 'Libraries', icon: '📚' },
  { id: 'parking', name: 'Parking', icon: '🅿️' },
];

export default function Sidebar({ onCategorySelect, selectedCategory }: SidebarProps) {
  return (
    <div className="w-64 bg-white h-full p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">UWA Facilities</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategorySelect(category.id)}
            className={`w-full p-3 rounded-lg flex items-center gap-2 transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 