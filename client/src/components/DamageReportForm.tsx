'use client';

import { useState, useRef } from 'react';
import { ObjectType, DamageReportFormData, AIDamageAssessment } from '@/utils/types';
import { submitDamageReport } from '@/utils/mockApi';

interface DamageReportFormProps {
  onSubmitSuccess?: (assessment: AIDamageAssessment) => void;
}

export default function DamageReportForm({ onSubmitSuccess }: DamageReportFormProps) {
  const [formData, setFormData] = useState<DamageReportFormData>({
    objectType: ObjectType.RESIDENTIAL,
  });
  
  const [photoBeforeName, setPhotoBeforeName] = useState<string>('');
  const [photoAfterName, setPhotoAfterName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<AIDamageAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const photoBeforeRef = useRef<HTMLInputElement>(null);
  const photoAfterRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (['areaSizeSqM', 'floors', 'constructionYear'].includes(name)) {
      const numValue = value === '' ? undefined : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photoBefore: e.target.files?.[0] }));
      setPhotoBeforeName(e.target.files[0].name);
    }
  };

  const handlePhotoAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photoAfter: e.target.files?.[0] }));
      setPhotoAfterName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const result = await submitDamageReport(formData);
      setAssessment(result);
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
    } catch (err) {
      setError('Помилка при відправці форми. Спробуйте ще раз.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ objectType: ObjectType.RESIDENTIAL });
    setPhotoBeforeName('');
    setPhotoAfterName('');
    setAssessment(null);
    setError(null);
    
    // Reset file inputs
    if (photoBeforeRef.current) photoBeforeRef.current.value = '';
    if (photoAfterRef.current) photoAfterRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Відправити звіт про пошкодження</h2>
      
      {assessment ? (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold mb-2">Результат оцінки</h3>
            <p className="text-3xl font-bold mb-4">{assessment.estimatedCost.toLocaleString()} {assessment.currency}</p>
            
            <div className="mb-4">
              <p className="text-sm mb-1">Рівень впевненості: {assessment.confidence}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${assessment.confidence}%` }}></div>
              </div>
            </div>
            
            <h4 className="font-medium mb-2">Критерії оцінки:</h4>
            <ul className="space-y-3">
              {assessment.assessmentCriteria.map((criterion, index) => (
                <li key={index} className="border-b border-blue-100 pb-2">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{criterion.name}</span>
                    <span className="text-blue-700">{criterion.impact}%</span>
                  </div>
                  <p className="text-sm text-gray-600">{criterion.description}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            onClick={resetForm}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
          >
            Створити новий звіт
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Photo Before */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фото до пошкодження
              </label>
              <div className="relative border border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  ref={photoBeforeRef}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePhotoBeforeChange}
                />
                {photoBeforeName ? (
                  <p className="text-sm text-gray-800 truncate">{photoBeforeName}</p>
                ) : (
                  <>
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">Клікніть для завантаження фото</p>
                  </>
                )}
              </div>
            </div>
            
            {/* Photo After */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фото після пошкодження <span className="text-red-500">*</span>
              </label>
              <div className="relative border border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  ref={photoAfterRef}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePhotoAfterChange}
                  required
                />
                {photoAfterName ? (
                  <p className="text-sm text-gray-800 truncate">{photoAfterName}</p>
                ) : (
                  <>
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">Клікніть для завантаження фото</p>
                  </>
                )}
              </div>
            </div>

            {/* Object Type */}
            <div className="col-span-1">
              <label htmlFor="objectType" className="block text-sm font-medium text-gray-700 mb-1">
                Тип об'єкту <span className="text-red-500">*</span>
              </label>
              <select
                id="objectType"
                name="objectType"
                value={formData.objectType}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={ObjectType.RESIDENTIAL}>Житловий будинок</option>
                <option value={ObjectType.COMMERCIAL}>Комерційна будівля</option>
                <option value={ObjectType.INFRASTRUCTURE}>Інфраструктура</option>
                <option value={ObjectType.EDUCATIONAL}>Навчальний заклад</option>
                <option value={ObjectType.HEALTHCARE}>Медичний заклад</option>
                <option value={ObjectType.CULTURAL}>Культурна споруда</option>
                <option value={ObjectType.INDUSTRIAL}>Промислова будівля</option>
                <option value={ObjectType.OTHER}>Інше</option>
              </select>
            </div>

            {/* Area Size */}
            <div className="col-span-1">
              <label htmlFor="areaSizeSqM" className="block text-sm font-medium text-gray-700 mb-1">
                Площа (м²)
              </label>
              <input
                type="number"
                id="areaSizeSqM"
                name="areaSizeSqM"
                min="1"
                value={formData.areaSizeSqM || ''}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Floors */}
            <div className="col-span-1">
              <label htmlFor="floors" className="block text-sm font-medium text-gray-700 mb-1">
                Кількість поверхів
              </label>
              <input
                type="number"
                id="floors"
                name="floors"
                min="1"
                value={formData.floors || ''}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Construction Year */}
            <div className="col-span-1">
              <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700 mb-1">
                Рік будівництва
              </label>
              <input
                type="number"
                id="constructionYear"
                name="constructionYear"
                min="1800"
                max="2024"
                value={formData.constructionYear || ''}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Адреса
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Опис пошкоджень
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Обробка...
                </div>
              ) : (
                'Відправити на оцінку'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 