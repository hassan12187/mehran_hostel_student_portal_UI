// --- API / Raw Types ---
export type ApiStatus = 'Present' | 'Absent' | 'Leave';
export type ApiMealType = 'Breakfast' | 'Lunch' | 'Dinner';

export interface RawAttendanceRecord {
  id: string;
  date: string; // ISO String
  mealType?: ApiMealType;
  status: ApiStatus;
  remarks?: string;
  // Assuming hostel data comes in a similar flat format or is part of the record
  isHostelMorning?: boolean; 
  isHostelEvening?: boolean;
  isHostelNight?: boolean;
}

// --- UI / Component Types ---
export interface AttendanceStats {
  percentage: number;
  present: number;
  total: number;
  absent: number;
}

export interface MonthlyTrend {
  month: string;
  percentage: number;
}

export interface SummaryData {
  overall: AttendanceStats;
  mess: AttendanceStats;
  hostel: AttendanceStats;
  currentMonth: {
    month: string;
    workingDays: number;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
  };
  monthlyTrends: MonthlyTrend[];
}

export interface MealRecord {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface HostelRecord {
  morning: boolean;
  evening: boolean;
  night: boolean;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  mess: MealRecord;
  hostel: HostelRecord;
  status: 'present' | 'absent' | 'leave';
  remarks: string;
}