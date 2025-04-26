import { NextRequest, NextResponse } from 'next/server';

/**
 * POST handler for proxying damage report submissions
 */
export async function POST(request: NextRequest) {
  try {
    const apiUrl = 'http://93.127.131.80:8080/api/v1/damage-reports';
    
    const formData = await request.formData();
    
    
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('Received response from backend:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorDetail = '';
      try {
        errorDetail = await response.text();
        console.error('Backend error detail:', errorDetail);
      } catch {
        console.error('Failed to read error response body');
      }
      
      return NextResponse.json(
        { error: `Failed to submit data to API: ${response.status}`, detail: errorDetail },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in damage-reports proxy route:', error);
    return NextResponse.json(
      { error: 'Failed to proxy damage report to API', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 