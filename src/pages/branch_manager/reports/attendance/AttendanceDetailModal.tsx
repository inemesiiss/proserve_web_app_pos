import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Coffee, Timer } from "lucide-react";
import type { TransformedAttendanceData } from "./types";
import { buildTimelineEvents } from "./helpers";
import { TimeRecordTimeline } from "./TimeRecordTimeline";

interface AttendanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TransformedAttendanceData | null;
  onImageClick: (imageUrl: string | null, title: string) => void;
}

export function AttendanceDetailModal({
  isOpen,
  onClose,
  data,
  onImageClick,
}: AttendanceDetailModalProps) {
  // Build sorted timeline from all attendance records
  const timelineEvents = useMemo(() => {
    if (!data) return [];
    return buildTimelineEvents(data.attendance);
  }, [data]);

  if (!data) return null;

  const totalRecords =
    data.timeInRecords.length +
    data.timeOutRecords.length +
    data.breakRecords.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            {data.nameOfAgent}
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.assignedBranch}
          </p>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* First In */}
            <div className="rounded-lg p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
              <p className="text-[11px] uppercase tracking-wider font-medium text-green-600 dark:text-green-400 mb-1">
                First In
              </p>
              <p className="text-lg font-bold text-green-800 dark:text-green-300">
                {data.firstTimeIn}
              </p>
            </div>

            {/* Last Out */}
            <div className="rounded-lg p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
              <p className="text-[11px] uppercase tracking-wider font-medium text-red-600 dark:text-red-400 mb-1">
                Last Out
              </p>
              <p className="text-lg font-bold text-red-800 dark:text-red-300">
                {data.lastTimeOut}
              </p>
            </div>

            {/* Total Hours */}
            <div className="rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-center">
              <p className="text-[11px] uppercase tracking-wider font-medium text-blue-600 dark:text-blue-400 mb-1">
                Total Hours
              </p>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                {data.numOfHours}
              </p>
            </div>
          </div>

          {/* Time Records Timeline */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Time Records
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                ({totalRecords} records, sorted by time)
              </span>
            </h3>
            <TimeRecordTimeline
              events={timelineEvents}
              onImageClick={onImageClick}
            />
          </div>

          {/* Break Summary */}
          {data.breakRecords.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Break Summary
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    1 Hour
                  </p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {data.oneHour}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    30 Mins
                  </p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {data.thirtyMins}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    15 Mins
                  </p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {data.fifteenMins}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
