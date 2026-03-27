// ============================================================
// BabyGuardian Shared Types
// ============================================================

export type UserRole = 'parent' | 'caregiver' | 'guest' | 'admin';
export type HomeMemberRole = 'owner' | 'parent' | 'caregiver' | 'guest';
export type BabyGender = 'male' | 'female' | 'other';
export type FeedingType = 'breastfeeding' | 'formula' | 'mixed' | 'solids';
export type BreastSide = 'left' | 'right' | 'both';
export type EventType =
  | 'cry_detected'
  | 'person_detected'
  | 'security_alert'
  | 'motion_detected'
  | 'face_recognized'
  | 'unknown_face'
  | 'feeding_reminder'
  | 'vaccine_reminder';
export type EventSeverity = 'info' | 'warning' | 'critical';
export type DeviceType = 'tablet_hub' | 'mobile_ios' | 'mobile_android';
export type SmartDeviceType = 'light' | 'plug' | 'dimmer' | 'rgb_light' | 'white_noise_machine' | 'sensor';
export type AIProvider = 'groq' | 'openai' | 'anthropic' | 'gemini';
export type MilestoneCategory = 'motor' | 'language' | 'cognitive' | 'social' | 'sensory';
export type MilestoneStatus = 'pending' | 'in_progress' | 'achieved';
export type VaccineStatus = 'pending' | 'applied' | 'skipped' | 'delayed';
export type FaceCategory = 'mother' | 'father' | 'caregiver' | 'family' | 'unknown' | 'other';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Home {
  id: string;
  name: string;
  ownerId: string;
  timezone: string;
  countryCode: string;
  createdAt: string;
}

export interface Baby {
  id: string;
  homeId: string;
  name: string;
  birthDate: string;
  gender?: BabyGender;
  birthWeightGrams?: number;
  birthHeightCm?: number;
  bloodType?: string;
  medicalNotes?: string;
  photoUrl?: string;
  countryCode: string;
  createdAt: string;
}

export interface FeedingRecord {
  id: string;
  babyId: string;
  recordedBy?: string;
  feedingType: FeedingType;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  amountMl?: number;
  breastSide?: BreastSide;
  solidFoodDescription?: string;
  notes?: string;
  createdAt: string;
}

export interface BabyEvent {
  id: string;
  homeId: string;
  babyId?: string;
  cameraId?: string;
  eventType: EventType;
  severity: EventSeverity;
  confidence?: number;
  metadata: Record<string, unknown>;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface VaccineCatalog {
  id: string;
  countryCode: string;
  vaccineName: string;
  diseasesCovered: string[];
  recommendedAgeMonths: number;
  doseNumber: number;
  isMandatory: boolean;
  notes?: string;
}

export interface BabyVaccine {
  id: string;
  babyId: string;
  catalogId?: string;
  vaccineName?: string;
  appliedDate?: string;
  scheduledDate?: string;
  status: VaccineStatus;
  batchNumber?: string;
  healthcareProvider?: string;
  notes?: string;
}

export interface MilestoneCatalog {
  id: string;
  ageMonthsMin: number;
  ageMonthsMax: number;
  category: MilestoneCategory;
  title: string;
  description?: string;
  tips?: string;
}

export interface BabyMilestone {
  id: string;
  babyId: string;
  catalogId?: string;
  status: MilestoneStatus;
  achievedDate?: string;
  notes?: string;
}

export interface FaceGroup {
  id: string;
  homeId: string;
  userId?: string;
  displayName: string;
  category: FaceCategory;
  isAuthorized: boolean;
  embeddingCount: number;
  thumbnailUrl?: string;
  notes?: string;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface AuthTokenResponse {
  user: User;
  token: string;
}
