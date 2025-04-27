import { NextResponse } from 'next/server';

/**
 * GET handler for proxying requests to fetch places for a specific region with pagination
 */
export async function GET(request, { params }) {
  try {
    const { regionId } = params;
    const searchParams = request.nextUrl.searchParams;
    
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    
    const apiUrl = new URL(`http://93.127.131.80:8080/api/v1/places/${regionId}`);
    
    apiUrl.searchParams.set('page', page);
    apiUrl.searchParams.set('size', size);
    
    apiUrl.searchParams.set('_', Date.now().toString());
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache'
      },
      next: { revalidate: 0 },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch data from API: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    
    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error('Error in proxy route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
} 