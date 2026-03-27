// Profile.api.ts — all fetch calls for the Profile feature

import type { StudentProfile } from './profile.types';


const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

type gender = "male" | "femail" | "other"
type status = "accepted"|"pending"|"rejected"|"approved"
interface Room{
    _id: string,
    room_no: string,
    floor: number,
    capacity: number,
    fees: number
};

export interface ProfileApiResponse {
  success: boolean;
  data: StudentProfile;
}

export interface Profile{
   _id: string,
  student_name: string,
  student_email: string,
  student_roll_no: string | number,
  father_name: string,
  student_cellphone: string,
  guardian_name: string,
  guardian_cellphone: string,
  cnic_no: string,
  active_whatsapp_no: string,
  postal_address: string,
  permanent_address: string,
  city: string,
  province: string,
  cnic_image: string[],
  date_of_birth: string,
  academic_year: string,
  gender: gender,
  status: status,
  application_submit_date: Date,
  __v: 0,
  student_password: string,
  hostelJoinDate: Date,
  hostelLeaveDate: Date,
  room_id: Room
};

export interface UpdateProfilePayload {
  cnic_no?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  student_email?: string;
  student_cellphone?: string;
  emergency_contact?: string;
  postal_address?: string;
  permanent_address?: string;
}

// ── helpers ────────────────────────────────────────────────────────────────

async function request<T>(url:string,token:string,options?:RequestInit):Promise<T>{
  const res = await fetch(url,{
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}` 
    },
    ...options,
  });
  const json = await res.json();
  if(!res.ok)throw new Error(json.message ?? `Request failed ${res.status}`);
  return json as T;
};

// ── endpoints ──────────────────────────────────────────────────────────────

/**
 * GET /api/student/profile
 * Returns the student's full profile with populated room_id.
 */


export const ProfileAPI={
  fetchProfile(token:string):Promise<Profile>{
    return request(`${BASE}/student/profile`,token)
  },
  updateProfile(token:string,data:UpdateProfilePayload){
    return request(`${BASE}/student/profile`,token,{
      method:"PATCH",
      body:JSON.stringify(data)
    })
  }
};


// export const fetchProfile = async (): Promise<StudentProfile> => {
//   const res = await fetch(`${BASE}/student/profile`, {
//     method: 'GET',
//     headers: baseHeaders(),
//   });
//   const json = await handleResponse<ProfileApiResponse>(res);
//   if (!json.success) throw new Error('Unexpected response shape.');
//   return json.data;
// };

// /**
//  * PATCH /api/student/profile
//  * Updates only the editable fields; read-only fields are rejected server-side.
//  * Wire this up when the backend PATCH endpoint is ready.
//  */
// export const updateProfile = async (
//   payload: UpdateProfilePayload,
// ): Promise<StudentProfile> => {
//   const res = await fetch(`${BASE}/student/profile`, {
//     method: 'PATCH',
//     headers: baseHeaders(),
//     body: JSON.stringify(payload),
//   });
//   const json = await handleResponse<ProfileApiResponse>(res);
//   if (!json.success) throw new Error('Unexpected response shape.');
//   return json.data;
// };