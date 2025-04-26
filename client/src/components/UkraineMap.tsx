'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RegionSummary } from '@/utils/api';

enum Region {
  KYIVSKA = "KYIVSKA",
  KHARKIVSKA = "KHARKIVSKA",
  ODESSKA = "ODESSKA",
  DNIPROPETROVSKA = "DNIPROPETROVSKA",
  ZAKARPATSKA = "ZAKARPATSKA",
  LVIVSKA = "LVIVSKA",
  CHERNIHIVSKA = "CHERNIHIVSKA",
  ZAPORIZKA = "ZAPORIZKA",
  DONETSKA = "DONETSKA",
  LUHANSKA = "LUHANSKA",
  IVANO_FRANKIVSKA = "IVANO_FRANKIVSKA",
  TERNOPILSKA = "TERNOPILSKA",
  VINNYTSKA = "VINNYTSKA",
  MYKOLAIVSKA = "MYKOLAIVSKA",
  SUMSKA = "SUMSKA",
  CHERNIVETSKA = "CHERNIVETSKA",
  KHMELNYTSKA = "KHMELNYTSKA",
  CHERKASKA = "CHERKASKA",
  KIROVOHRADSKA = "KIROVOHRADSKA",
  KHERSONSKA = "KHERSONSKA",
  POLTAVSKA = "POLTAVSKA",
  RIVNENSKA = "RIVNENSKA",
  VOLYNSKA = "VOLYNSKA",
  ZHYTOMYRSKA = "ZHYTOMYRSKA",
  CRIMEA = "CRIMEA"
}

interface Place {
  id: number;
  oblast: Region;
  typeOfInfrastructure: string;
  dateOfEvent: string;
  sourceName: string;
  sourceDate: string;
  sourceLink: string;
  additionalSources: string;
  extentOfDamage: string;
  internalFilterDate: string;
}

