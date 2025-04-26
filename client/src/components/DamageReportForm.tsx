'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';

interface DamageReport {
  photoBefore: File | null;
  photoAfter: File | null;
  objectType: string;
  description: string;
  areaSizeSqM: number | '';
  floors: number | '';
  constructionYear: number | '';
  address: string;
}

interface SubmissionResponse {
  id?: number;
  description?: string;
  photoBefore?: string;
  photoAfter?: string;
  infrastructureType?: string; 
  areaSizeSqM?: number;
  floors?: number;
  constructionYear?: number;
  address?: string;
  amount: number;
  additionDescription?: string;
}

export default function DamageReportForm() {
  const [formData, setFormData] = useState<DamageReport>({
    photoBefore: null,
    photoAfter: null,
    objectType: '',
    description: '',
    areaSizeSqM: '',
    floors: '',
    constructionYear: '',
    address: ''
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 3;

  const [photoBeforePreview, setPhotoBeforePreview] = useState<string | null>(null);
  const [photoAfterPreview, setPhotoAfterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [response, setResponse] = useState<SubmissionResponse | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  
  useEffect(() => {
    setSubmitError(null);
  }, [currentStep]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [name]: numberValue }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (files && files.length > 0) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'photoBefore') {
          setPhotoBeforePreview(reader.result as string);
        } else if (name === 'photoAfter') {
          setPhotoAfterPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps));
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.photoAfter) {
        setSubmitError('Будь ласка, додайте фото об&apos;єкта після руйнування');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.objectType) {
        setSubmitError('Будь ласка, оберіть тип об&apos;єкта');
        return false;
      }
      if (!formData.description) {
        setSubmitError('Будь ласка, додайте опис пошкодження');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.address) {
      setSubmitError('Будь ласка, вкажіть адресу об&apos;єкта');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setProcessingStep('Підготовка даних для AI-аналізу...');
    
    try {
      const submitData = new FormData();
      
      if (formData.photoBefore) {
        submitData.append('photoBefore', formData.photoBefore);
      }
      
      if (formData.photoAfter) {
        submitData.append('photoAfter', formData.photoAfter);
      }
      
      submitData.append('infrastructureType', formData.objectType);
      submitData.append('description', formData.description);
      
      if (formData.areaSizeSqM !== '') {
        submitData.append('areaSizeSqM', formData.areaSizeSqM.toString());
      }
      
      if (formData.floors !== '') {
        submitData.append('floors', formData.floors.toString());
      }
      
      if (formData.constructionYear !== '') {
        submitData.append('constructionYear', formData.constructionYear.toString());
      }
      
      submitData.append('address', formData.address);
      
      setProcessingStep('Відправка даних на AI-сервер...');
      
      const response = await fetch('/api/proxy/damage-reports', {
        method: 'POST',
        body: submitData,
      });

      setProcessingStep('AI аналізує пошкодження та розраховує вартість...');
      
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${responseText}`);
      }

      setProcessingStep('Формування детального звіту про вартість відновлення...');
      
      const responseData = JSON.parse(responseText);
      setResponse(responseData);
      setSubmitSuccess(true);
      
      setFormData({
        photoBefore: null,
        photoAfter: null,
        objectType: '',
        description: '',
        areaSizeSqM: '',
        floors: '',
        constructionYear: '',
        address: ''
      });
      setPhotoBeforePreview(null);
      setPhotoAfterPreview(null);
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Сталася помилка при розрахунку вартості відновлення. Спробуйте пізніше.');
    } finally {
      setIsSubmitting(false);
      setProcessingStep('');
    }
  };
  
  const renderFileUpload = (
    id: string, 
    name: string, 
    label: string, 
    preview: string | null, 
    required: boolean
  ) => (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      
      <div 
        className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer"
        onClick={() => document.getElementById(id)?.click()}
      >
        <input
          type="file"
          id={id}
          name={name}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          required={required}
        />
        
        {!preview ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-center text-sm text-gray-500">
              Натисніть для вибору фото або перетягніть файл сюди
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG або GIF файли. Максимальний розмір: 5 MB.
            </p>
          </>
        ) : (
          <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-200">
            <Image
              src={preview}
              alt={`Попередній перегляд ${label}`}
              fill
              style={{ objectFit: 'contain' }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (name === 'photoBefore') {
                  setPhotoBeforePreview(null);
                  setFormData(prev => ({ ...prev, photoBefore: null }));
                } else if (name === 'photoAfter') {
                  setPhotoAfterPreview(null);
                  setFormData(prev => ({ ...prev, photoAfter: null }));
                }
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="mb-6 sm:mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div 
              className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full mb-1 font-medium text-xs sm:text-sm ${
                index + 1 < currentStep 
                  ? 'bg-blue-100 text-blue-600' 
                  : index + 1 === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'}`
              }
            >
              {index + 1 < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs hidden xs:block">
              {index === 0 ? 'Фото' : index === 1 ? 'Інформація' : 'Адреса'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div 
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300"
          ></div>
        </div>
      </div>
    </div>
  );
  
  if (submitSuccess && response) {
    return (
      <div className="rounded-lg bg-white p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="rounded-full bg-green-100 p-2 sm:p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4">Розрахунок AI завершено!</h2>
        
        <div className="text-gray-700 mb-4 sm:mb-6 text-center">
          <p className="mb-2 text-sm sm:text-base">Наш штучний інтелект проаналізував надані дані про пошкодження.</p>
          <p className="text-sm sm:text-base">На основі аналізу виконано детальний розрахунок вартості:</p>
        </div>
        
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-100">
          <div className="mb-4 text-center">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">Оцінена вартість відновлення:</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{response.amount.toLocaleString()} $</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Розраховано за допомогою штучного інтелекту</p>
          </div>
          
          {response.additionDescription && (
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-2">Деталі розрахунку:</h3>
              <p className="text-sm sm:text-base text-gray-700">{response.additionDescription}</p>
            </div>
          )}
          
          {response.description && (
            <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-100">
              <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-1">Опис пошкоджень:</h4>
              <p className="text-xs sm:text-sm text-gray-600">{response.description}</p>
            </div>
          )}
        </div>
        
        <div className="text-gray-700 mb-4 sm:mb-6 text-center text-xs sm:text-sm">
          <p>Увага: Вартість відновлення розрахована штучним інтелектом на основі наданих даних і фотографій. Фактична вартість робіт може відрізнятись в залежності від конкретних умов.</p>
        </div>
        
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
          >
            Зробити нову оцінку
          </button>
        </div>
      </div>
    );
  }
  
  // Повноекранний лоадер для тривалого процесу AI-обробки
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <h2 className="text-lg font-medium text-gray-800 mb-2 text-center">Штучний інтелект працює</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">{processingStep || 'Аналіз даних...'}</p>
        <div className="w-full max-w-xs sm:max-w-sm h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">AI-розрахунок може тривати до 20 секунд</p>
      </div>
    );
  }
  
  // Рендеринг форми з кроками
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      {renderProgressBar()}
      
      {submitError && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-md animate-pulse">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 text-sm sm:text-base">{submitError}</p>
          </div>
        </div>
      )}
      
      {/* Крок 1: Фотографії */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Фотографії об&apos;єкта</h2>
          
          {renderFileUpload('photoBefore', 'photoBefore', 'Фото ДО руйнування', photoBeforePreview, false)}
          {renderFileUpload('photoAfter', 'photoAfter', 'Фото ПІСЛЯ руйнування', photoAfterPreview, true)}
        </div>
      )}
      
      {/* Крок 2: Інформація про об'єкт */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Інформація про об&apos;єкт</h2>
          
          <div className="mb-6">
            <label htmlFor="objectType" className="block text-sm font-medium text-gray-700 mb-1">
              Тип об&apos;єкта<span className="text-red-500">*</span>
            </label>
            <select
              id="objectType"
              name="objectType"
              value={formData.objectType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="" disabled>Оберіть тип об&apos;єкта</option>
              <option value="WAREHOUSE">Склад</option>
              <option value="AIRCRAFT_REPAIR_PLANT">Авіаремонтний завод</option>
              <option value="BRIDGE">Міст</option>
              <option value="OIL_DEPOT">Нафтобаза</option>
              <option value="GOVERNMENT_FACILITIES">Державні установи</option>
              <option value="FUEL_DEPOT">Паливний склад</option>
              <option value="EDUCATION_FACILITY">Освітній заклад (школа тощо)</option>
              <option value="RELIGIOUS_FACILITIES">Релігійні споруди</option>
              <option value="AIRPORT">Аеропорт</option>
              <option value="HEALTH_FACILITY">Медичний заклад (лікарня, клініка)</option>
              <option value="INDUSTRIAL_BUSINESS_ENTERPRISE">Промислові/Бізнес об&apos;єкти</option>
              <option value="TELECOMMUNICATIONS">Телекомунікації</option>
              <option value="CHEMICAL_STORAGE_UNIT">Сховище хімічних речовин</option>
              <option value="ELECTRICITY_SUPPLY_SYSTEM">Система електропостачання</option>
              <option value="NUCLEAR_UNIT">Ядерний об&apos;єкт</option>
              <option value="CULTURAL_FACILITIES">Культурні об&apos;єкти (музей, театр тощо)</option>
              <option value="RAILWAY">Залізниця</option>
              <option value="GAS_SUPPLY_SYSTEM">Система газопостачання</option>
              <option value="WATER_SUPPLY_SYSTEM">Система водопостачання</option>
              <option value="POWER_PLANT">Електростанція</option>
              <option value="HARBOR">Порт</option>
              <option value="ROAD_HIGHWAY">Дорога / Шосе</option>
              <option value="AGRICULTURAL_FACILITIES">Сільськогосподарські об&apos;єкти</option>
              <option value="HEATING_AND_WATER_FACILITY">Опалювальні та водні об&apos;єкти</option>
              <option value="OTHER">Інше</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Опис пошкодження<span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Детальний опис пошкоджень..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label htmlFor="areaSizeSqM" className="block text-sm font-medium text-gray-700 mb-1">
                Площа об&apos;єкта (м²)
              </label>
              <input
                type="number"
                id="areaSizeSqM"
                name="areaSizeSqM"
                value={formData.areaSizeSqM}
                onChange={handleNumberChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Наприклад: 120"
              />
            </div>
            
            <div>
              <label htmlFor="floors" className="block text-sm font-medium text-gray-700 mb-1">
                Кількість поверхів
              </label>
              <input
                type="number"
                id="floors"
                name="floors"
                value={formData.floors}
                onChange={handleNumberChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Наприклад: 5"
              />
            </div>
            
            <div>
              <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700 mb-1">
                Рік побудови
              </label>
              <input
                type="number"
                id="constructionYear"
                name="constructionYear"
                value={formData.constructionYear}
                onChange={handleNumberChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Наприклад: 1985"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Крок 3: Адреса */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Адреса об&apos;єкта</h2>
          
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Адреса об&apos;єкта<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Повна адреса об&apos;єкта з вулицею, номером, містом та областю"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Вкажіть максимально точну адресу для правильної оцінки пошкоджень
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between border-t pt-4 sm:pt-6">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goToPrevStep}
              className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start mb-3 sm:mb-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Назад
            </button>
          )}
        </div>
        
        <div className="order-first sm:order-none mb-3 sm:mb-0 w-full sm:w-auto text-center">
          <p className="text-sm text-gray-500">
            {currentStep === totalSteps ? (
              <>Поля, позначені <span className="text-red-500">*</span>, є обов&apos;язковими</>
            ) : (
              `Крок ${currentStep} з ${totalSteps}`
            )}
          </p>
        </div>
        
        <div className="w-full sm:w-auto">
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto justify-center text-sm sm:text-base"
            >
              Далі
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-4 sm:px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto justify-center text-sm sm:text-base
                        ${isSubmitting 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Розрахунок...
                </>
              ) : 'Розрахувати вартість'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
} 