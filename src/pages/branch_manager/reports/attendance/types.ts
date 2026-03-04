import type { AttendanceRecord } from "@/types/reports";

// Attendance type constants
export const ATTENDANCE_TYPES = {
  TIME_IN: 1,
  TIME_OUT: 2,
  BREAK: 3,
} as const;

// Get API base URL for images
export const API_BASE_URL = import.meta.env.VITE_API_DOMAIN || "";

// Interface for transformed table data
export interface TransformedAttendanceData {
  id: number;
  nameOfAgent: string;
  assignedBranch: string;
  firstTimeIn: string;
  firstTimeInImg: string | null;
  lastTimeOut: string;
  lastTimeOutImg: string | null;
  oneHour: string;
  thirtyMins: string;
  fifteenMins: string;
  numOfHours: string;
  attendance: AttendanceRecord[];
  breakRecords: AttendanceRecord[];
  timeInRecords: AttendanceRecord[];
  timeOutRecords: AttendanceRecord[];
}

// Single unified time event for the timeline
export interface TimeEvent {
  id: number;
  type: "time-in" | "time-out" | "break-in" | "break-out";
  time: Date;
  timeString: string;
  label: string;
  image: string | null;
  breakDuration?: number;
  record: AttendanceRecord;
}