const mockPlaces: Place[] = [
  {
    id: 1,
    oblast: Region.KYIVSKA,
    typeOfInfrastructure: "Житловий будинок",
    dateOfEvent: "2022-03-01",
    sourceName: "Укрінформ",
    sourceDate: "2022-03-02",
    sourceLink: "https://www.ukrinform.ua/example",
    additionalSources: "BBC News",
    extentOfDamage: "Пошкоджено 70% конструкції",
    internalFilterDate: "2022-03-05"
  },
  {
    id: 2,
    oblast: Region.KYIVSKA,
    typeOfInfrastructure: "Лікарня",
    dateOfEvent: "2022-03-03",
    sourceName: "Reuters",
    sourceDate: "2022-03-03",
    sourceLink: "https://www.reuters.com/example",
    additionalSources: "CNN, Al Jazeera",
    extentOfDamage: "Пошкоджено дах та вікна",
    internalFilterDate: "2022-03-10"
  },
  {
    id: 3,
    oblast: Region.KHARKIVSKA,
    typeOfInfrastructure: "Школа",
    dateOfEvent: "2022-04-05",
    sourceName: "Associated Press",
    sourceDate: "2022-04-06",
    sourceLink: "https://apnews.com/example",
    additionalSources: "The Guardian",
    extentOfDamage: "Повністю зруйнована",
    internalFilterDate: "2022-04-10"
  },
  {
    id: 4,
    oblast: Region.KHARKIVSKA,
    typeOfInfrastructure: "Міст",
    dateOfEvent: "2022-04-07",
    sourceName: "The New York Times",
    sourceDate: "2022-04-08",
    sourceLink: "https://www.nytimes.com/example",
    additionalSources: "",
    extentOfDamage: "Пошкоджено опорні конструкції",
    internalFilterDate: "2022-04-12"
  },
  {
    id: 5,
    oblast: Region.DONETSKA,
    typeOfInfrastructure: "Електростанція",
    dateOfEvent: "2022-05-10",
    sourceName: "DW",
    sourceDate: "2022-05-11",
    sourceLink: "https://www.dw.com/example",
    additionalSources: "Reuters",
    extentOfDamage: "Значні пошкодження обладнання",
    internalFilterDate: "2022-05-15"
  },
  {
    id: 6,
    oblast: Region.DONETSKA,
    typeOfInfrastructure: "Житловий комплекс",
    dateOfEvent: "2022-05-12",
    sourceName: "BBC",
    sourceDate: "2022-05-13",
    sourceLink: "https://www.bbc.com/example",
    additionalSources: "",
    extentOfDamage: "Зруйновано 3 будинки із 5",
    internalFilterDate: "2022-05-20"
  },
  {
    id: 7,
    oblast: Region.ODESSKA,
    typeOfInfrastructure: "Порт",
    dateOfEvent: "2022-06-20",
    sourceName: "The Guardian",
    sourceDate: "2022-06-21",
    sourceLink: "https://www.theguardian.com/example",
    additionalSources: "CNN",
    extentOfDamage: "Пошкоджено складські приміщення",
    internalFilterDate: "2022-06-25"
  },
  {
    id: 8,
    oblast: Region.MYKOLAIVSKA,
    typeOfInfrastructure: "Адміністративна будівля",
    dateOfEvent: "2022-07-15",
    sourceName: "Reuters",
    sourceDate: "2022-07-16",
    sourceLink: "https://www.reuters.com/example2",
    additionalSources: "",
    extentOfDamage: "Часткове руйнування",
    internalFilterDate: "2022-07-20"
  },
  {
    id: 9,
    oblast: Region.ZAPORIZKA,
    typeOfInfrastructure: "Водопостачання",
    dateOfEvent: "2022-08-10",
    sourceName: "Associated Press",
    sourceDate: "2022-08-12",
    sourceLink: "https://apnews.com/example2",
    additionalSources: "Укрінформ",
    extentOfDamage: "Пошкоджено насосну станцію",
    internalFilterDate: "2022-08-15"
  },
  {
    id: 10,
    oblast: Region.SUMSKA,
    typeOfInfrastructure: "Міст",
    dateOfEvent: "2022-09-05",
    sourceName: "CNN",
    sourceDate: "2022-09-06",
    sourceLink: "https://www.cnn.com/example",
    additionalSources: "",
    extentOfDamage: "Значні структурні пошкодження",
    internalFilterDate: "2022-09-10"
  }
];

const getPlacesByRegion = (regionId: string): Place[] => {
  const regionMap: Record<string, Region> = {
    'kyivska': Region.KYIVSKA,
    'kharkivska': Region.KHARKIVSKA,
    'odesska': Region.ODESSKA,
    'dnipropetrovska': Region.DNIPROPETROVSKA,
    'zakarpatska': Region.ZAKARPATSKA,
    'lvivska': Region.LVIVSKA,
    'chernihivska': Region.CHERNIHIVSKA,
    'zaporizka': Region.ZAPORIZKA,
    'donetska': Region.DONETSKA,
    'luhanska': Region.LUHANSKA,
    'ivano-frankivska': Region.IVANO_FRANKIVSKA,
    'ternopilska': Region.TERNOPILSKA,
    'vinnytska': Region.VINNYTSKA,
    'mykolaivska': Region.MYKOLAIVSKA,
    'sumska': Region.SUMSKA,
    'chernivetska': Region.CHERNIVETSKA,
    'khmelnytska': Region.KHMELNYTSKA,
    'cherkaska': Region.CHERKASKA,
    'kirovohradska': Region.KIROVOHRADSKA,
    'khersonska': Region.KHERSONSKA,
    'poltavska': Region.POLTAVSKA,
    'rivnenska': Region.RIVNENSKA,
    'volynska': Region.VOLYNSKA,
    'zhytomyrska': Region.ZHYTOMYRSKA,
    'crimea': Region.CRIMEA
  };

  const region = regionMap[regionId];
  return region ? mockPlaces.filter(place => place.oblast === region) : [];
};

