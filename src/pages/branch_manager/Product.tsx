import { useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import ProductActionButtons from "@/components/admin/table/ProductActionButtons";
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

// Mock data for products
const productData = [
  {
    clientName: "Client 1",
    productCategory: "Category 1",
    productName: "Product 1",
    price: "",
    sizeOption: "",
    unitOfMeasure: "",
    active: true,
  },
  {
    clientName: "Client 2",
    productCategory: "Category 2",
    productName: "Product 2",
    price: "",
    sizeOption: "",
    unitOfMeasure: "",
    active: true,
  },
  {
    clientName: "Client 3",
    productCategory: "",
    productName: "Product 3",
    price: "",
    sizeOption: "",
    unitOfMeasure: "",
    active: true,
  },
  {
    clientName: "Client 4",
    productCategory: "",
    productName: "Product 4",
    price: "",
    sizeOption: "",
    unitOfMeasure: "",
    active: true,
  },
  {
    clientName: "Client 5",
    productCategory: "",
    productName: "Product 5",
    price: "",
    sizeOption: "",
    unitOfMeasure: "",
    active: true,
  },
];

const productColumns = [
  { key: "clientName", label: "Client Name" },
  { key: "productCategory", label: "Product Category" },
  { key: "productName", label: "Product Name" },
  { key: "price", label: "Price" },
  { key: "sizeOption", label: "Size / Option" },
  { key: "unitOfMeasure", label: "Unit of Measure" },
  { key: "active", label: "ACTIVE" },
  { key: "edit", label: "EDIT" },
];

function BMProduct() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);
  const [clientFilter, setClientFilter] = useState("");

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

  const handleAddProduct = () => {
    console.log("Add Product clicked");
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleGo = () => {
    console.log("Go clicked with filter:", clientFilter);
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
            Product Management
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <ProductActionButtons
              onAddProduct={handleAddProduct}
              onImportCSV={handleImportCSV}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Client Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="client1">Client 1</SelectItem>
                  <SelectItem value="client2">Client 2</SelectItem>
                  <SelectItem value="client3">Client 3</SelectItem>
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

          <DataTable columns={productColumns} data={productData} />

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

export default BMProduct;
