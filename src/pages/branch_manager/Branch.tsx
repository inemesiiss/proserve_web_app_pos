import { useEffect, useState } from "react";
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
import { useGetBranchListQuery, useGetClientsQuery } from "@/store/api/Admin";
import type { IdName } from "@/components/admin/modals/AddAccountModal";
import { PencilLine } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  { key: "client", label: "Account Name" },
  { key: "code", label: "Branch Code" },
  { key: "name", label: "Branch" },
  { key: "address", label: "ADDRESS" },
  { key: "status", label: "ACTIVE" },
  { key: "edit", label: "EDIT" },
];

function BMBranch() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [useShowMore] = useState(false);
  const [accountFilter, setAccountFilter] = useState("0");
  const [accountFilter1, setAccountFilter1] = useState("0");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [branchData, setBranchData] = useState([]);

  const [type, setType] = useState(1);
  const [data, setData] = useState();

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
    setAccountFilter1(accountFilter);
  };

  const handleDownloadCSV = () => {
    console.log("Download CSV clicked");
  };

  const handleSubmitBranch = (data: any) => {
    console.log("New branch data:", data);
    // Add your API call here to save the branch
  };

  const getClientDropdown = useGetClientsQuery({});

  const getBranches = useGetBranchListQuery({
    search: searchQuery,
    id: accountFilter1,
    page: currentPage,
    pageSize: pageSize,
  });
  //   console.log("Clients: ", getClients?.data?.data);

  useEffect(() => {
    if (getBranches.isSuccess && getBranches.data) {
      let data = getBranches?.data?.results;
      const updated = data.map((item: any) => ({
        ...item,
        client: getClientDropdown?.data?.data.find(
          (item1: any) => item1.id === item.client
        ).name,
        address: item.block_no + " " + item.subdivision + " " + item.street,
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

      setBranchData(updated);
      setTotalPages(Math.ceil(getBranches?.data?.count / pageSize));
      setCount(getBranches.data.count);
    }
  }, [getBranches.isSuccess, getBranches.data]);

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
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Department" />
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
              placeholder="Search Branch"
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
            totalItems={count}
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
        type={type}
        setType={setType}
        data={data}
      />
    </div>
  );
}

export default BMBranch;
