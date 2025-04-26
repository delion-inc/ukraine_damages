import { NextResponse } from 'next/server';

/**
 * GET handler for proxying requests to fetch places by region ID
 */
export async function GET(request, context) {
  const { regionId } = context.params;

  if (!regionId) {
    return NextResponse.json(
      { error: 'Region ID is required' },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `http://93.127.131.80:8080/api/v1/places/${regionId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data from API: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching places for region ${regionId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
} 