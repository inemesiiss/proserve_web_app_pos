import { useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import FiltersBar from "@/components/admin/table/Filters";
import ActionButtons from "@/components/admin/table/Buttons";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import { reportNavs } from "@/navigattion/ReportNaviation";

const data = [
  {
    nameOfAgent: "Agent 1",
    assignedBranch: "Branch 1",
    timeIn: "8:00:00 AM",
    oneHour: "59:00",
    thirtyMins: "30:00",
    fifteenMins: "15:00:00",
    cr: "5:00:00",
    coaching: "17:00:00",
    meeting: "27:00:00",
    logOut: "5:00:00 PM",
    numOfHours: 9,
  },
  {
    nameOfAgent: "Agent 2",
    assignedBranch: "Branch 2",
    timeIn: "",
    oneHour: "",
    thirtyMins: "",
    fifteenMins: "",
    cr: "",
    coaching: "",
    meeting: "",
    logOut: "",
    numOfHours: "",
  },
  {
    nameOfAgent: "Agent 3",
    assignedBranch: "Branch 3",
    timeIn: "",
    oneHour: "",
    thirtyMins: "",
    fifteenMins: "",
    cr: "",
    coaching: "",
    meeting: "",
    logOut: "",
    numOfHours: "",
  },
  {
    nameOfAgent: "Agent 4",
    assignedBranch: "Branch 4",
    timeIn: "",
    oneHour: "",
    thirtyMins: "",
    fifteenMins: "",
    cr: "",
    coaching: "",
    meeting: "",
    logOut: "",
    numOfHours: "",
  },
  {
    nameOfAgent: "Agent 5",
    assignedBranch: "Branch 5",
    timeIn: "",
    oneHour: "",
    thirtyMins: "",
    fifteenMins: "",
    cr: "",
    coaching: "",
    meeting: "",
    logOut: "",
    numOfHours: "",
  },
  {
    nameOfAgent: "Agent 6",
    assignedBranch: "Branch 7",
    timeIn: "",
    oneHour: "",
    thirtyMins: "",
    fifteenMins: "",
    cr: "",
    coaching: "",
    meeting: "",
    logOut: "",
    numOfHours: "",
  },
  {
    nameOfAgent: "Agent 7",
    assignedBranch: "Branch 9",
    timeIn: "",
    oneHour: "",
    thirtyMins: "",
    fifteenMins: "",
    cr: "",
    coaching: "",
    meeting: "",
    logOut: "",
    numOfHours: "",
  },
];

const columns = [
  { key: "nameOfAgent", label: "Name of agent" },
  { key: "assignedBranch", label: "Assigned Branch" },
  { key: "timeIn", label: "Time-in" },
  { key: "oneHour", label: "1 Hour" },
  { key: "thirtyMins", label: "30 Mins" },
  { key: "fifteenMins", label: "15 Mins" },
  { key: "cr", label: "CR" },
  { key: "coaching", label: "Coaching" },
  { key: "meeting", label: "Meeting" },
  { key: "logOut", label: "Log-out" },
  { key: "numOfHours", label: "# of hours" },
];

function DirectorAttendanceReport() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);

  const totalItems = 45;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleShowMore = () => {
    console.log("Loading more data...");
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar navs={reportNavs} onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Attendance Report</h1>

          <div className="flex items-center justify-end mb-4">
            <Search
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              containerClassName="w-72"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <FiltersBar />
            <ActionButtons />
          </div>

          <DataTable columns={columns} data={data} />

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
    </div>
  );
}

export default DirectorAttendanceReport;
