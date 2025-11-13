import { useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import FiltersBar from "@/components/admin/table/Filters";
import UserActionButtons from "@/components/admin/table/UserActionButtons";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";

// Mock data for users
const userData = [
  {
    branchCode: "001",
    branch: "Branch 1",
    userId: "Lot 8 Block 8 Abraza",
    userProfile: "Admin",
    active: true,
  },
  {
    branchCode: "002",
    branch: "Product 2",
    userId: "Description 2",
    userProfile: "Cashier",
    active: true,
  },
  {
    branchCode: "003",
    branch: "Product 3",
    userId: "Description 3",
    userProfile: "Manager",
    active: false,
  },
  {
    branchCode: "004",
    branch: "Product 4",
    userId: "Description 4",
    userProfile: "Manager",
    active: true,
  },
  {
    branchCode: "005",
    branch: "Product 5",
    userId: "Description 5",
    userProfile: "Cashier",
    active: true,
  },
];

const userColumns = [
  { key: "branchCode", label: "Branch Code" },
  { key: "branch", label: "Branch" },
  { key: "userId", label: "User ID" },
  { key: "userProfile", label: "User Profile" },
  { key: "active", label: "ACTIVE" },
  { key: "edit", label: "EDIT" },
];

function DirectorUser() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);

  // Mock total items - replace with actual data length
  const totalItems = 100;
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

  const handleAddUser = () => {
    console.log("Add User clicked");
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            User Management
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <UserActionButtons
              onAddUser={handleAddUser}
              onImportCSV={handleImportCSV}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <FiltersBar />
            <Search
              placeholder="Search User"
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              containerClassName="w-72"
            />
          </div>

          <DataTable columns={userColumns} data={userData} />

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

export default DirectorUser;
