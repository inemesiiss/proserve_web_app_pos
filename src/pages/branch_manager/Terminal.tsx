import { useEffect, useState } from "react";
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
import AddTerminalModal from "@/components/admin/modals/AddTerminalModal";
import {
  useGetAllBranchQuery,
  useGetClientsQuery,
  useGetTerminalQuery,
} from "@/store/api/Admin";
import { PencilLine } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { IdName } from "@/components/admin/modals/AddAccountModal";

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
  { key: "terminal_id", label: "Terminal ID" },
  { key: "branchCode", label: "Branch Code" },
  { key: "branchName", label: "Branch Name" },
  { key: "renewal", label: "Renewal Date" },
  { key: "accountName", label: "Account Name" },
  { key: "status", label: "Status" },
  { key: "edit", label: "EDIT" },
];

const handleSubmitBranch = (data: any) => {
  // console.log("New branch data:", data);
  // Add your API call here to save the branch
};

function BMTerminal() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [useShowMore] = useState(false);
  const [accountFilter, setAccountFilter] = useState("");

  const [client, setClient] = useState("0");
  const [client1, setClient1] = useState("0");

  const [branch, setBranch] = useState("0");
  const [branch1, setBranch1] = useState("0");

  const [terminalData, setTerminalData] = useState([]);

  const [type, setType] = useState(1);
  const [data, setData] = useState();

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

  const handleAddTerminal = () => {
    setIsAddModalOpen(true);
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleGo = () => {
    // console.log("Go clicked with filter:", accountFilter);
    setClient1(client);
    setBranch1(branch);
  };

  const handleDownloadCSV = () => {
    console.log("Download CSV clicked");
  };

  const getClientDropdown = useGetClientsQuery({});
  const getBranchDropdown = useGetAllBranchQuery({ cid: client });
  const getTerminal = useGetTerminalQuery({
    search: searchQuery,
    id: client1,
    bid: branch1,
    page: currentPage,
    pageSize: pageSize,
  });

  useEffect(() => {
    if (getTerminal.isSuccess && getTerminal.data) {
      let data = getTerminal?.data?.results;
      const updated = data.map((item: any) => ({
        ...item,
        branchCode: getBranchDropdown?.data?.data.find(
          (item1: any) => item1.id === item.branch
        ).code,
        branchName: getBranchDropdown?.data?.data.find(
          (item1: any) => item1.id === item.branch
        ).name,
        accountName: getClientDropdown?.data?.data.find(
          (item1: any) => String(item1.id) === String(item.client)
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

      setTerminalData(updated);
      setTotalPages(Math.ceil(getTerminal?.data?.count / pageSize));
      setCount(getTerminal.data.count);
    }
  }, [getTerminal.isSuccess, getTerminal.data]);

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

              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Account Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Branches</SelectItem>
                  {getBranchDropdown?.data?.data.map((item: IdName) => (
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
              placeholder="Search Terminal"
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
            totalItems={count}
            showMore={useShowMore}
            onShowMore={handleShowMore}
            className="mt-6"
          />
        </div>
      </div>

      {/* Add Terminal Modal */}
      <AddTerminalModal
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

export default BMTerminal;