declare global {
  interface Window {
    __loggedRegions?: Record<string, boolean>;
    __matchedRegions?: Record<string, boolean>;
  }
}

interface UkraineMapProps {
  geoJsonData?: GeoJSON.FeatureCollection;
  damageData?: RegionSummary[];
}

interface ExtendedPath extends L.Path {
  feature?: GeoJSON.Feature;
}

interface IconDefaultPrototype {
  _getIconUrl?: unknown;
}

export default function UkraineMap({ geoJsonData, damageData }: UkraineMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null); // Used to fetch places data
  const [selectedDamage, setSelectedDamage] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [regionPlaces, setRegionPlaces] = useState<Place[]>([]);
  
  const { minDamage, maxDamage } = useMemo(() => {
    if (!damageData || damageData.length === 0) {
      return { minDamage: 0, maxDamage: 0 };
    }
    
    let min = Infinity;
    let max = -Infinity;
    
    damageData.forEach(region => {
      if (region.totalDamage < min) min = region.totalDamage;
      if (region.totalDamage > max) max = region.totalDamage;
    });
    
    return { minDamage: min, maxDamage: max };
  }, [damageData]);

  useEffect(() => {
    const iconDefault = L.Icon.Default.prototype as IconDefaultPrototype;
    delete iconDefault._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }, []);

  const position: [number, number] = [49.0275, 31.4828];
  
  const bounds: L.LatLngBoundsExpression = [
    [44.0, 22.0],
    [52.5, 40.5]
  ];
  
  const mapStyle = {
    height: '600px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#e6f2ff'
  };
  
  const getRegionName = useCallback((feature?: GeoJSON.Feature): string => {
    if (!feature?.properties) return '';
    
    return (
      feature.properties.name || 
      feature.properties.NAME_1 || 
      feature.properties.Name || 
      feature.properties.NAME || 
      ''
    );
  }, []);

  const getRegionId = useCallback((feature?: GeoJSON.Feature): string => {
    if (!feature?.properties) return '';

    const name = getRegionName(feature);
    
    const regionMap: Record<string, string> = {
      'Київська область': 'kyivska',
      'Київська': 'kyivska',
      'Харківська область': 'kharkivska',
      'Харківська': 'kharkivska',
      'Одеська область': 'odesska',
      'Одеська': 'odesska',
      'Дніпропетровська область': 'dnipropetrovska',
      'Дніпропетровська': 'dnipropetrovska',
      'Закарпатська область': 'zakarpatska',
      'Закарпатська': 'zakarpatska',
      'Львівська область': 'lvivska',
      'Львівська': 'lvivska',
      'Чернігівська область': 'chernihivska',
      'Чернігівська': 'chernihivska',
      'Запорізька область': 'zaporizka',
      'Запорізька': 'zaporizka',
      'Донецька область': 'donetska',
      'Донецька': 'donetska',
      'Луганська область': 'luhanska',
      'Луганська': 'luhanska',
      'Івано-Франківська область': 'ivano-frankivska',
      'Івано-Франківська': 'ivano-frankivska',
      'Тернопільська область': 'ternopilska',
      'Тернопільська': 'ternopilska',
      'Вінницька область': 'vinnytska',
      'Вінницька': 'vinnytska',
      'Миколаївська область': 'mykolaivska',
      'Миколаївська': 'mykolaivska',
      'Сумська область': 'sumska',
      'Сумська': 'sumska',
      'Чернівецька область': 'chernivetska',
      'Чернівецька': 'chernivetska',
      'Хмельницька область': 'khmelnytska',
      'Хмельницька': 'khmelnytska',
      'Черкаська область': 'cherkaska',
      'Черкаська': 'cherkaska',
      'Кіровоградська область': 'kirovohradska',
      'Кіровоградська': 'kirovohradska',
      'Херсонська область': 'khersonska',
      'Херсонська': 'khersonska',
      'Полтавська область': 'poltavska',
      'Полтавська': 'poltavska',
      'Рівненська область': 'rivnenska',
      'Рівненська': 'rivnenska',
      'Волинська область': 'volynska',
      'Волинська': 'volynska',
      'Житомирська область': 'zhytomyrska',
      'Житомирська': 'zhytomyrska',
      'АР Крим': 'crimea',
      'Крим': 'crimea',
    };
    
    if (regionMap[name]) {
      return regionMap[name];
    }
    
    for (const [key, value] of Object.entries(regionMap)) {
      if (name.includes(key) || key.includes(name)) {
        return value;
      }
    }
    
    return name
      .toLowerCase()
      .replace(/область|область/gi, '')
      .replace(/\s+/g, '')
      .trim();
  }, [getRegionName]);

  const getRegionDamage = useCallback((feature?: GeoJSON.Feature): number | null => {
    if (!feature?.properties || !damageData) return null;
    
    const regionId = getRegionId(feature);
    const regionName = getRegionName(feature);
    const regionData = damageData.find(r => 
      r.regionId === regionId || 
      r.regionId.includes(regionId) || 
      regionId.includes(r.regionId)
    );
    
    if (regionData) {
      if (!window.__matchedRegions) {
        window.__matchedRegions = {};
      }
      
      if (!window.__matchedRegions[regionName]) {
        window.__matchedRegions[regionName] = true;
      }
    }
    else if (!window.__loggedRegions) {
      window.__loggedRegions = window.__loggedRegions || {};
      if (!window.__loggedRegions[regionName]) {
        window.__loggedRegions[regionName] = true;
      }
    }
    
    return regionData?.totalDamage || null;
  }, [damageData, getRegionId, getRegionName]);

  const getDamageColor = useCallback((damage: number | null): string => {
    if (damage === null) return '#CCCCCC';
    
    if (maxDamage === minDamage) return '#3182CE';
    
    const normalizedValue = (damage - minDamage) / (maxDamage - minDamage);
    
    const colors = [
      [49, 130, 206],
      [67, 65, 144],
      [85, 0, 82],
      [102, 0, 41]
    ];
    
    const getColorPoint = (value: number) => {
      const idx = Math.min(Math.floor(value * (colors.length - 1)), colors.length - 2);
      const t = (value * (colors.length - 1)) - idx;
      
      const r = Math.round(colors[idx][0] * (1 - t) + colors[idx + 1][0] * t);
      const g = Math.round(colors[idx][1] * (1 - t) + colors[idx + 1][1] * t);
      const b = Math.round(colors[idx][2] * (1 - t) + colors[idx + 1][2] * t);
      
      return `rgb(${r}, ${g}, ${b})`;
    };
    
    return getColorPoint(normalizedValue);
  }, [minDamage, maxDamage]);
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('uk-UA').format(num);
  };


  const onEachFeature = useCallback((feature: GeoJSON.Feature, layer: L.Layer) => {
    const regionName = getRegionName(feature);
    const damage = getRegionDamage(feature);
    
    if (regionName) {
      const popupContent = damage !== null 
        ? `<div class="font-bold text-lg">${regionName}</div>
           <div class="text-md">Сума збитків: ${formatNumber(damage)} грн</div>`
        : `<div class="font-bold text-lg">${regionName}</div>
           <div class="text-md">Немає даних про збитки</div>`;
      
      layer.bindPopup(popupContent);
      
      const tooltipLayer = layer as L.Path;
      tooltipLayer.bindTooltip(regionName, {
        permanent: true,
        direction: 'center',
        className: 'region-label'
      });
    }
    
    layer.on({
      mouseover: (e: L.LeafletEvent) => {
        const layer = e.target as L.Path;
        layer.setStyle({
          weight: 3,
          color: '#333',
          dashArray: '',
          fillOpacity: 0.7
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
              fillOpacity: 0.7
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
          const damage = getRegionDamage(path.feature);
          const regionId = getRegionId(path.feature);
          
          if (regionName) {
            setSelectedRegion(regionName);
            setSelectedDamage(damage);
            setSelectedRegionId(regionId);
            
            const places = getPlacesByRegion(regionId);
            setRegionPlaces(places);
            setSidebarOpen(true);
            
            const layer = e.target as L.Path;
            layer.setStyle({
              weight: 3,
              color: '#333',
              dashArray: '',
              fillOpacity: 0.7
            });
          }
        }
      }
    });
  }, [getRegionName, geoJsonData, selectedRegion, getRegionDamage, getRegionId]);
  
  const regionStyle = useCallback((feature?: GeoJSON.Feature) => {
    const regionName = getRegionName(feature);
    const damage = getRegionDamage(feature);
    const isSelected = regionName === selectedRegion;
    const fillColor = getDamageColor(damage);
    
    return {
      fillColor: isSelected ? '#ff7800' : fillColor,
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#333' : '#666',
      dashArray: isSelected ? '' : '3',
      fillOpacity: isSelected ? 0.7 : 0.65
    };
  }, [getRegionName, selectedRegion, getDamageColor, getRegionDamage]);

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

  const MapBoundaries = () => {
    const map = useMap();
    
    useEffect(() => {
      map.setMaxBounds(bounds);
      map.setMinZoom(6);
      
      const checkBounds = () => {
        if (!map.getBounds().intersects(bounds)) {
          map.panInsideBounds(bounds, { animate: true });
        }
      };
      
      map.on('drag', checkBounds);
      map.on('zoomend', checkBounds);
      
      return () => {
        map.off('drag', checkBounds);
        map.off('zoomend', checkBounds);
      };
    }, [map]);
    
    return null;
  };

  const MapLegend = () => {
    return (
      <div className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded-md shadow-md border border-gray-200">
        <h3 className="text-sm font-bold mb-2 text-gray-800">Сума збитків</h3>
        <div className="w-80 h-5 bg-gradient-to-r from-[#3182CE] via-[#5541A2] to-[#660029] rounded"></div>
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <div>{formatNumber(minDamage)} грн</div>
          <div>{formatNumber(maxDamage)} грн</div>
        </div>
        {selectedRegion && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold">{selectedRegion}</p>
            {selectedDamage !== null ? (
              <p className="text-xs">{formatNumber(selectedDamage)} грн</p>
            ) : (
              <p className="text-xs">Немає даних</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const Sidebar = () => {
    if (!sidebarOpen) return null;
    
    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-[2000] overflow-y-auto transition-all duration-300 transform translate-x-0">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">{selectedRegion}</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          {selectedDamage !== null && (
            <div className="mb-4 p-3 bg-gray-100 rounded-md">
              <p className="text-sm">Загальна сума збитків:</p>
              <p className="text-lg font-bold">{formatNumber(selectedDamage)} грн</p>
            </div>
          )}
          
          <h3 className="text-lg font-semibold mb-3">Пошкоджені об&apos;єкти</h3>
          
          {regionPlaces.length === 0 ? (
            <p className="text-gray-500 italic">Немає даних про пошкоджені об&apos;єкти</p>
          ) : (
            <div className="space-y-4">
              {regionPlaces.map(place => (
                <div key={place.id} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{place.typeOfInfrastructure}</h4>
                    <span className="text-sm text-gray-500">{formatDate(place.dateOfEvent)}</span>
                  </div>
                  <p className="text-sm mt-1 mb-2">{place.extentOfDamage}</p>
                  <div className="text-xs text-gray-500">
                    <p>Джерело: {place.sourceName}</p>
                    {place.sourceLink && (
                      <a 
                        href={place.sourceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Посилання
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <MapContainer 
        center={position} 
        zoom={6} 
        style={mapStyle} 
        scrollWheelZoom={true}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={6}
        zoomControl={true}
      >
        {geoJsonLayer}
        <MapBoundaries />
        <MapLegend />
      </MapContainer>
      <Sidebar />
      <style jsx global>{`
        .region-label {
          background-color: transparent;
          border: none;
          box-shadow: none;
          font-weight: semi-bold;
          font-size: 11px;
          color: #fff;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
} 