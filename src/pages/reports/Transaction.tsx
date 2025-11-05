import { useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import TabsHeader from "@/components/admin/table/Tabs";
import FiltersBar from "@/components/admin/table/Filters";
import ActionButtons from "@/components/admin/table/Buttons";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import { reportNavs } from "@/navigations/ReportNavigations";

const data = [
  {
    date: "06/21/24 14:25",
    or: "062124-0036",
    branch: "Makati",
    amount: 500,
    tax: 55,
    discount: 10,
    cashier: "Superman",
  },
  {
    date: "06/21/24 13:25",
    or: "062124-0037",
    branch: "Ortigas",
    amount: 100,
    tax: "",
    discount: 100,
    cashier: "",
  },
];

const columns = [
  { key: "date", label: "Date of Purchase" },
  { key: "or", label: "OR Number" },
  { key: "branch", label: "Branch Name" },
  { key: "amount", label: "Amount" },
  { key: "tax", label: "Tax" },
  { key: "discount", label: "Discount" },
  { key: "cashier", label: "Cashier" },
];

function ReportTransaction() {
  const [activeTab, setActiveTab] = useState("completed");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false); // Changed to false to show pagination

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
    // Load more data logic here
    console.log("Loading more data...");
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar navs={reportNavs} onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Transaction Sale</h1>

          <div className="flex items-center justify-between mb-4">
            <TabsHeader
              tabs={[
                { value: "completed", label: "Completed (12)" },
                { value: "refund", label: "Refund" },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
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
export default ReportTransaction;
