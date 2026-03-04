import type { AttendanceRecord, BranchUserAttendance } from "@/types/reports";
import {
  ATTENDANCE_TYPES,
  type TransformedAttendanceData,
  type TimeEvent,
} from "./types";

// Helper function to get branch ID from storage
export const getBranchIdFromStorage = (): number => {
  const branchValue = localStorage.getItem("branch");
  if (branchValue) {
    const branchId = parseInt(branchValue, 10);
    return isNaN(branchId) ? 1 : branchId;
  }
  return 1;
};

// Helper function to format date for display
export const formatTime = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

// Helper function to format minutes to duration string
export const formatDuration = (minutes: number): string => {
  if (minutes === 0) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:00`;
  }
  return `${mins}:00`;
};

// Get break label based on b_hours
export const getBreakLabel = (bHours: number): string => {
  switch (bHours) {
    case 60:
      return "1 Hour Break";
    case 30:
      return "30 Min Break";
    case 15:
      return "15 Min Break";
    default:
      return `${bHours} Min Break`;
  }
};

// Helper function to get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * Calculate total hours worked based on FIRST time-in and LAST time-out.
 * Handles multiple in/out records per day.
 */
export const calculateTotalHours = (attendance: AttendanceRecord[]): string => {
  // Collect all time-in records
  const timeInRecords = attendance.filter(
    (rec) => rec.types === ATTENDANCE_TYPES.TIME_IN,
  );
  const timeOutRecords = attendance.filter(
    (rec) => rec.types === ATTENDANCE_TYPES.TIME_OUT,
  );

  if (timeInRecords.length === 0) return "-";

  // First time-in (earliest)
  const sortedIns = [...timeInRecords].sort(
    (a, b) => new Date(a.time_in).getTime() - new Date(b.time_in).getTime(),
  );
  const firstTimeIn = new Date(sortedIns[0].time_in);

  // Last time-out (latest)
  let lastTimeOut: Date | null = null;

  if (timeOutRecords.length > 0) {
    const sortedOuts = [...timeOutRecords].sort(
      (a, b) => new Date(b.time_in).getTime() - new Date(a.time_in).getTime(),
    );
    lastTimeOut = new Date(sortedOuts[0].time_in);
  } else {
    // Fallback: check time_out field on time-in records
    const lastIn = sortedIns[sortedIns.length - 1];
    if (lastIn.time_out) {
      lastTimeOut = new Date(lastIn.time_out);
    }
  }

  if (!lastTimeOut) return "Active";

  const diffMs = lastTimeOut.getTime() - firstTimeIn.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

/**
 * Build a chronological timeline of all time events for a user.
 * Merges time-ins, time-outs, break-ins, break-outs into a single sorted list.
 */
export const buildTimelineEvents = (
  attendance: AttendanceRecord[],
): TimeEvent[] => {
  const events: TimeEvent[] = [];

  for (const rec of attendance) {
    if (rec.types === ATTENDANCE_TYPES.TIME_IN) {
      events.push({
        id: rec.id * 10 + 1,
        type: "time-in",
        time: new Date(rec.time_in),
        timeString: formatTime(rec.time_in),
        label: "Time In",
        image: rec.in_img,
        record: rec,
      });
      if (rec.time_out) {
        events.push({
          id: rec.id * 10 + 2,
          type: "time-out",
          time: new Date(rec.time_out),
          timeString: formatTime(rec.time_out),
          label: "Time Out",
          image: rec.out_img,
          record: rec,
        });
      }
    } else if (rec.types === ATTENDANCE_TYPES.TIME_OUT) {
      events.push({
        id: rec.id * 10 + 1,
        type: "time-out",
        time: new Date(rec.time_in),
        timeString: formatTime(rec.time_in),
        label: "Time Out",
        image: rec.in_img,
        record: rec,
      });
    } else if (rec.types === ATTENDANCE_TYPES.BREAK) {
      events.push({
        id: rec.id * 10 + 1,
        type: "break-in",
        time: new Date(rec.time_in),
        timeString: formatTime(rec.time_in),
        label: `${getBreakLabel(rec.b_hours)} Start`,
        image: rec.in_img,
        breakDuration: rec.b_hours,
        record: rec,
      });
      if (rec.time_out) {
        events.push({
          id: rec.id * 10 + 2,
          type: "break-out",
          time: new Date(rec.time_out),
          timeString: formatTime(rec.time_out),
          label: `${getBreakLabel(rec.b_hours)} End`,
          image: rec.out_img,
          breakDuration: rec.b_hours,
          record: rec,
        });
      }
    }
  }

  // Sort by time ascending
  events.sort((a, b) => a.time.getTime() - b.time.getTime());

  return events;
};

/**
 * Transform API data to table format.
 * Uses FIRST time-in and LAST time-out for the main display.
 */
export const transformAttendanceData = (
  results: BranchUserAttendance[],
): TransformedAttendanceData[] => {
  return results.map((user) => {
    const attendance = user.attendance || [];

    // Separate record types
    const timeInRecords = attendance.filter(
      (rec) => rec.types === ATTENDANCE_TYPES.TIME_IN,
    );
    const timeOutRecords = attendance.filter(
      (rec) => rec.types === ATTENDANCE_TYPES.TIME_OUT,
    );
    const breakRecords = attendance.filter(
      (rec) => rec.types === ATTENDANCE_TYPES.BREAK,
    );

    // Sort time-in records by time ascending → first in
    const sortedIns = [...timeInRecords].sort(
      (a, b) => new Date(a.time_in).getTime() - new Date(b.time_in).getTime(),
    );
    const firstIn = sortedIns[0] || null;

    // Sort time-out records by time descending → last out
    const sortedOuts = [...timeOutRecords].sort(
      (a, b) => new Date(b.time_in).getTime() - new Date(a.time_in).getTime(),
    );
    const lastOut = sortedOuts[0] || null;

    // Determine last time-out display
    let lastTimeOutStr: string;
    let lastTimeOutImg: string | null;

    if (lastOut) {
      lastTimeOutStr = formatTime(lastOut.time_in);
      lastTimeOutImg = lastOut.in_img;
    } else if (firstIn?.time_out) {
      lastTimeOutStr = formatTime(firstIn.time_out);
      lastTimeOutImg = firstIn.out_img;
    } else {
      lastTimeOutStr = "-";
      lastTimeOutImg = null;
    }

    // Calculate total break time by category
    const oneHourBreaks = breakRecords
      .filter((rec) => rec.b_hours === 60)
      .reduce((sum, rec) => sum + rec.b_hours, 0);

    const thirtyMinBreaks = breakRecords
      .filter((rec) => rec.b_hours === 30)
      .reduce((sum, rec) => sum + rec.b_hours, 0);

    const fifteenMinBreaks = breakRecords
      .filter((rec) => rec.b_hours === 15)
      .reduce((sum, rec) => sum + rec.b_hours, 0);

    return {
      id: user.id,
      nameOfAgent: user.fullname,
      assignedBranch: `Branch ${getBranchIdFromStorage()}`,
      firstTimeIn: formatTime(firstIn?.time_in || null),
      firstTimeInImg: firstIn?.in_img || null,
      lastTimeOut: lastTimeOutStr,
      lastTimeOutImg: lastTimeOutImg,
      oneHour: formatDuration(oneHourBreaks),
      thirtyMins: formatDuration(thirtyMinBreaks),
      fifteenMins: formatDuration(fifteenMinBreaks),
      numOfHours: calculateTotalHours(attendance),
      attendance,
      breakRecords,
      timeInRecords,
      timeOutRecords,
    };
  });
};
