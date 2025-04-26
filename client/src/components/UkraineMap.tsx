'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RegionSummary, PlaceData, getPaginatedRegionPlaces } from '@/utils/api';

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
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedDamage, setSelectedDamage] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [regionPlaces, setRegionPlaces] = useState<PlaceData[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState<boolean>(false);
  const [placesError, setPlacesError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const PAGE_SIZE = 10;
  
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

  useEffect(() => {
    if (selectedRegionId) {
      setCurrentPage(0);
      setRegionPlaces([]);
      setHasMorePages(true);
    }
  }, [selectedRegionId]);

  useEffect(() => {
    const fetchPlacesData = async () => {
      if (!selectedRegionId) return;
      
      setIsLoadingPlaces(true);
      setPlacesError(null);
      
      try {
        const paginatedData = await getPaginatedRegionPlaces(selectedRegionId, 0, PAGE_SIZE);
        
        setRegionPlaces(paginatedData.content);
        setCurrentPage(0);
        
        setHasMorePages(paginatedData.pageNumber < paginatedData.totalPages - 1);
        
      } catch (error) {
        console.error(`Error fetching places for region ${selectedRegionId}:`, error);
        setPlacesError('Failed to load places data');
        setRegionPlaces([]);
        setHasMorePages(false);
      } finally {
        setIsLoadingPlaces(false);
      }
    };
    
    if (selectedRegionId) {
      fetchPlacesData();
    }
  }, [selectedRegionId]);

  const loadMorePlaces = async () => {
    if (!selectedRegionId || isLoadingMore || !hasMorePages) return;
    
    setIsLoadingMore(true);
    
    try {
      const nextPage = currentPage + 1;
      
      const paginatedData = await getPaginatedRegionPlaces(
        selectedRegionId, 
        nextPage, 
        PAGE_SIZE
      );
      
      if (paginatedData.content.length > 0) {
        const newContent = paginatedData.content;
        
        const existingIds = new Set(regionPlaces.map(place => place.id));
        const uniqueNewItems = newContent.filter(item => !existingIds.has(item.id));
        
        
        if (uniqueNewItems.length > 0) {
          setRegionPlaces(prevPlaces => [...prevPlaces, ...uniqueNewItems]);
          
          setCurrentPage(nextPage);
          
          setHasMorePages(paginatedData.pageNumber < paginatedData.totalPages - 1);
        } else {
          setHasMorePages(false);
        }
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error(`Error fetching more places for region ${selectedRegionId}:`, error);
      setPlacesError('Failed to load more places');
    } finally {
      setIsLoadingMore(false);
    }
  };

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
      'Одеська область': 'odeska',
      'Одеська': 'odeska',
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
      'Івано-Франківська область': 'ivano_frankivska',
      'Івано-Франківська': 'ivano_frankivska',
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
    if (!num) return '0';
    return new Intl.NumberFormat('uk-UA').format(num);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getExtentOfDamage = (extentOfDamage: string): string => {
    const damageMap: Record<string, string> = {
      'Partially damaged': 'Частково пошкоджено',
      'Destroyed': 'Повністю зруйновано'
    };
    
    return damageMap[extentOfDamage] || extentOfDamage;
  };

  const getInfrastructureLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      'WAREHOUSE': 'Склад',
      'AIRCRAFT_REPAIR_PLANT': 'Авіаремонтний завод',
      'BRIDGE': 'Міст',
      'OIL_DEPOT': 'Нафтобаза',
      'GOVERNMENT_FACILITIES': 'Державні установи',
      'FUEL_DEPOT': 'Паливний склад',
      'EDUCATION_FACILITY': 'Освітній заклад (школа тощо)',
      'RELIGIOUS_FACILITIES': 'Релігійні споруди',
      'AIRPORT': 'Аеропорт',
      'HEALTH_FACILITY': 'Медичний заклад (лікарня, клініка)',
      'INDUSTRIAL_BUSINESS_ENTERPRISE': 'Промислові/Бізнес об\'єкти',
      'TELECOMMUNICATIONS': 'Телекомунікації',
      'CHEMICAL_STORAGE_UNIT': 'Сховище хімічних речовин',
      'ELECTRICITY_SUPPLY_SYSTEM': 'Система електропостачання',
      'NUCLEAR_UNIT': 'Ядерний об\'єкт',
      'CULTURAL_FACILITIES': 'Культурні об\'єкти (музей, театр тощо)',
      'RAILWAY': 'Залізниця',
      'GAS_SUPPLY_SYSTEM': 'Система газопостачання',
      'WATER_SUPPLY_SYSTEM': 'Система водопостачання',
      'POWER_PLANT': 'Електростанція',
      'HARBOR': 'Порт',
      'ROAD_HIGHWAY': 'Дорога / Автомагістраль',
      'AGRICULTURAL_FACILITIES': 'Сільськогосподарські об\'єкти',
      'HEATING_AND_WATER_FACILITY': 'Об\'єкт тепло- та водопостачання',
      'RESIDENTIAL': 'Житлова будівля',
      'COMMERCIAL': 'Комерційна будівля',
      'INDUSTRIAL': 'Промисловий об\'єкт',
      'INFRASTRUCTURE': 'Інфраструктура',
      'OTHER': 'Інше'
    };
    
    return typeMap[type] || type;
  };

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
        <h3 className="text-sm font-bold mb-2 text-gray-800">Кількість пошкоджень</h3>
        <div className="w-80 h-5 bg-gradient-to-r from-[#3182CE] via-[#5541A2] to-[#660029] rounded"></div>
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <div>{minDamage}</div>
          <div>{maxDamage}</div>
        </div>
        {selectedRegion && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold">{selectedRegion}</p>
            {selectedDamage !== null ? (
              <p className="text-xs">Кількість пошкоджень: {selectedDamage}</p>
            ) : (
              <p className="text-xs">Немає даних</p>
            )}
          </div>
        )}
      </div>
    );
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
              <p className="text-sm">Кількість пошкоджених об&apos;єктів:</p>
              <p className="text-lg font-bold">{selectedDamage}</p>
            </div>
          )}
          
          <h3 className="text-lg font-semibold mb-3">Пошкоджені об&apos;єкти</h3>
          
          {isLoadingPlaces && regionPlaces.length === 0 ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : placesError && regionPlaces.length === 0 ? (
            <div className="p-3 bg-red-50 text-red-500 rounded-md">
              <p>{placesError}</p>
            </div>
          ) : regionPlaces.length === 0 ? (
            <p className="text-gray-500 italic">Немає даних про пошкоджені об&apos;єкти</p>
          ) : (
            <div>
              <div className="mb-3 text-sm text-gray-500 border-b pb-2">
                {selectedDamage !== null && regionPlaces.length < selectedDamage ? (
                  <p>Показано {regionPlaces.length} із {selectedDamage} об&apos;єктів</p>
                ) : (
                  <p>Показано всі {regionPlaces.length} об&apos;єктів</p>
                )}
              </div>
              <div className="space-y-4">
                {regionPlaces.map(place => (
                  <div key={place.id} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{getInfrastructureLabel(place.typeOfInfrastructure)}</h4>
                      <span className="text-sm text-gray-500">{formatDate(place.dateOfEvent)}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        place.extentOfDamage === 'Destroyed' 
                          ? 'bg-red-100 text-red-800' 
                          : place.extentOfDamage === 'Partially damaged'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getExtentOfDamage(place.extentOfDamage)}
                      </span>
                    </div>
                    {place.amount > 0 && (
                      <p className="text-sm font-semibold mt-2">Збитки: {formatNumber(place.amount)} грн</p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
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
              
              {hasMorePages && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={loadMorePlaces}
                    disabled={isLoadingMore}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      ${isLoadingMore 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Завантаження...
                      </span>
                    ) : 'Завантажити ще'}
                  </button>
                </div>
              )}
              
              {placesError && regionPlaces.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                  <p>{placesError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

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

  const regionStyleRef = useRef(regionStyle);
  useEffect(() => {
    regionStyleRef.current = regionStyle;
  }, [regionStyle]);

  const onEachFeature = useCallback((feature: GeoJSON.Feature, layer: L.Layer) => {
    const regionName = getRegionName(feature);
    const damage = getRegionDamage(feature);
    
    if (regionName) {
      const popupContent = damage !== null 
        ? `<div class="font-bold text-lg">${regionName}</div>
           <div class="text-md">Кількість пошкоджених об&#39;єктів: ${damage}</div>`
        : `<div class="font-bold text-lg">${regionName}</div>
           <div class="text-md">Немає даних про пошкодження</div>`;
      
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
            geoJson.setStyle(regionStyleRef.current(path.feature));
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
        {geoJsonData && (
          <GeoJSON 
            data={geoJsonData} 
            style={regionStyle}
            onEachFeature={onEachFeature}
          />
        )}
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