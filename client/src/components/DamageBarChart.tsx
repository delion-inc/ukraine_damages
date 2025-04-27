'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DamageReport {
  id: number;
  description: string;
  photoBefore: string | null;
  photoAfter: string | null;
  infrastructureType: string;
  areaSizeSqM: number;
  floors: number | null;
  constructionYear: number;
  address: string;
  amount: number;
  additionDescription: string | null;
}

interface ChartData {
  name: string;
  fullName: string;
  amount: number;
  count: number;
  originalType: string;
}

// Мапування enum типів інфраструктури на українську
const infrastructureTypeLabels: Record<string, string> = {
  'WAREHOUSE': 'Склад',
  'AIRCRAFT_REPAIR_PLANT': 'Авіаремонтний завод',
  'BRIDGE': 'Міст',
  'OIL_DEPOT': 'Нафтобаза',
  'GOVERNMENT_FACILITIES': 'Державні установи',
  'FUEL_DEPOT': 'Паливний склад',
  'EDUCATION_FACILITY': 'Освітній заклад (школа тощо)',
  'RELIGIOUS_FACILITIES': 'Релігійні споруди',
  'RESIDENTIAL_BUILDING': 'Житловий будинок',
  'AIRPORT': 'Аеропорт',
  'HEALTH_FACILITY': 'Медичний заклад (лікарня, клініка)',
  'INDUSTRIAL_BUSINESS_ENTERPRISE': 'Промислові/Бізнес об`єкти',
  'TELECOMMUNICATIONS': 'Телекомунікації',
  'CHEMICAL_STORAGE_UNIT': 'Сховище хімічних речовин',
  'ELECTRICITY_SUPPLY_SYSTEM': 'Система електропостачання',
  'NUCLEAR_UNIT': 'Ядерний об`єкт',
  'CULTURAL_FACILITIES': 'Культурні об`єкти (музей, театр тощо)',
  'RAILWAY': 'Залізниця',
  'GAS_SUPPLY_SYSTEM': 'Система газопостачання',
  'WATER_SUPPLY_SYSTEM': 'Система водопостачання',
  'POWER_PLANT': 'Електростанція',
  'HARBOR': 'Порт',
  'ROAD_HIGHWAY': 'Дорога / Автомагістраль',
  'AGRICULTURAL_FACILITIES': 'Сільськогосподарські об`єкти',
  'HEATING_AND_WATER_FACILITY': 'Об`єкт тепло- та водопостачання',
  'OTHER': 'Інше'
};

// Набір кольорів для різних категорій
const COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
  '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
  '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
];

// Типи для компонента CustomTooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ChartData;
  }>;
}

// Кастомний компонент для підказок при наведенні
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
        <p className="font-medium text-gray-900">{payload[0].payload.fullName}</p>
        <p className="text-blue-600 font-bold">
          {new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(payload[0].value)}
        </p>
        {payload[0].payload.count && (
          <p className="text-sm text-gray-600">
            Кількість об'єктів: {payload[0].payload.count}
          </p>
        )}
      </div>
    );
  }

  return null;
};

const formatYAxisTick = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} млн`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)} тис`;
  }
  return value.toString();
};

// Функція для скорочення довгих назв категорій
const truncateText = (text: string, maxLength: number = 25): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export default function DamageBarChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/proxy/damage-reports');
        
        if (!response.ok) {
          throw new Error('Не вдалося отримати дані звітів');
        }
        
        const reports: DamageReport[] = await response.json();
        
        const aggregatedData: Record<string, { amount: number; count: number }> = {};
        
        reports.forEach(report => {
          const type = report.infrastructureType;
          if (!aggregatedData[type]) {
            aggregatedData[type] = { amount: 0, count: 0 };
          }
          aggregatedData[type].amount += report.amount;
          aggregatedData[type].count += 1;
        });
        
        const chartData: ChartData[] = Object.entries(aggregatedData)
          .map(([type, { amount, count }]) => {
            const fullName = infrastructureTypeLabels[type] || type;
            return {
              name: truncateText(fullName),
              fullName,
              originalType: type,
              amount,
              count
            };
          })
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 10);
        
        setData(chartData);
      } catch {
        setError('Не вдалося завантажити дані пошкоджень');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 001-1v-4a1 1 0 10-2 0v4a1 1 0 001 1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">Немає даних для відображення</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Сума пошкоджень за типом інфраструктури</h2>
      
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100} 
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatYAxisTick}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
            />
            <Bar 
              dataKey="amount" 
              name="Сума пошкоджень (USD)" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        *Відображено топ-10 категорій з найбільшою сумою пошкоджень
      </div>
    </div>
  );
} 