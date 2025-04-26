export enum ObjectType {
  RESIDENTIAL = "residential",
  COMMERCIAL = "commercial",
  INFRASTRUCTURE = "infrastructure",
  EDUCATIONAL = "educational",
  HEALTHCARE = "healthcare",
  CULTURAL = "cultural",
  INDUSTRIAL = "industrial",
  OTHER = "other"
}

export interface DamageReportFormData {
  photoBefore?: File;
  photoAfter?: File;
  objectType: ObjectType;
  description?: string;
  areaSizeSqM?: number;
  floors?: number;
  constructionYear?: number;
  address?: string;
}

export interface AIDamageAssessment {
  estimatedCost: number;
  currency: string;
  assessmentCriteria: {
    name: string;
    description: string;
    impact: number; // 0-100 percentage impact on overall cost
  }[];
  confidence: number; // 0-100 confidence score
} 