import { GeoJSON } from 'leaflet';

/**
 * Fetches GeoJSON data for Ukraine's regions
 */
export async function fetchUkraineRegions(): Promise<GeoJSON.FeatureCollection> {
  try {
    // Using detailed GeoJSON data with accurate region boundaries
    const response = await fetch('/data/ukraine_regions.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Ukraine regions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Ukraine regions:', error);
    return fallbackUkraineData;
  }
}

/**
 * Basic fallback data with just a simple polygon for Ukraine
 * This is used if fetching the detailed regions fails
 */
export const fallbackUkraineData: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Україна'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [22.1357201, 52.3799717],
            [40.2184941, 52.3799717],
            [40.2184941, 44.386463],
            [22.1357201, 44.386463],
            [22.1357201, 52.3799717]
          ]
        ]
      }
    }
  ]
}; 