"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { fallbackUkraineData, fetchUkraineRegions } from "@/utils/ukraineData";
import { getRegionsSummary, RegionSummary } from "@/utils/api";
import DamageReportForm from "@/components/DamageReportForm";
import { AIDamageAssessment } from "@/utils/types";

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
   const [assessment, setAssessment] = useState<AIDamageAssessment | null>(null);

   useEffect(() => {
      const loadData = async () => {
         try {
            setIsLoading(true);

            const mapData = await fetchUkraineRegions();
            setRegionsData(mapData);

            try {
               const regionDamageData = await getRegionsSummary();
               setDamageData(regionDamageData);
            } catch (apiError) {
               console.error("Помилка завантаження даних з API:", apiError);
               setError("Не вдалося завантажити дані про руйнування. Використовуються тестові дані.");
            }

            // Only clear the error if both operations succeeded
            if (!error) {
               setError(null);
            }
         } catch (err) {
            console.error("Помилка завантаження даних карти:", err);
            setRegionsData(fallbackUkraineData);
            setError("Не вдалося завантажити дані. Використовується базова карта.");
         } finally {
            setIsLoading(false);
         }
      };

      loadData();
   }, []);

   const handleAssessmentSuccess = (result: AIDamageAssessment) => {
      setAssessment(result);
      // Можна додати додаткову логіку, наприклад, прокрутку до карти
      window.scrollTo({
         top: document.getElementById('map-container')?.offsetTop,
         behavior: 'smooth'
      });
   };

   return (
      <div className="min-h-screen p-4 md:p-8 pb-20 gap-8 font-[family-name:var(--font-geist-sans)]">
         <main className="max-w-6xl mx-auto">
            <section className="mb-12">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                     <h1 className="text-3xl font-bold mb-2">Система звітування та оцінки пошкоджень</h1>
                     <p className="text-gray-600">
                        Заповніть форму нижче, щоб надіслати звіт про пошкодження та отримати оцінку вартості відновлення.
                     </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                     <Link href="/damage-report" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span>Повний екран форми</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                     </Link>
                  </div>
               </div>
               
               <DamageReportForm onSubmitSuccess={handleAssessmentSuccess} />
            </section>

            <section id="map-container" className="w-full h-full mb-8">
               <h2 className="text-2xl font-bold mb-4">Карта пошкоджень</h2>
               {assessment && (
                  <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg">
                     <h3 className="font-medium text-blue-800">Результат вашої останньої оцінки:</h3>
                     <p className="text-xl font-bold">{assessment.estimatedCost.toLocaleString()} {assessment.currency}</p>
                  </div>
               )}
               
               {error && (
                  <div className="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                     <h3 className="font-medium text-yellow-800">Увага:</h3>
                     <p>{error}</p>
                  </div>
               )}
               
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
            </section>
         </main>
      </div>
   );
}
