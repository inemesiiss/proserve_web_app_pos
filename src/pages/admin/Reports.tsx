import { SideBar } from "@/components/admin/SideBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";

function AdminReports() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);

  useEffect(() => {
    if (!sidebarRef.current) return;
    const updateWidth = () => {
      const width = sidebarRef.current?.getBoundingClientRect().width || 0;
      setSidebarWidth(width);
    };

    // Initial measurement
    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(sidebarRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <SidebarProvider>
        <SideBar ref={sidebarRef} />
        <div
          className={`w-full h-screen `}
          style={{
            paddingLeft: `${sidebarWidth + 50}px`,
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <div className="flex flex-col gap-2 pr-10 pb-20">
            <div className="pb-2">
              <span className="font-bold text-xl">Transaction History</span>
            </div>

            <div className="flex gap-4 pb-2">
              <span className="text-green-600 font-bold underline">
                Completed (12)
              </span>
              <span>Refund</span>
            </div>

            <div className="flex gap-4">
              <div className="grid max-w-xs items-center gap-1 ">
                <Label htmlFor="date">Date</Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Today" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="c_week">Current Week</SelectItem>
                      <SelectItem value="l_Week">Last Week</SelectItem>
                      <SelectItem value="c_month">Current Month</SelectItem>
                      <SelectItem value="l_month">Last Month</SelectItem>
                      <SelectItem value="custom">Custom Date</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid  max-w-xs items-center gap-1">
                <Label htmlFor="branch">Branch</Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Branches</SelectItem>
                      <SelectItem value="branch_1">Branch 1</SelectItem>
                      <SelectItem value="branch_2">Branch 2</SelectItem>
                      <SelectItem value="branch_3">Branch 3</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid max-w-xs items-center gap-1">
                <Label>Cashier</Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Hourly" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="hourly">Cashier 1</SelectItem>
                      <SelectItem value="daily">Cashier 2</SelectItem>
                      <SelectItem value="weekly">Cashier 3</SelectItem>
                      <SelectItem value="monthly">Cashier 4</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid  max-w-xs items-center gap-1">
                <Label>&nbsp;</Label>
                <Button className="bg-[#EA916EFF] hover:bg-[#ea8259]">
                  Go
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

export default AdminReports;
