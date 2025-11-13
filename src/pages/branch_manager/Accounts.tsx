import { useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import AccountActionButtons from "@/components/admin/table/AccountActionButtons";
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

// Mock data for accounts
const accountData = [
  {
    account: "Pasta Machine",
    contactPerson: "Alma Reyes",
    startDate: "Dec 25, 2023",
    endDate: "Dec 25, 2024",
    renewalDate: "Dec 25, 2024",
    plan: "Standard",
    noOfLicenses: "10",
  },
  {
    account: "Burger Machine",
    contactPerson: "Tessa Acuna",
    startDate: "Dec 25, 2023",
    endDate: "Dec 25, 2024",
    renewalDate: "Dec 25, 2024",
    plan: "Standard",
    noOfLicenses: "10",
  },
  {
    account: "",
    contactPerson: "",
    startDate: "",
    endDate: "",
    renewalDate: "",
    plan: "",
    noOfLicenses: "",
  },
  {
    account: "",
    contactPerson: "",
    startDate: "",
    endDate: "",
    renewalDate: "",
    plan: "",
    noOfLicenses: "",
  },
  {
    account: "",
    contactPerson: "",
    startDate: "",
    endDate: "",
    renewalDate: "",
    plan: "",
    noOfLicenses: "",
  },
];

const accountColumns = [
  { key: "account", label: "Account" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "renewalDate", label: "Renewal Date" },
  { key: "plan", label: "Plan" },
  { key: "noOfLicenses", label: "No of Licenses" },
  { key: "edit", label: "EDIT" },
];

function BMAccounts() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);
  const [accountFilter, setAccountFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

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

  const handleAddAccount = () => {
    console.log("Add Account clicked");
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleGo = () => {
    console.log("Go clicked with filters:", accountFilter, planFilter);
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
            Account Management
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <AccountActionButtons
              onAddAccount={handleAddAccount}
              onImportCSV={handleImportCSV}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="pasta">Pasta Machine</SelectItem>
                  <SelectItem value="burger">Burger Machine</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
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
              placeholder="Search Account"
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              containerClassName="w-72"
            />
          </div>

          <DataTable columns={accountColumns} data={accountData} />

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

export default BMAccounts;
