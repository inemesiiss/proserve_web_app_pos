import { Image as ImageIcon } from "lucide-react";
import type { TransformedAttendanceData } from "./types";

interface AttendanceTableProps {
  data: TransformedAttendanceData[];
  onRowClick: (row: TransformedAttendanceData) => void;
  onImageClick: (imageUrl: string | null, title: string) => void;
}

const columnHeaders = [
  "Name of Agent",
  "Branch",
  "First In",
  "Last Out",
  "1 Hour",
  "30 Mins",
  "15 Mins",
  "Total Hours",
  "Images",
] as const;

export function AttendanceTable({
  data,
  onRowClick,
  onImageClick,
}: AttendanceTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columnHeaders.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {row.nameOfAgent}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {row.assignedBranch}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                  {row.firstTimeIn}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">
                  {row.lastTimeOut}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {row.oneHour}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {row.thirtyMins}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {row.fifteenMins}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {row.numOfHours}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    {row.firstTimeInImg && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageClick(
                            row.firstTimeInImg,
                            `${row.nameOfAgent} - Time In`,
                          );
                        }}
                        className="p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        title="View Time In Photo"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    )}
                    {row.lastTimeOutImg && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageClick(
                            row.lastTimeOutImg,
                            `${row.nameOfAgent} - Time Out`,
                          );
                        }}
                        className="p-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="View Time Out Photo"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    )}
                    {row.breakRecords.length > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                        {row.breakRecords.length}{" "}
                        {row.breakRecords.length === 1 ? "break" : "breaks"}
                      </span>
                    )}
                    {row.timeInRecords.length > 1 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {row.timeInRecords.length} ins
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
