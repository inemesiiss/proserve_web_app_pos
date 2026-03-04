import { useState, useMemo } from "react";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import { useGetUsersAttendanceListQuery } from "@/store/api/Reports";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AttendanceTable,
  AttendanceDetailModal,
  ImagePreviewModal,
  transformAttendanceData,
  getTodayDate,
  getBranchIdFromStorage,
} from "./attendance";
import type { TransformedAttendanceData } from "./attendance";

function BMAttendanceReport() {
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
    end_date: selectedDate,
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
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Attendance Report
      </h1>

      <div className="flex items-center justify-between mb-4 gap-4">
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

      {/* Loading State */}
      {(isLoading || isFetching) && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading attendance data...
          </span>
        </div>
      )}

      {/* Attendance Table */}
      {!isLoading && tableData.length > 0 && (
        <AttendanceTable
          data={tableData}
          onRowClick={handleRowClick}
          onImageClick={handleImageClick}
        />
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

      {/* Modals */}
      <AttendanceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedAttendance}
        onImageClick={handleImageClick}
      />

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
