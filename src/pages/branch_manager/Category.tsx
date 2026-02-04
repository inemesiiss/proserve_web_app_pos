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
import CategoryActionButtons from "@/components/admin/table/CategoryActionButtons";
import AddCategoryModal from "@/components/admin/modals/AddCategoryModal";
import { useGetCategoriesQuery, useGetClientsQuery } from "@/store/api/Admin";
import { PencilLine } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { IdName } from "@/components/admin/modals/AddAccountModal";
import UploadCategoryModal from "@/components/admin/modals/UploadCategoryModal";

const productColumns = [
  { key: "client", label: "Client Name" },
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
  { key: "edit", label: "EDIT" },
];

function BMCategory() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [useShowMore] = useState(false);
  // const [clientFilter, setClientFilter] = useState("");

  const [categoryData, setCategoryData] = useState([]);

  const [client, setClient] = useState("0");
  const [client1, setClient1] = useState("0");

  const [type, setType] = useState(1);
  const [data, setData] = useState();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpModalOpen, setIsUpModalOpen] = useState(false);

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
    // console.log("Import CSV clicked");
    setIsUpModalOpen(true);
  };

  const handleGo = () => {
    setClient1(client);
  };

  const handleDownloadCSV = () => {
    console.log("Download CSV clicked");
  };

  const handleSubmitProduct = () => {
    // console.log("New branch data:", data);
    // Add your API call here to save the branch
  };

  const getClientDropdown = useGetClientsQuery({});

  const getCategory = useGetCategoriesQuery({
    search: searchQuery,
    id: client1,
    page: currentPage,
    pageSize: pageSize,
  });

  useEffect(() => {
    if (getCategory.isSuccess && getCategory.data) {
      let data = getCategory?.data?.results;
      const updated = data.map((item: any) => ({
        ...item,
        client: getClientDropdown?.data?.data.find(
          (item1: any) => item1.id === item.client,
        ).name,
        status: (
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-none"
          >
            <Checkbox checked={item.status === 1} />
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

      setCategoryData(updated);
      setTotalPages(Math.ceil(getCategory?.data?.count / pageSize));
      setCount(getCategory.data.count);
    }
  }, [getCategory.isSuccess, getCategory.data]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Category
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <CategoryActionButtons
              onAddProduct={handleAddProduct}
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
              placeholder="Search Category"
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              containerClassName="w-72"
            />
          </div>

          <DataTable columns={productColumns} data={categoryData} />

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
      <AddCategoryModal
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

      <UploadCategoryModal
        isOpen={isUpModalOpen}
        onClose={() => {
          setIsUpModalOpen(false);
        }}
        onSubmit={handleSubmitProduct}
        type={type}
      />
    </div>
  );
}

export default BMCategory;
