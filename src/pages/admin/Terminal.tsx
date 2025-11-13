import { useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import TerminalActionButtons from "@/components/admin/table/TerminalActionButtons";
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

// Mock data for terminals
const terminalData = [
  {
    terminalId: "SN-8997464993303",
    branchCode: "001",
    branchName: "Branch 1",
    renewalDate: "Dec 25, 2024",
    accountName: "Brent Gas",
    active: true,
  },
  {
    terminalId: "SN-8997464993303",
    branchCode: "002",
    branchName: "Product 2",
    renewalDate: "Dec 25, 2024",
    accountName: "Onetech",
    active: true,
  },
  {
    terminalId: "SN-8997464993303",
    branchCode: "003",
    branchName: "Product 3",
    renewalDate: "Dec 25, 2024",
    accountName: "Brent Gas",
    active: true,
  },
  {
    terminalId: "SN-8997464993303",
    branchCode: "004",
    branchName: "Product 4",
    renewalDate: "Dec 25, 2024",
    accountName: "Aristocrat",
    active: true,
  },
  {
    terminalId: "SN-8997464993303",
    branchCode: "005",
    branchName: "Product 5",
    renewalDate: "Dec 25, 2024",
    accountName: "Globe",
    active: true,
  },
];

const terminalColumns = [
  { key: "terminalId", label: "Terminal ID" },
  { key: "branchCode", label: "Branch Code" },
  { key: "branchName", label: "Branch Name" },
  { key: "renewalDate", label: "Renewal Date" },
  { key: "accountName", label: "Account Name" },
  { key: "active", label: "ACTIVE" },
  { key: "edit", label: "EDIT" },
];

function AdminTerminal() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);
  const [accountFilter, setAccountFilter] = useState("");

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

  const handleAddTerminal = () => {
    console.log("Add Terminal clicked");
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleGo = () => {
    console.log("Go clicked with filter:", accountFilter);
  };

  const handleDownloadCSV = () => {
    console.log("Download CSV clicked");
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
            Terminal Management
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <TerminalActionButtons
              onAddTerminal={handleAddTerminal}
              onImportCSV={handleImportCSV}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Account Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="brent-gas">Brent Gas</SelectItem>
                  <SelectItem value="onetech">Onetech</SelectItem>
                  <SelectItem value="aristocrat">Aristocrat</SelectItem>
                  <SelectItem value="globe">Globe</SelectItem>
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

          <DataTable columns={terminalColumns} data={terminalData} />

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

export default AdminTerminal;
