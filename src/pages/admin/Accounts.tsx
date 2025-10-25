import { SideBar } from "@/components/admin/SideBar";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/ui/CustomDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, PencilLine, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AdminAccounts() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);

  const [event, setEvent] = useState(0);
  const [addOpen, setAddOpen] = useState(false);

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

  const accounts = [
    {
      id: 1,
      account: "Pasta Machine",
      cperson: "Alma Reyes",
      s_date: "December 20, 2023",
      e_date: "December 25, 2024",
      r_date: "December 25, 2024",
      plan: "Standard",
      licesnse: 10,
    },
    {
      id: 1,
      account: "Burger Machine",
      cperson: "Tessa Acuna",
      s_date: "December 20, 2023",
      e_date: "December 25, 2024",
      r_date: "December 25, 2024",
      plan: "Standard",
      licesnse: 10,
    },
  ];

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
          <div className="flex flex-col gap-2 pr-10 py-10">
            <div className="p-6 border rounded-2xl">
              <div className="flex justify-between pb-4">
                <div>
                  <span className="font-bold text-xl">
                    List of All Accounts
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Button
                        className="bg-[#1DD75BFF] hover:bg-[#04ab3c]"
                        onClick={() => {
                          setEvent(1);
                          setAddOpen(true);
                        }}
                      >
                        <Plus />
                        Add Account
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Button className="bg-[#379AE6FF] hover:bg-[#1e83d0]">
                        Import CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="grid max-w-xs items-center gap-1 ">
                    <Label htmlFor="date">Account</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Accounts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">All Accounts</SelectItem>
                          <SelectItem value="1">Pasta Machine</SelectItem>
                          <SelectItem value="2">Burger MAchine</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid  max-w-xs items-center gap-1">
                    <Label htmlFor="branch">Plan</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Plans" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">All Plan</SelectItem>
                          <SelectItem value="1">Standart</SelectItem>
                          <SelectItem value="2">Premium</SelectItem>
                          <SelectItem value="3">Premium 1</SelectItem>
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

                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#379AE6FF] hover:bg-[#1e83d0]">
                        Download CSV
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="grid w-xs items-center gap-1">
                    <Label>&nbsp;</Label>
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search Account"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-6">
                <Table className="border ">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Renewal Date</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>No. of Licenses</TableHead>
                      <TableHead>Edit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-medium">
                          {tr.account}
                        </TableCell>
                        <TableCell>{tr.cperson}</TableCell>
                        <TableCell>{tr.s_date}</TableCell>
                        <TableCell>{tr.e_date}</TableCell>
                        <TableCell>{tr.r_date}</TableCell>
                        <TableCell>{tr.plan}</TableCell>
                        <TableCell>{tr.licesnse}</TableCell>
                        <TableCell>
                          <PencilLine
                            size={18}
                            onClick={() => {
                              setEvent(2);
                              setAddOpen(true);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>{accounts.length} records</TableCell>
                      <TableCell colSpan={7} className="text-right">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#" isActive>
                                2
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationNext href="#" />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>

      {addOpen && (
        <CustomDialog
          close={setAddOpen}
          title={""}
          width={`!w-[60vw] `}
          height={``}
          closeIcon={`N`}
          button={``}
          bgColor="rgba(0, 0, 0, 0.5)"
        >
          <div>
            <div className="flex gap-2 pb-6">
              <Building2 size={22} />{" "}
              <span className="font-bold">
                {event === 1 ? `Add` : `Edit`} Account
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Account Name</Label>
                <Input type="text" placeholder="Account Name" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Start Date</Label>
                <Input type="date" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Contact Person</Label>
                <Input type="text" placeholder="Contact Person" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">End Date</Label>
                <Input type="date" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Email</Label>
                <Input type="text" placeholder="Email" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Date of Renewal</Label>
                <Input type="date" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Plan Subscription</Label>
                <Input type="text" placeholder="Email" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Contract Term</Label>
                <Input type="text" placeholder="1 year" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Theme</Label>
                <Input type="text" placeholder="Email" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">No. of Licenses</Label>
                <Input type="text" placeholder="10" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Company Logo</Label>
                <Input type="text" />
              </div>
            </div>

            <div className="flex gap-4 py-4 pt-12 justify-center">
              <Button
                className="bg-[#cccccc] hover:bg-[#a3a3a3] text-black"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#379AE6FF] hover:bg-[#1e83d0]"
                onClick={() => setAddOpen(false)}
              >
                {event === 1 ? `Save` : `Update`} and Close
              </Button>
            </div>
          </div>
        </CustomDialog>
      )}
    </>
  );
}

export default AdminAccounts;
