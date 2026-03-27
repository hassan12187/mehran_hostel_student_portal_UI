import { useState, useEffect } from 'react';
import { SummaryData, AttendanceRecord } from '../types/attendance.types';
import { AttendanceService } from '../services/attendance.services';
import { mapAttendanceRecords } from '../utils/attendance.mapper';

export const useAttendance = (selectedMonth: string) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Calculate date boundaries
        const [yearStr, monthStr] = selectedMonth.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        
        const fromDate = new Date(year, month - 1, 1).toISOString();
        const toDate = new Date(year, month, 0).toISOString(); // Last day of month

        // Fetch in parallel for performance
        const [summary, rawRecords] = await Promise.all([
          AttendanceService.getSummary(fromDate, toDate),
          AttendanceService.getRecords(fromDate, toDate, 31)
        ]);

        // Transform backend data to UI format
        const formattedRecords = mapAttendanceRecords(rawRecords);

        setSummaryData(summary);
        setRecords(formattedRecords);
      } catch (err) {
        console.error("Attendance fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedMonth]);

  return { summaryData, records, isLoading, error };
};