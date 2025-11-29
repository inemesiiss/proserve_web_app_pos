import { useEffect, useState } from "react";
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
import {
  useGetClientsListQuery,
  useGetClientsQuery,
  useGetSubscriptionQuery,
} from "@/store/api/Admin";
import AddAccountModal, {
  type IdName,
} from "@/components/admin/modals/AddAccountModal";
import { PencilLine } from "lucide-react";

const accountColumns = [
  { key: "name", label: "Account" },
  { key: "c_person", label: "Contact Person" },
  { key: "start_date", label: "Start Date" },
  { key: "end_date", label: "End Date" },
  { key: "renewal", label: "Renewal Date" },
  { key: "subscription_n", label: "Plan" },
  { key: "no_license", label: "No of Licenses" },
  { key: "edit", label: "EDIT" },
];

function BMAccounts() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [useShowMore] = useState(false);
  const [accountFilter, setAccountFilter] = useState("0");
  const [planFilter, setPlanFilter] = useState("0");
  const [accountFilter1, setAccountFilter1] = useState("0");
  const [planFilter1, setPlanFilter1] = useState("0");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [accountData, setAccountData] = useState([]);

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

  const handleAddAccount = () => {
    setIsAddModalOpen(true);
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleGo = () => {
    setAccountFilter1(accountFilter);
    setPlanFilter1(planFilter);
  };

  const handleDownloadCSV = () => {
    console.log("Download CSV clicked");
  };

  const handleSubmitAccount = (data: any) => {
    console.log("New Account data:", data);
    // Add your API call here to save the branch
  };

  const getSubscription = useGetSubscriptionQuery({});
  const getClientDropdown = useGetClientsQuery({});
  const getClients = useGetClientsListQuery({
    search: searchQuery,
    type: planFilter1,
    id: accountFilter1,
    page: currentPage,
    pageSize: pageSize,
  });
  console.log("Clients: ", getClients?.data?.data);

  useEffect(() => {
    if (getClients.isSuccess && getClients.data) {
      let data = getClients?.data?.results;
      const updated = data.map((item: any) => ({
        ...item,
        edit: (
          <PencilLine
            size={18}
            className="cursor-pointer text-orange-500"
            onClick={() => {
              // setEvent(2);
              // setAddOpen(true);
              setType(2);
              setData(item);
              setIsAddModalOpen(true);
            }}
          />
        ),
      }));

      setAccountData(updated);
      setTotalPages(Math.ceil(getClients?.data?.count / pageSize));
      setCount(getClients.data.count);
    }
  }, [getClients.isSuccess, getClients.data]);

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
                  <SelectItem value="0">All Accounts</SelectItem>
                  {getClientDropdown?.data?.data.map((item: IdName) => (
                    <SelectItem value={String(item.id)}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Plans</SelectItem>
                  {getSubscription?.data?.data.map((item: IdName) => (
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
            totalItems={count}
            showMore={useShowMore}
            onShowMore={handleShowMore}
            className="mt-6"
          />
        </div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitAccount}
        type={type}
        setType={setType}
        data={data}
      />
    </div>
  );
}

export default BMAccounts;
