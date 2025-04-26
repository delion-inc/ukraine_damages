/**
 * API utilities for making requests to the server
 */

// Mock data for regions summary (damage reports)
const MOCK_REGIONS_SUMMARY = [
  {
    "regionId": "kyivska",
    "regionName": "Київська область",
    "totalDamage": 120000000
  },
  {
    "regionId": "kharkivska",
    "regionName": "Харківська область",
    "totalDamage": 250000000
  },
  {
    "regionId": "odesska",
    "regionName": "Одеська область",
    "totalDamage": 85000000
  },
  {
    "regionId": "dnipropetrovska",
    "regionName": "Дніпропетровська область",
    "totalDamage": 180000000
  },
  {
    "regionId": "zakarpatska",
    "regionName": "Закарпатська область",
    "totalDamage": 30000000
  },
  {
    "regionId": "lvivska",
    "regionName": "Львівська область",
    "totalDamage": 45000000
  },
  {
    "regionId": "chernihivska",
    "regionName": "Чернігівська область",
    "totalDamage": 140000000
  },
  {
    "regionId": "zaporizka",
    "regionName": "Запорізька область",
    "totalDamage": 190000000
  },
  {
    "regionId": "donetska",
    "regionName": "Донецька область",
    "totalDamage": 320000000
  },
  {
    "regionId": "luhanska",
    "regionName": "Луганська область",
    "totalDamage": 280000000
  },
  {
    "regionId": "ivano-frankivska",
    "regionName": "Івано-Франківська область",
    "totalDamage": 40000000
  },
  {
    "regionId": "ternopilska",
    "regionName": "Тернопільська область",
    "totalDamage": 35000000
  },
  {
    "regionId": "vinnytska",
    "regionName": "Вінницька область",
    "totalDamage": 70000000
  },
  {
    "regionId": "mykolaivska",
    "regionName": "Миколаївська область",
    "totalDamage": 160000000
  },
  {
    "regionId": "sumska",
    "regionName": "Сумська область",
    "totalDamage": 130000000
  },
  {
    "regionId": "chernivetska",
    "regionName": "Чернівецька область",
    "totalDamage": 25000000
  },
  {
    "regionId": "khmelnytska",
    "regionName": "Хмельницька область",
    "totalDamage": 55000000
  },
  {
    "regionId": "cherkaska",
    "regionName": "Черкаська область",
    "totalDamage": 60000000
  },
  {
    "regionId": "kirovohradska",
    "regionName": "Кіровоградська область",
    "totalDamage": 50000000
  },
  {
    "regionId": "khersonska",
    "regionName": "Херсонська область",
    "totalDamage": 220000000
  },
  {
    "regionId": "poltavska",
    "regionName": "Полтавська область",
    "totalDamage": 65000000
  },
  {
    "regionId": "rivnenska",
    "regionName": "Рівненська область",
    "totalDamage": 38000000
  },
  {
    "regionId": "volynska",
    "regionName": "Волинська область",
    "totalDamage": 32000000
  },
  {
    "regionId": "zhytomyrska",
    "regionName": "Житомирська область",
    "totalDamage": 75000000
  },
  {
    "regionId": "crimea",
    "regionName": "АР Крим",
    "totalDamage": 170000000
  }
];

export interface RegionSummary {
  regionId: string;
  regionName: string;
  totalDamage: number;
}

/**
 * Get summary of damage reports by region
 */
export async function getRegionsSummary(): Promise<RegionSummary[]> {
  // TODO: When the real API is ready, use this code
  // const response = await fetch('/api/regions/summary');
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch regions summary: ${response.status}`);
  // }
  // return await response.json();
  
  // For now, return mock data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_REGIONS_SUMMARY);
    }, 800); // Simulate network delay
  });
}

/**
 * Отримати тестові дані напряму (для відлагодження)
 */
export function getTestData(): RegionSummary[] {
  console.log('Виклик getTestData');
  return MOCK_REGIONS_SUMMARY;
} 