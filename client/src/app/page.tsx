"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fallbackUkraineData, fetchUkraineRegions } from "@/utils/ukraineData";
import { getRegionsSummary, RegionSummary } from "@/utils/api";

const UkraineMap = dynamic(() => import("@/components/UkraineMap"), {
   ssr: false,
   loading: () => (
      <div className="h-[600px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
         <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Завантаження карти...</p>
         </div>
      </div>
   ),
});

export default function Home() {
   const [regionsData, setRegionsData] = useState<GeoJSON.FeatureCollection | undefined>(undefined);
   const [damageData, setDamageData] = useState<RegionSummary[] | undefined>(undefined);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const loadData = async () => {
         try {
            setIsLoading(true);

            const mapData = await fetchUkraineRegions();
            setRegionsData(mapData);

            const regionDamageData = await getRegionsSummary();
            setDamageData(regionDamageData);

            setError(null);
         } catch (err) {
            console.error("Помилка завантаження даних:", err);
            setRegionsData(fallbackUkraineData);
            setError("Не вдалося завантажити дані. Використовується базова карта.");
         } finally {
            setIsLoading(false);
         }
      };

      loadData();
   }, []);

   return (
      <div className="min-h-screen p-4 md:p-8 pb-20 gap-8 font-[family-name:var(--font-geist-sans)]">
         <header className="mb-8 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-blue-800">Карта пошкоджень регіонів України</h1>
            <p className="text-gray-600 text-lg">
               Інтерактивна карта збитків регіонів України внаслідок військової агресії. Натисніть на область, щоб побачити детальну інформацію.
            </p>
            {error && <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">⚠️ {error}</div>}
         </header>

         <main className="max-w-6xl mx-auto">
            <div className="w-full h-full mb-8">
               {isLoading ? (
                  <div className="h-[600px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                     <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-lg">Завантаження даних...</p>
                     </div>
                  </div>
               ) : regionsData && Object.keys(regionsData).length > 0 ? (
                  <UkraineMap geoJsonData={regionsData} damageData={damageData} />
               ) : (
                  <div className="h-[600px] w-full bg-red-50 rounded-lg flex items-center justify-center">
                     <div className="text-center text-red-500">
                        <p className="text-lg font-bold">Помилка завантаження даних карти</p>
                        <p className="mt-2">Спробуйте оновити сторінку</p>
                     </div>
                  </div>
               )}
            </div>
         </main>
      </div>
   );
}
