import { SideBar } from "@/components/admin/SideBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MonitorStop, PencilLine, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AdminTerminal() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);

  const [event, setEvent] = useState(0);
  const [delOpen, setDelOpen] = useState(false);
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

  const terminals = [
    {
      id: 1,
      terminal: "SN-8997464993303",
      bcode: "001",
      bname: "Branch 1",
      rdate: "Dec 25, 2024",
      aname: "Brent Gas",
    },
    {
      id: 2,
      terminal: "SN-8997464993303",
      bcode: "002",
      bname: "Product 2",
      rdate: "Dec 25, 2024",
      aname: "Onetech",
    },
    {
      id: 3,
      terminal: "SN-8997464993303",
      bcode: "003",
      bname: "Product 3",
      rdate: "Dec 25, 2024",
      aname: "Brent Gas",
    },
    {
      id: 4,
      terminal: "SN-8997464993303",
      bcode: "004",
      bname: "Product 4",
      rdate: "Dec 25, 2024",
      aname: "Aristocrat",
    },
    {
      id: 5,
      terminal: "SN-8997464993303",
      bcode: "005",
      bname: "Product 5",
      rdate: "Dec 25, 2024",
      aname: "Globe",
    },
  ];

  const handleDelete = () => {
    console.log("Deleted");
  };
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
                    List of All Terminals
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
                        Add Terminal
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
                    <Label htmlFor="date">Account Name</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Accounts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">All Accounts</SelectItem>
                          <SelectItem value="1">Brent Gas</SelectItem>
                          <SelectItem value="2">Aristocrat</SelectItem>
                          <SelectItem value="3">One Tech</SelectItem>
                          <SelectItem value="4">Globe</SelectItem>
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
                        placeholder="Search Terminal"
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
                      <TableHead>Terminal ID</TableHead>
                      <TableHead>Branch Code</TableHead>
                      <TableHead>Branch Name</TableHead>
                      <TableHead>Renewal Date</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Edit</TableHead>
                      {/* <TableHead>Delete</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {terminals.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-medium">
                          {tr.terminal}
                        </TableCell>
                        <TableCell>{tr.bcode}</TableCell>
                        <TableCell>{tr.bname}</TableCell>
                        <TableCell>{tr.rdate}</TableCell>
                        <TableCell>{tr.aname}</TableCell>
                        <TableCell>
                          <Checkbox defaultChecked />
                        </TableCell>
                        <TableCell>
                          <PencilLine
                            size={18}
                            className="text-blue-700"
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
                      <TableCell>{terminals.length} records</TableCell>
                      <TableCell colSpan={6} className="text-right">
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
              <MonitorStop size={22} />{" "}
              <span className="font-bold">
                {event === 1 ? `Add` : `Edit`} Branch Terminal
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Branch Code</Label>
                <Input type="text" placeholder="Branch Code" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Contract Term</Label>
                <Input type="text" placeholder="Contract Term" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Branch Name</Label>
                <Input type="text" placeholder="Branch Name" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">End Date</Label>
                <Input type="date" placeholder="End Date" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">
                  Terminal Id <span className="text-red-500">*</span>
                </Label>
                <Input type="text" placeholder="Terminal Id" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Date of Renewal</Label>
                <Input type="date" placeholder="Date of Renewal" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Start Date</Label>
                <Input type="text" placeholder="Start Date" />
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

      {delOpen && (
        <CustomDialog
          close={() => setDelOpen(false)}
          title={""}
          width={`!w-[30vw] `}
          height={``}
          closeIcon={`N`}
          button={``}
          bgColor="rgba(0, 0, 0, 0.5)"
        >
          <div className="font-bold text-xl text-center">
            Are you sure you want to delete this terminal?
          </div>
          <div className="grid grid-cols-2 gap-4 pt-8">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setDelOpen(false)}
            >
              Yes
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                handleDelete();
                setDelOpen(false);
              }}
            >
              No
            </Button>
          </div>
        </CustomDialog>
      )}
    </>
  );
}

export default AdminTerminal;
