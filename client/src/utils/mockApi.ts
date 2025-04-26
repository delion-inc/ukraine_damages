import { AIDamageAssessment, DamageReportFormData } from './types';

// Simulates API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock AI damage assessment API
export const submitDamageReport = async (data: DamageReportFormData): Promise<AIDamageAssessment> => {
  // Simulate network delay
  await delay(1500);
  
  // Create a mock assessment based on the submitted data
  const baseEstimate = data.objectType === 'residential' ? 50000 : 150000;
  const areaFactor = data.areaSizeSqM ? data.areaSizeSqM / 100 : 1;
  const floorsFactor = data.floors ? data.floors * 0.5 : 1;
  const ageFactor = data.constructionYear 
    ? (2024 - data.constructionYear) > 50 
      ? 1.3 
      : 1
    : 1;

  const estimatedCost = Math.round(baseEstimate * areaFactor * floorsFactor * ageFactor);
  
  return {
    estimatedCost,
    currency: 'UAH',
    assessmentCriteria: [
      {
        name: 'Тип будівлі',
        description: `${data.objectType} має стандартну вартість відновлення`,
        impact: 40
      },
      {
        name: 'Площа',
        description: `Площа ${data.areaSizeSqM || 'невідома'} м² впливає на загальну вартість`,
        impact: 25
      },
      {
        name: 'Кількість поверхів',
        description: `${data.floors || 'Невідома кількість'} поверхів визначає складність відновлення`,
        impact: 15
      },
      {
        name: 'Рік будівництва',
        description: `Будівля ${data.constructionYear || 'невідомого'} року будівництва може потребувати додаткових робіт`,
        impact: 10
      },
      {
        name: 'Додаткові фактори',
        description: 'Інші фактори, включаючи доступність матеріалів та робочої сили в регіоні',
        impact: 10
      }
    ],
    confidence: 75
  };
}; 