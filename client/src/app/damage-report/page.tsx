"use client";

import DamageReportForm from "@/components/DamageReportForm";
import Link from "next/link";

export default function DamageReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8 pb-20 gap-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-3xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 md:mb-6">
            <Link 
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-800 mb-3 sm:mb-0 sm:mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">Повернутися на головну</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold">AI-розрахунок вартості відновлення</h1>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 mb-3 md:mb-0 flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-2">Як це працює?</h2>
                <p className="text-gray-600 mb-3">
                  Заповніть форму нижче та завантажте фото пошкодженого об&apos;єкта. Штучний інтелект проаналізує дані та розрахує вартість відновлення.
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium mr-2">1</div>
                    <span>Фото об&apos;єкта</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium mr-2">2</div>
                    <span>Деталі пошкодження</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium mr-2">3</div>
                    <span>Розрахунок вартості</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DamageReportForm />
        
        <div className="mt-6 md:mt-8 bg-blue-50 p-4 md:p-5 rounded-lg border border-blue-100">
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Примітка
          </h3>
          <p className="text-gray-600 text-sm">
            Результати розрахунку базуються на аналізі наданих даних та фотографій за допомогою штучного інтелекту. 
            Остаточна вартість може відрізнятися в залежності від фактичних умов проведення робіт, ринкових цін на матеріали 
            та трудові витрати в конкретному регіоні.
          </p>
        </div>
      </main>
    </div>
  );
} 