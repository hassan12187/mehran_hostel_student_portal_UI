// Profile.types.ts — shared TypeScript types for the Profile feature

export interface Room {
  room_no: string;
  floor: string;
  block: string;
  fees: number;
  capacity: number;
}

export interface StudentProfile {
  _id: string;
  student_name: string;
  student_roll_no: string;
  student_email: string;
  cnic_no: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | string;
  blood_group?: string;
  student_cellphone: string;
  emergency_contact?: string;
  postal_address: string;
  permanent_address: string;
  status: 'Active' | 'Inactive' | string;
  messEnabled: boolean;
  hostelJoinDate: string;
  room_id?: Room;
  // academic fields (populated depending on your model)
  department?: string;
  semester?: string;
  batch?: string;
  cgpa?: string;
  university?: string;
}

export type TabId = 'personal' | 'contact' | 'academic';

export interface EditableFields {
  cnic_no: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  student_email: string;
  student_cellphone: string;
  emergency_contact: string;
  postal_address: string;
  permanent_address: string;
}