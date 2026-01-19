import { useState } from "react";
import TabsHeader from "@/components/admin/table/Tabs";
import FiltersBar from "@/components/admin/table/Filters";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";

const data = [
  {
    category: "Burgers",
    product: "Jumbo Cheezy Bacon Burger",
    beginning: 2,
    added: 2,
    deducted: 2,
    current: 0,
    branch: "Makati",
  },
  {
    category: "Pasta",
    product: "Product2",
    beginning: 2,
    added: 2,
    deducted: 2,
    current: 0,
    branch: "Ortigas",
  },
  {
    category: "Extras",
    product: "Product3",
    beginning: "",
    added: "",
    deducted: "",
    current: "",
    branch: "",
  },
  {
    category: "0004",
    product: "0004",
    beginning: "",
    added: "",
    deducted: "",
    current: "",
    branch: "",
  },
  {
    category: "0005",
    product: "0005",
    beginning: "",
    added: "",
    deducted: "",
    current: "",
    branch: "",
  },
  {
    category: "0006",
    product: "0006",
    beginning: "",
    added: "",
    deducted: "",
    current: "",
    branch: "",
  },
  {
    category: "0007",
    product: "0007",
    beginning: "",
    added: "",
    deducted: "",
    current: "",
    branch: "",
  },
  {
    category: "0008",
    product: "0008",
    beginning: "",
    added: "",
    deducted: "",
    current: "",
    branch: "",
  },
];

const columns = [
  { key: "category", label: "Category" },
  { key: "product", label: "Product" },
  { key: "beginning", label: "Beginning" },
  { key: "added", label: "Added" },
  { key: "deducted", label: "Deducted" },
  { key: "current", label: "Current" },
  { key: "branch", label: "Branch" },
];

function InventoryReport() {
  const [activeTab, setActiveTab] = useState("product");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);

  // Mock total items - replace with actual data length
  const totalItems = 52;
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Inventory Report
      </h1>

      <div className="flex items-center justify-between mb-4">
        <TabsHeader
          tabs={[
            { value: "product", label: "Product (52)" },
            { value: "component", label: "Component" },
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
        <FiltersBar showClientFilter={false} />
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
  );
}

export default InventoryReport;
