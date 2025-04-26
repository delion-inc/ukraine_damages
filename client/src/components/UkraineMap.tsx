'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface UkraineMapProps {
  geoJsonData?: GeoJSON.FeatureCollection;
}

// Extended Path interface to include feature property
interface ExtendedPath extends L.Path {
  feature?: GeoJSON.Feature;
}

// Типи для фіксації проблем з Leaflet
interface IconDefaultPrototype {
  _getIconUrl?: unknown;
}

export default function UkraineMap({ geoJsonData }: UkraineMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Fix for default icons in Leaflet with Next.js
  useEffect(() => {
    // Need to cast to correct type to avoid linter errors
    const iconDefault = L.Icon.Default.prototype as IconDefaultPrototype;
    delete iconDefault._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }, []);

  // Center of Ukraine
  const position: [number, number] = [49.0275, 31.4828];
  
  const mapStyle = {
    height: '600px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };
  
  const getRegionName = useCallback((feature?: GeoJSON.Feature): string => {
    if (!feature?.properties) return '';
    
    // The detailed GeoJSON uses NAME_1 field for region names
    return (
      feature.properties.name || 
      feature.properties.NAME_1 || 
      feature.properties.Name || 
      feature.properties.NAME || 
      ''
    );
  }, []);
  
  const onEachFeature = useCallback((feature: GeoJSON.Feature, layer: L.Layer) => {
    const regionName = getRegionName(feature);
    
    if (regionName) {
      layer.bindPopup(`<div class="font-bold text-lg">${regionName}</div>`);
    }
    
    layer.on({
      mouseover: (e: L.LeafletEvent) => {
        const layer = e.target as L.Path;
        layer.setStyle({
          weight: 3,
          color: '#333',
          dashArray: '',
          fillOpacity: 0.7,
          fillColor: '#3388FF'
        });
        layer.bringToFront();
      },
      mouseout: (e: L.LeafletEvent) => {
        if (geoJsonData) {
          const geoJson = e.target as L.Path;
          const path = e.target as ExtendedPath;
          const regionName = getRegionName(path.feature);
          
          if (regionName === selectedRegion) {
            geoJson.setStyle({
              weight: 3,
              color: '#333',
              dashArray: '',
              fillOpacity: 0.7,
              fillColor: '#ff7800'
            });
          } else {
            geoJson.setStyle(regionStyle(path.feature));
          }
        }
      },
      click: (e: L.LeafletEvent) => {
        const path = e.target as ExtendedPath;
        if (path.feature) {
          const regionName = getRegionName(path.feature);
          
          if (regionName) {
            setSelectedRegion(regionName);
            console.log(`Вибрана область: ${regionName}`);
            
            const layer = e.target as L.Path;
            layer.setStyle({
              weight: 3,
              color: '#333',
              dashArray: '',
              fillOpacity: 0.7,
              fillColor: '#ff7800'
            });
          }
        }
      }
    });
  }, [getRegionName, geoJsonData, selectedRegion]);
  
  const regionStyle = useCallback((feature?: GeoJSON.Feature) => {
    const regionName = getRegionName(feature);
    const isSelected = regionName === selectedRegion;
    
    return {
      fillColor: isSelected ? '#ff7800' : '#3388ff',
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#333' : 'white',
      dashArray: isSelected ? '' : '3',
      fillOpacity: isSelected ? 0.7 : 0.5
    };
  }, [getRegionName, selectedRegion]);

  // We need to memoize the GeoJSON component to prevent unnecessary re-renders
  const geoJsonLayer = useMemo(() => {
    if (!geoJsonData) return null;
    
    return (
      <GeoJSON 
        data={geoJsonData} 
        style={regionStyle}
        onEachFeature={onEachFeature}
      />
    );
  }, [geoJsonData, regionStyle, onEachFeature]);

  return (
    <div>
      <MapContainer 
        center={position} 
        zoom={6} 
        style={mapStyle} 
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonLayer}
      </MapContainer>
      {selectedRegion && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="font-bold text-lg">Вибрана область: {selectedRegion}</h3>
          <p className="text-gray-600 mt-1">Натисніть на іншу область, щоб побачити інформацію про неї.</p>
        </div>
      )}
    </div>
  );
} 