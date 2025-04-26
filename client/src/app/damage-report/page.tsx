"use client";

import Link from "next/link";
// import DamageReportForm from "@/components/DamageReportForm";

export default function DamageReportPage() {
  // Just display a static message
  
  return (
    <div className="min-h-screen p-4 md:p-8 pb-20 gap-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link href="/" className="text-blue-500 hover:text-blue-700 mr-4">
            &larr; На головну
          </Link>
          <h1 className="text-3xl font-bold">Оцінка вартості відновлення</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Форма оцінки пошкоджень</h2>
            <p className="mt-2 text-sm text-gray-600">
              Форма тимчасово недоступна. Будь ласка, перевірте пізніше.
            </p>
          </div>
          
          {/* Form component has been removed temporarily */}
          <div className="p-6">
            <p className="text-center text-gray-500 py-8">
              Функціональність оцінки пошкоджень в розробці. Будь ласка, поверніться пізніше.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 