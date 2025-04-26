/**
 * API utilities for making requests to the server
 */

export interface RegionSummary {
  regionId: string;
  regionName: string;
  totalDamage: number;
}

export interface PlaceData {
  id: number;
  oblast: string;
  oblastName: string;
  typeOfInfrastructure: string;
  dateOfEvent: string;
  sourceName: string;
  sourceDate: string;
  sourceLink: string;
  additionalSources: string;
  extentOfDamage: string;
  internalFilterDate: string;
  amount: number;
}

export interface PaginatedPlaceData {
  content: PlaceData[];
  total: number;
  totalPages: number;
  pageNumber: number;
}

export interface CachedRegionData {
  regionId: string;
  data: PlaceData[];
  timestamp: number;
}

const regionDataCache: Record<string, CachedRegionData> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const API_BASE_URL = '/api/proxy';

/**
 * Get summary of damage reports by region
 */
export async function getRegionsSummary(): Promise<RegionSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/places`);
    if (!response.ok) {
      throw new Error(`Failed to fetch regions summary: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching regions data:', error);
    throw error;
  }
}

/**
 * Get detailed place data for a specific region (legacy method)
 */
export async function getRegionPlaces(regionId: string): Promise<PlaceData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/places/${regionId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch region places: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching places for region ${regionId}:`, error);
    throw error;
  }
}

/**
 * Get paginated place data for a specific region
 */
export async function getPaginatedRegionPlaces(
  regionId: string, 
  page: number = 0, 
  size: number = 10
): Promise<PaginatedPlaceData> {
  try {
    const url = new URL(`${API_BASE_URL}/places/${regionId}`, window.location.origin);
    
    url.searchParams.set('page', page.toString());
    url.searchParams.set('size', size.toString());
    
    url.searchParams.set('_', Date.now().toString());
    
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch paginated region places: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(`Error fetching paginated places for region ${regionId}:`, error);
    throw error;
  }
}

/**
 * Отримати всі дані для регіону і кешувати їх
 */
export async function getAllRegionData(regionId: string): Promise<PlaceData[]> {
  try {
    const now = Date.now();
    if (
      regionDataCache[regionId] && 
      now - regionDataCache[regionId].timestamp < CACHE_TTL
    ) {
      return regionDataCache[regionId].data;
    }
    
    const timestamp = Date.now();
    const url = `${API_BASE_URL}/places/${regionId}?all=true&_=${timestamp}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch all region data: ${response.status}`);
    }
    
    const data = await response.json();
    
    const items: PlaceData[] = Array.isArray(data) ? data : (data.content || []);
    
    regionDataCache[regionId] = {
      regionId,
      data: items,
      timestamp: now
    };
    
    return items;
  } catch (error) {
    console.error(`Error fetching all data for region ${regionId}:`, error);
    throw error;
  }
}

/**
 * Отримати сторінку даних з локального кешу
 */
export async function getPagedRegionData(
  regionId: string,
  page: number = 0,
  pageSize: number = 10
): Promise<PaginatedPlaceData> {
  try {
    const allData = await getAllRegionData(regionId);
    
    const sortedData = [...allData].sort((a, b) => {
      return new Date(b.dateOfEvent).getTime() - new Date(a.dateOfEvent).getTime();
    });
    
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = sortedData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedData.length / pageSize);
    
    return {
      content: pageData,
      total: sortedData.length,
      totalPages: totalPages,
      pageNumber: page
    };
  } catch (error) {
    console.error(`Error getting paged data for region ${regionId}:`, error);
    throw error;
  }
} 