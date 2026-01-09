import { useState, useMemo } from "react";
import { SideBar } from "@/components/admin/SideBar";
import ActionButtons from "@/components/admin/table/Buttons";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import { reportNavs } from "@/navigattion/ReportNaviation";
import { useGetUsersAttendanceListQuery } from "@/store/api/Reports";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Image as ImageIcon, Coffee } from "lucide-react";
import type { BranchUserAttendance, AttendanceRecord } from "@/types/reports";

// Attendance type constants
const ATTENDANCE_TYPES = {
  TIME_IN: 1,
  TIME_OUT: 2,
  BREAK: 3,
};

// Get API base URL for images
const API_BASE_URL = import.meta.env.VITE_API_DOMAIN || "";

// Helper function to get branch ID from storage
const getBranchIdFromStorage = (): number => {
  const branchValue = localStorage.getItem("branch");
  if (branchValue) {
    const branchId = parseInt(branchValue, 10);
    return isNaN(branchId) ? 1 : branchId;
  }
  return 1;
};

// Helper function to format date for display
const formatTime = (dateString: string | null): string => {
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
const formatDuration = (minutes: number): string => {
  if (minutes === 0) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:00`;
  }
  return `${mins}:00`;
};

// Helper function to calculate total hours worked
const calculateTotalHours = (attendance: AttendanceRecord[]): string => {
  const timeInRecord = attendance.find(
    (rec) => rec.types === ATTENDANCE_TYPES.TIME_IN
  );
  const timeOutRecord = attendance.find(
    (rec) => rec.types === ATTENDANCE_TYPES.TIME_OUT
  );

  if (!timeInRecord) return "-";

  const timeIn = new Date(timeInRecord.time_in);
  const timeOut = timeOutRecord?.time_in
    ? new Date(timeOutRecord.time_in)
    : timeInRecord.time_out
    ? new Date(timeInRecord.time_out)
    : null;

  if (!timeOut) return "Active";

  const diffMs = timeOut.getTime() - timeIn.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Get break label based on b_hours
const getBreakLabel = (bHours: number): string => {
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

// Interface for transformed table data
interface TransformedAttendanceData {
  id: number;
  nameOfAgent: string;
  assignedBranch: string;
  timeIn: string;
  timeInImg: string | null;
  timeOut: string;
  timeOutImg: string | null;
  oneHour: string;
  thirtyMins: string;
  fifteenMins: string;
  numOfHours: string;
  attendance: AttendanceRecord[];
  breakRecords: AttendanceRecord[];
}

// Transform API data to table format
const transformAttendanceData = (
  results: BranchUserAttendance[]
): TransformedAttendanceData[] => {
  return results.map((user) => {
    const attendance = user.attendance || [];

    // Find time-in record (types = 1)
    const timeInRecord = attendance.find(
      (rec) => rec.types === ATTENDANCE_TYPES.TIME_IN
    );

    // Find time-out record (types = 2)
    const timeOutRecord = attendance.find(
      (rec) => rec.types === ATTENDANCE_TYPES.TIME_OUT
    );

    // Find break records (types = 3) and categorize by b_hours
    const breakRecords = attendance.filter(
      (rec) => rec.types === ATTENDANCE_TYPES.BREAK
    );

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
      timeIn: formatTime(timeInRecord?.time_in || null),
      timeInImg: timeInRecord?.in_img || null,
      timeOut: formatTime(
        timeOutRecord?.time_in || timeInRecord?.time_out || null
      ),
      timeOutImg: timeOutRecord?.in_img || timeInRecord?.out_img || null,
      oneHour: formatDuration(oneHourBreaks),
      thirtyMins: formatDuration(thirtyMinBreaks),
      fifteenMins: formatDuration(fifteenMinBreaks),
      numOfHours: calculateTotalHours(attendance),
      attendance: attendance,
      breakRecords: breakRecords,
    };
  });
};

// Image Preview Modal Component
interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
}

function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title,
}: ImagePreviewModalProps) {
  const fullImageUrl = imageUrl ? `${API_BASE_URL}${imageUrl}` : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center p-4">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={title}
              className="max-w-full max-h-[400px] rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.png";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
              <ImageIcon className="h-16 w-16 mb-2" />
              <p>No image available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Attendance Detail Modal Component
interface AttendanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TransformedAttendanceData | null;
  onImageClick: (imageUrl: string | null, title: string) => void;
}

function AttendanceDetailModal({
  isOpen,
  onClose,
  data,
  onImageClick,
}: AttendanceDetailModalProps) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5" />
            Attendance Details - {data.nameOfAgent}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Time In/Out Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Time In Card */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time In
              </h3>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                {data.timeIn}
              </p>
              {data.timeInImg && (
                <button
                  onClick={() => onImageClick(data.timeInImg, "Time In Photo")}
                  className="mt-3 flex items-center gap-2 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
                >
                  <ImageIcon className="h-4 w-4" />
                  View Photo
                </button>
              )}
            </div>

            {/* Time Out Card */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Out
              </h3>
              <p className="text-2xl font-bold text-red-800 dark:text-red-300">
                {data.timeOut}
              </p>
              {data.timeOutImg && (
                <button
                  onClick={() =>
                    onImageClick(data.timeOutImg, "Time Out Photo")
                  }
                  className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                >
                  <ImageIcon className="h-4 w-4" />
                  View Photo
                </button>
              )}
            </div>
          </div>

          {/* Total Hours */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
              Total Hours Worked
            </h3>
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
              {data.numOfHours}
            </p>
          </div>

          {/* Break Records Section */}
          {data.breakRecords.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Break Records ({data.breakRecords.length})
              </h3>
              <div className="space-y-3">
                {data.breakRecords.map((breakRecord, index) => (
                  <div
                    key={breakRecord.id}
                    className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-medium text-amber-700 dark:text-amber-400">
                        {getBreakLabel(breakRecord.b_hours)} #{index + 1}
                      </span>
                      <span className="text-sm text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded">
                        {breakRecord.b_hours} mins allowed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Break In */}
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Break In
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {formatTime(breakRecord.time_in)}
                        </p>
                        {breakRecord.in_img && (
                          <button
                            onClick={() =>
                              onImageClick(
                                breakRecord.in_img,
                                `Break In Photo #${index + 1}`
                              )
                            }
                            className="mt-2 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 transition-colors"
                          >
                            <ImageIcon className="h-3 w-3" />
                            View Photo
                          </button>
                        )}
                      </div>

                      {/* Break Out */}
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Break Out
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {formatTime(breakRecord.time_out)}
                        </p>
                        {breakRecord.out_img && (
                          <button
                            onClick={() =>
                              onImageClick(
                                breakRecord.out_img,
                                `Break Out Photo #${index + 1}`
                              )
                            }
                            className="mt-2 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 transition-colors"
                          >
                            <ImageIcon className="h-3 w-3" />
                            View Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Break Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                1 Hour Breaks
              </p>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                {data.oneHour}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                30 Min Breaks
              </p>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                {data.thirtyMins}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                15 Min Breaks
              </p>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                {data.fifteenMins}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BMAttendanceReport() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [branchId] = useState<number>(getBranchIdFromStorage());

  // Modal states
  const [selectedAttendance, setSelectedAttendance] =
    useState<TransformedAttendanceData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string | null;
    title: string;
  }>({ url: null, title: "" });

  // Fetch attendance data from API
  const {
    data: attendanceData,
    isLoading,
    isFetching,
  } = useGetUsersAttendanceListQuery({
    bid: branchId,
    search: searchQuery || undefined,
    page: currentPage,
    page_size: pageSize,
    start_date: selectedDate,
    end_date: selectedDate, // Same date for single day filter
  });

  // Transform API data to table format
  const tableData = useMemo(() => {
    if (!attendanceData?.results) return [];
    return transformAttendanceData(attendanceData.results);
  }, [attendanceData]);

  const totalItems = attendanceData?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to first page on date change
  };

  const handleShowMore = () => {
    console.log("Loading more data...");
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleRowClick = (row: TransformedAttendanceData) => {
    setSelectedAttendance(row);
    setIsDetailModalOpen(true);
  };

  const handleImageClick = (imageUrl: string | null, title: string) => {
    setSelectedImage({ url: imageUrl, title });
    setIsImageModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar navs={reportNavs} onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Attendance Report
          </h1>

          <div className="flex items-center justify-between mb-4 gap-4">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="date-filter"
                className="text-sm font-medium dark:text-gray-300"
              >
                Filter by Date:
              </Label>
              <Input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-[180px]"
              />
            </div>

            <Search
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              containerClassName="w-72"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end mb-4 gap-3">
            <ActionButtons />
          </div>

          {/* Loading State */}
          {(isLoading || isFetching) && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Loading attendance data...
              </span>
            </div>
          )}

          {/* Custom Data Table with clickable rows */}
          {!isLoading && tableData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name of Agent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time-in
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time-out
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      1 Hour
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      30 Mins
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      15 Mins
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Images
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tableData.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {row.nameOfAgent}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.assignedBranch}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                        {row.timeIn}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">
                        {row.timeOut}
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
                          {row.timeInImg && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageClick(
                                  row.timeInImg,
                                  `${row.nameOfAgent} - Time In`
                                );
                              }}
                              className="p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                              title="View Time In Photo"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </button>
                          )}
                          {row.timeOutImg && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageClick(
                                  row.timeOutImg,
                                  `${row.nameOfAgent} - Time Out`
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
                              {row.breakRecords.length} breaks
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && tableData.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No attendance records found for {selectedDate}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 50, 100]}
            totalItems={totalItems}
            showMore={useShowMore}
            onShowMore={handleShowMore}
            className="mt-6"
          />
        </div>
      </div>

      {/* Attendance Detail Modal */}
      <AttendanceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedAttendance}
        onImageClick={handleImageClick}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={selectedImage.url}
        title={selectedImage.title}
      />
    </div>
  );
}

export default BMAttendanceReport;
