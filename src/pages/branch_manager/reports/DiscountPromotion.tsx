import { useState } from "react";
import { SideBar } from "@/components/admin/SideBar";
import TabsHeader from "@/components/admin/table/Tabs";
import FiltersBar from "@/components/admin/table/Filters";
import ActionButtons from "@/components/admin/table/Buttons";
import DataTable from "@/components/admin/table/Tables";
import { Search } from "@/components/ui/search";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { reportNavs } from "@/navigattion/ReportNaviation";
import CreatePromotionModal from "@/components/admin/modals/CreatePromotionModal";

const data = [
  {
    code: "SUMMER2024",
    name: "Summer Sale",
    type: "Percentage",
    value: "20%",
    startDate: "06/01/24",
    endDate: "08/31/24",
    status: "Active",
    usedCount: 145,
  },
  {
    code: "WELCOME10",
    name: "Welcome Discount",
    type: "Fixed Amount",
    value: "₱100",
    startDate: "01/01/24",
    endDate: "12/31/24",
    status: "Active",
    usedCount: 523,
  },
  {
    code: "FLASH50",
    name: "Flash Sale",
    type: "Percentage",
    value: "50%",
    startDate: "05/15/24",
    endDate: "05/15/24",
    status: "Expired",
    usedCount: 89,
  },
];

const columns = [
  { key: "code", label: "Promo Code" },
  { key: "name", label: "Discount Name" },
  { key: "type", label: "Discount Type" },
  { key: "value", label: "Discount Value" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "status", label: "Status" },
  { key: "usedCount", label: "Times Used" },
];

function BMDiscountPromotion() {
  const [activeTab, setActiveTab] = useState("active");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [useShowMore] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleCreateDiscount = (data: any) => {
    console.log("Creating discount:", data);
    // Add your discount creation logic here
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideBar navs={reportNavs} onCollapsedChange={setSidebarCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "90px" : "200px" }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Discount & Promotions
            </h1>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Create Promotion
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <TabsHeader
              tabs={[
                { value: "active", label: "Active (8)" },
                { value: "expired", label: "Expired (4)" },
                { value: "scheduled", label: "Scheduled (2)" },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
            <Search
              placeholder="Search promotions..."
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              containerClassName="w-72"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <FiltersBar showClientFilter={false} />
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

      <CreatePromotionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateDiscount}
      />
    </div>
  );
}

export default BMDiscountPromotion;
