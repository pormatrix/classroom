export interface Student {
  id: number;
  name: string;
}

export type HealthCriteria = 'clothing' | 'nails' | 'hair' | 'skin' | 'teeth';

export interface HealthRecord {
  clothing: number;
  nails: number;
  hair: number;
  skin: number;
  teeth: number;
}

export type GrowthStatus = 'ปกติ' | 'ไม่ปกติ';

export interface GrowthRecord {
  age: number | null;
  weight: number | null;
  weightStatus: GrowthStatus;
  height: number | null;
  heightStatus: GrowthStatus;
  notes: string;
}

export interface TeachingLogEntry {
  period: number;
  subject: string;
  teacher: string;
  content: string;
  notes: string;
}

export interface HomeroomLogEntry {
  date: string;
  topics: string;
  issues: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface HomeroomDayLog {
  topics: string;
  issues: string;
}

export type WeeklyHomeroomLog = Record<DayOfWeek, HomeroomDayLog>;

export interface AppData {
  students: Student[];
  healthRecords: Record<number, HealthRecord>;
  growthRecords: Record<number, GrowthRecord>;
  teachingLog: Record<DayOfWeek, TeachingLogEntry[]>;
  homeroomLog: WeeklyHomeroomLog;
}
