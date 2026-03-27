import { SummaryData, RawAttendanceRecord } from '../types/attendance.types';

const API_BASE_URL = '/api/student/attendance'; // Replace with your actual base URL or env variable

export const AttendanceService = {
  getSummary: async (from: string, to: string): Promise<SummaryData> => {
    const response = await fetch(`${API_BASE_URL}/summary?from=${from}&to=${to}`);
    if (!response.ok) throw new Error('Failed to fetch attendance summary');
    
    const json = await response.json();
    if (!json.success) throw new Error(json.message || 'API Error');
    
    return json.data;
  },

  getRecords: async (from: string, to: string, limit: number = 31): Promise<RawAttendanceRecord[]> => {
    const response = await fetch(`${API_BASE_URL}?from=${from}&to=${to}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch attendance records');
    
    const json = await response.json();
    if (!json.success) throw new Error(json.message || 'API Error');
    
    // Adjust json.data depending on how your backend structures the paginated response
    return json.data || json.records || []; 
  }
};