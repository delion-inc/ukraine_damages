"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
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

// Динамічний імпорт графіка із затримкою завантаження для оптимізації
const DamageBarChart = dynamic(() => import("@/components/DamageBarChart"), {
   ssr: false,
   loading: () => (
      <div className="h-[400px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
         <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Завантаження графіку...</p>
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
            setError(null);

            const mapData = await fetchUkraineRegions();
            setRegionsData(mapData);

            try {
               const regionDamageData = await getRegionsSummary();
               setDamageData(regionDamageData);
            } catch (apiError) {
               console.error("Помилка завантаження даних з API:", apiError);
               setError("Не вдалося завантажити дані про руйнування. Перевірте підключення до API.");
            }
         } catch (err) {
            console.error("Помилка завантаження даних карти:", err);
            setRegionsData(fallbackUkraineData);
            setError("Не вдалося завантажити дані карти. Використовується базова карта.");
         } finally {
            setIsLoading(false);
         }
      };

      loadData();
   }, []);

   return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-[family-name:var(--font-geist-sans)]">
         <div className="bg-blue-600 text-white py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
               <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                     <h1 className="text-4xl md:text-5xl font-bold mb-4">AI-оцінка вартості відновлення</h1>
                     <p className="text-xl opacity-90 mb-6">
                        Завантажте фото пошкодженого об&apos;єкту та отримайте миттєву оцінку вартості відновлення, 
                        розраховану штучним інтелектом.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/damage-report" className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg shadow-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-colors text-center">
                           <span>Розрахувати вартість</span>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                           </svg>
                        </Link>
                        <a href="#map-container" className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white font-medium rounded-lg border border-blue-500 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-colors text-center">
                           Переглянути карту пошкоджень
                        </a>
                     </div>
                  </div>
                  <div className="hidden md:flex justify-end">
                     <div className="bg-blue-500 rounded-lg p-6 max-w-md">
                        <div className="flex items-center mb-4">
                           <div className="rounded-full bg-white p-2 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                           </div>
                           <h3 className="text-xl font-bold">Швидкий розрахунок</h3>
                        </div>
                        <ul className="space-y-3">
                           <li className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>Завантажте фото пошкодженого об&apos;єкту</span>
                           </li>
                           <li className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>Вкажіть дані про пошкоджений об&apos;єкт</span>
                           </li>
                           <li className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>Отримайте точну AI-оцінку вартості відновлення</span>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <main className="max-w-6xl mx-auto p-4 md:p-8">
            <section className="mb-12 md:mb-16">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-4">
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                     <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2">Точні розрахунки</h3>
                     <p className="text-gray-600">
                        Штучний інтелект аналізує пошкодження та розраховує точну вартість відновлення на основі ринкових даних.
                     </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                     <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2">Швидкий результат</h3>
                     <p className="text-gray-600">
                        Отримайте детальну оцінку вартості відновлення протягом декількох секунд, без очікування на експертів.
                     </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                     <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2">Надійна оцінка</h3>
                     <p className="text-gray-600">
                        Детальний звіт включає розбивку за категоріями витрат, що допомагає в плануванні бюджету відновлення.
                     </p>
                  </div>
               </div>
            </section>

            <section id="map-container" className="w-full h-full mb-12 md:mb-16 scroll-mt-16">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                     <h2 className="text-3xl font-bold mb-2">Карта пошкоджень України</h2>
                     <p className="text-gray-600">
                        Інтерактивна карта відображає статистику пошкоджень інфраструктури в регіонах України.
                     </p>
                  </div>
               </div>
               
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
                  <div className="rounded-xl overflow-hidden shadow-lg">
                     <UkraineMap geoJsonData={regionsData} damageData={damageData} />
                  </div>
               ) : (
                  <div className="h-[600px] w-full bg-red-50 rounded-lg flex items-center justify-center">
                     <div className="text-center text-red-500">
                        <p className="text-lg font-bold">Помилка завантаження даних карти</p>
                        <p className="mt-2">Спробуйте оновити сторінку</p>
                     </div>
                  </div>
               )}
            </section>
            
            {/* Нова секція з графіком загальної статистики пошкоджень */}
            <section id="damage-statistics" className="w-full h-full mb-12 md:mb-16 scroll-mt-16">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                     <h2 className="text-3xl font-bold mb-2">Статистика пошкоджень</h2>
                     <p className="text-gray-600">
                        Аналіз фінансових втрат за категоріями пошкодженої інфраструктури
                     </p>
                  </div>
               </div>
               
               <DamageBarChart />
            </section>
            
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 md:p-8 rounded-xl text-center mb-12 md:mb-16">
               <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Отримайте оцінку вже зараз</h2>
               <p className="text-lg md:text-xl mb-5 md:mb-6 max-w-3xl mx-auto">
                  Завантажте фото пошкодженого об&apos;єкта та отримайте детальний розрахунок вартості відновлення 
                  за допомогою нашого штучного інтелекту.
               </p>
               <Link href="/damage-report" className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-white text-blue-700 font-medium rounded-lg shadow-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-colors text-base md:text-lg">
                  Розрахувати вартість відновлення
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
               </Link>
            </section>
         </main>
         
         <footer className="bg-gray-100 py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto text-center text-gray-600">
               <p>© 2024 AI-оцінка пошкоджень. Всі права захищено.</p>
            </div>
         </footer>
      </div>
   );
}
