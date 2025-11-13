import { useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import BranchActionButtons from "@/components/admin/table/BranchActionButtons";
import AddBranchModal from "@/components/admin/modals/AddBranchModal";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for branches
const branchData = [
  {
    clientName: "Brent Gas",
    branchCode: "001",
    branch: "Branch 1",
    address: "Lot 8 Block 8 Abraza",
    active: true,
  },
  {
    clientName: "Onetech",
    branchCode: "002",
    branch: "Branch 2",
    address: "Description 2",
    active: true,
  },
  {
    clientName: "Brent Gas",
    branchCode: "003",
    branch: "Branch 3",
    address: "Description 3",
    active: true,
  },
  {
    clientName: "Aristocrat",
    branchCode: "004",
    branch: "Branch 4",
    address: "Description 4",
    active: true,
  },
  {
    clientName: "Globe",
    branchCode: "005",
    branch: "Branch 5",
    address: "Description 5",
    active: true,
  },
];

const branchColumns = [
  { key: "clientName", label: "Client Name" },
  { key: "branchCode", label: "Branch Code" },
  { key: "branch", label: "Branch" },
  { key: "address", label: "ADDRESS" },
  { key: "active", label: "ACTIVE" },
  { key: "edit", label: "EDIT" },
];

function AdminBranch() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleAddBranch = () => {
    setIsAddModalOpen(true);
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleGo = () => {
    console.log("Go clicked with filter:", departmentFilter);
  };

  const handleDownloadCSV = () => {
    console.log("Download CSV clicked");
  };

  const handleSubmitBranch = (data: any) => {
    console.log("New branch data:", data);
    // Add your API call here to save the branch
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
            Branch Management
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <BranchActionButtons
              onAddBranch={handleAddBranch}
              onImportCSV={handleImportCSV}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleGo}
              >
                Go
              </Button>

              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleDownloadCSV}
              >
                Download CSV
              </Button>
            </div>

            <Search
              placeholder="Search Product"
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              containerClassName="w-72"
            />
          </div>

          <DataTable columns={branchColumns} data={branchData} />

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

      {/* Add Branch Modal */}
      <AddBranchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitBranch}
      />
    </div>
  );
}

export default AdminBranch;
