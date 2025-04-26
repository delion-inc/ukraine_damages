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

// Base API URL
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
 * Get detailed place data for a specific region
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