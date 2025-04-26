"use client";

import { useState } from "react";
import Link from "next/link";
import DamageReportForm from "@/components/DamageReportForm";
import { AIDamageAssessment } from "@/utils/types";

export default function DamageReportPage() {
  const [assessment, setAssessment] = useState<AIDamageAssessment | null>(null);

  const handleAssessmentSuccess = (result: AIDamageAssessment) => {
    setAssessment(result);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pb-20 gap-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link href="/" className="text-blue-500 hover:text-blue-700 mr-4">
            &larr; На головну
          </Link>
          <h1 className="text-3xl font-bold">Оцінка вартості відновлення</h1>
        </div>
        
        {assessment && (
          <div className="p-5 bg-green-50 border border-green-200 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-3">Оцінку успішно отримано!</h2>
            <p className="text-3xl font-bold mb-3">{assessment.estimatedCost.toLocaleString()} {assessment.currency}</p>
            <p className="text-sm text-gray-600 mb-2">Рівень впевненості: {assessment.confidence}%</p>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Основні критерії оцінки:</h3>
              <ul className="space-y-2">
                {assessment.assessmentCriteria.map((criterion, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{criterion.name}</span>
                    <span className="font-medium">{criterion.impact}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Форма оцінки пошкоджень</h2>
            <p className="mt-2 text-sm text-gray-600">
              Заповніть форму нижче, щоб отримати оцінку вартості відновлення від нашої
              AI-системи. Завантажте зображення та вкажіть додаткову інформацію для більш точної оцінки.
            </p>
          </div>
          
          <DamageReportForm onSubmitSuccess={handleAssessmentSuccess} />
        </div>
      </main>
    </div>
  );
} 