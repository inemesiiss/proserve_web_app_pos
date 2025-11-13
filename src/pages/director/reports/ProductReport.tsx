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
    category: "Burgers",
    productName: "Product 1",
    amount: 500,
    qty: 55,
    branch: "Pasig",
  },
  {
    category: "Pasta",
    productName: "Product 2",
    amount: "",
    qty: "",
    branch: "Pasig",
  },
  {
    category: "Meal",
    productName: "Product 3",
    amount: "",
    qty: "",
    branch: "Makati",
  },
  {
    category: "Promo",
    productName: "Product 4",
    amount: "",
    qty: "",
    branch: "Makati",
  },
  {
    category: "Promo",
    productName: "Product 5",
    amount: "",
    qty: "",
    branch: "Pasig",
  },
  {
    category: "Burgers",
    productName: "Product 7",
    amount: "",
    qty: "",
    branch: "QC",
  },
  {
    category: "Burgers",
    productName: "Product 8",
    amount: "",
    qty: "",
    branch: "Taguig",
  },
];

const columns = [
  { key: "category", label: "Category" },
  { key: "productName", label: "Product Name" },
  { key: "amount", label: "Amount" },
  { key: "qty", label: "Qty" },
  { key: "branch", label: "Branch" },
];

function DirectorProductMixReport() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);

  const totalItems = 50;
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
          <h1 className="text-2xl font-bold mb-4">Product Mix Report</h1>

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

export default DirectorProductMixReport;
