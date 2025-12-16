import { useEffect, useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
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
import { useGetClientsQuery, useGetProductsCompQuery } from "@/store/api/Admin";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilLine } from "lucide-react";
import type { IdName } from "@/components/admin/modals/AddAccountModal";
import CompositionActionButtons from "@/components/admin/table/CompositionActionButtons";
import AddCompositionModal from "@/components/admin/modals/AddCompositionModal";

// Mock data for products

const productColumns = [
  { key: "client", label: "Client Name" },
  { key: "categ", label: "Product Category" },
  { key: "prod_name", label: "Product Name" },
  { key: "price", label: "Price" },
  { key: "prod_size", label: "Size / Option" },
  { key: "uom", label: "Unit of Measure" },
  { key: "image", label: "Image" },
  { key: "is_active", label: "ACTIVE" },
  { key: "edit", label: "EDIT" },
];

function BMComposition() {
  const apiDomain = import.meta.env.VITE_API_DOMAIN;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [useShowMore] = useState(false);

  const [type, setType] = useState(1);
  const [data, setData] = useState();

  const [productData, setProductData] = useState([]);

  const [client, setClient] = useState("0");
  const [client1, setClient1] = useState("0");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setIsAddModalOpen(true);
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleGo = () => {
    // console.log("Go clicked with filter:", accountFilter);
    setClient1(client);
  };

  const handleDownloadCSV = () => {
    console.log("Download CSV clicked");
  };

  const handleSubmitProduct = () => {
    // Add your API call here to save the data
  };

  const getClientDropdown = useGetClientsQuery({});

  const getProduct = useGetProductsCompQuery({
    search: searchQuery,
    id: client1,
    page: currentPage,
    pageSize: pageSize,
  });

  useEffect(() => {
    if (getProduct.isSuccess && getProduct.data) {
      let data = getProduct?.data?.results;
      const updated = data.map((item: any) => ({
        ...item,
        client: getClientDropdown?.data?.data.find(
          (item1: any) => item1.id === item.client
        ).name,
        image: (
          <div>
            <img src={apiDomain + item.image} className="w-8 h-8" />
          </div>
        ),
        is_active: (
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-none"
          >
            <Checkbox checked={item.is_active === true} />
          </div>
        ),
        edit: (
          <PencilLine
            size={18}
            className="cursor-pointer text-orange-500"
            onClick={() => {
              setType(2);
              setData(item);
              setIsAddModalOpen(true);
            }}
          />
        ),
      }));

      setProductData(updated);
      setTotalPages(Math.ceil(getProduct?.data?.count / pageSize));
      setCount(getProduct.data.count);
    }
  }, [getProduct.isSuccess, getProduct.data]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Product Composition
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <CompositionActionButtons
              onAddComposition={handleAddProduct}
              onImportCSV={handleImportCSV}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Account Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Accounts</SelectItem>
                  {getClientDropdown?.data?.data.map((item: IdName) => (
                    <SelectItem value={String(item.id)}>{item.name}</SelectItem>
                  ))}
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
            totalItems={count}
            showMore={useShowMore}
            onShowMore={handleShowMore}
            className="mt-6"
          />
        </div>
      </div>

      {/* Add Product Modal */}
      <AddCompositionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setData(undefined);
        }}
        onSubmit={handleSubmitProduct}
        type={type}
        setType={setType}
        data={data}
      />
    </div>
  );
}

export default BMComposition;
