import { RawAttendanceRecord, AttendanceRecord } from '../types/attendance.types';

export const mapAttendanceRecords = (rawRecords: RawAttendanceRecord[]): AttendanceRecord[] => {
  const groupedRecords = new Map<string, AttendanceRecord>();

  rawRecords.forEach((record) => {
    // Extract just the YYYY-MM-DD for grouping
    const dateKey = record.date.split('T')[0]; 
    
    if (!groupedRecords.has(dateKey)) {
      const dateObj = new Date(record.date);
      groupedRecords.set(dateKey, {
        id: dateKey, // Use date as ID if grouping, or generate a unique one
        date: dateKey,
        day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        mess: { breakfast: false, lunch: false, dinner: false },
        hostel: { morning: false, evening: false, night: false },
        status: 'absent', // Default, will calculate below
        remarks: record.remarks || '',
      });
    }

    const uiRecord = groupedRecords.get(dateKey)!;
    const isPresent = record.status === 'Present';

    // Map Meals
    if (record.mealType === 'Breakfast') uiRecord.mess.breakfast = isPresent;
    if (record.mealType === 'Lunch') uiRecord.mess.lunch = isPresent;
    if (record.mealType === 'Dinner') uiRecord.mess.dinner = isPresent;

    // Map Hostel (Adjust this based on how your backend actually sends hostel data)
    if (record.isHostelMorning !== undefined) uiRecord.hostel.morning = record.isHostelMorning;
    if (record.isHostelEvening !== undefined) uiRecord.hostel.evening = record.isHostelEvening;
    if (record.isHostelNight !== undefined) uiRecord.hostel.night = record.isHostelNight;

    // Update overall status and remarks
    if (record.status === 'Present') uiRecord.status = 'present';
    if (record.status === 'Leave') uiRecord.status = 'leave';
    if (record.remarks && !uiRecord.remarks.includes(record.remarks)) {
      uiRecord.remarks += (uiRecord.remarks ? ' | ' : '') + record.remarks;
    }
  });

  // Convert Map back to an array and sort by date descending
  return Array.from(groupedRecords.values()).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};