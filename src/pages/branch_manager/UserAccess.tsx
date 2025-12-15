import { useEffect, useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import UserActionButtons from "@/components/admin/table/UserActionButtons";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import {
  useGetAllBranchQuery,
  useGetBranchUsersQuery,
  useGetClientsQuery,
} from "@/store/api/Admin";
import { PencilLine } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IdName } from "@/components/admin/modals/AddAccountModal";
import AddUserAccessModal from "@/components/admin/modals/AddUserAccessModal";

const userColumns = [
  { key: "account", label: "Account" },
  { key: "branch", label: "Branch" },
  { key: "fullname", label: "Fullname" },
  //   { key: "password", label: "Password" },
  { key: "status", label: "Status" },
  { key: "edit", label: "Edit" },
];

function BMUserAccess() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [useShowMore] = useState(false);

  const [users, setUsers] = useState([]);

  const [client, setClient] = useState("0");
  // const [client1, setClient1] = useState("0");

  const [branch, setBranch] = useState("0");
  // const [branch1, setBranch1] = useState("0");

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

  const handleAddUser = () => {
    setData(undefined);
    setIsAddModalOpen(true);
  };

  const handleImportCSV = () => {
    console.log("Import CSV clicked");
  };

  const handleSubmitUser = () => {};

  const getClientDropdown = useGetClientsQuery({});
  const getBranchDropdown = useGetAllBranchQuery({ cid: client });

  const getUsers = useGetBranchUsersQuery({
    search: searchQuery,
    id: client,
    bid: branch,
    page: currentPage,
    pageSize: pageSize,
  });

  useEffect(() => {
    if (getUsers.isSuccess && getUsers.data) {
      let data = getUsers?.data?.results;
      const updated = data.map((item: any) => ({
        ...item,
        account: getClientDropdown?.data?.data.find(
          (item1: any) => String(item1.id) === String(item.client)
        ).name,
        branch: getBranchDropdown?.data?.data.find(
          (item1: any) => item1.id === item.branch
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

      setUsers(updated);
      setTotalPages(Math.ceil(getUsers?.data?.count / pageSize));
      setCount(getUsers.data.count);
    }
  }, [getUsers.isSuccess, getUsers.data]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            User Access Management
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <UserActionButtons
              onAddUser={handleAddUser}
              onImportCSV={handleImportCSV}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            {/* <FiltersBar /> */}
            <div className="flex gap-3">
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
            </div>
            <div>
              <Search
                placeholder="Search User"
                value={searchQuery}
                onChange={handleSearch}
                onClear={handleClearSearch}
                containerClassName="w-72"
              />
            </div>
          </div>

          <DataTable columns={userColumns} data={users} />

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

      {/* Add User Modal */}
      <AddUserAccessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitUser}
        type={type}
        setType={setType}
        data={data}
      />
    </div>
  );
}

export default BMUserAccess;
