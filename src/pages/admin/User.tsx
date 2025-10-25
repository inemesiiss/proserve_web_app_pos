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
import { PencilLine, Plus, Search, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AdminUser() {
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

  const users = [
    {
      id: 1,
      bcode: "001",
      bname: "Branch 1",
      uid: "Lot 8 Block 8 Abraza",
      uprofile: "Admin",
    },
    {
      id: 2,
      bcode: "002",
      bname: "Product 2",
      uid: "Description 2",
      uprofile: "Cashier",
    },
    {
      id: 3,
      bcode: "003",
      bname: "Product 3",
      uid: "Description 3",
      uprofile: "Manager",
    },
    {
      id: 4,
      bcode: "004",
      bname: "Product 4",
      uid: "Description 4",
      uprofile: "Manager",
    },
    {
      id: 5,
      bcode: "005",
      bname: "Product 5",
      uid: "Description 5",
      uprofile: "Cashier",
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
                  <span className="font-bold text-xl">List of All Users</span>
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
                        Add User
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

                  <div className="grid max-w-xs items-center gap-1 ">
                    <Label htmlFor="date">Branch</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">All Branches</SelectItem>
                          <SelectItem value="1">Branch 1</SelectItem>
                          <SelectItem value="2">Branch 2</SelectItem>
                          <SelectItem value="3">Branch 3</SelectItem>
                          <SelectItem value="4">Branch 4</SelectItem>
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
                        placeholder="Search User"
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
                      <TableHead>Branch Code</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>User Profile</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Edit</TableHead>
                      <TableHead>Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-medium">
                          {tr.bcode}
                        </TableCell>
                        <TableCell>{tr.bname}</TableCell>
                        <TableCell>{tr.uid}</TableCell>
                        <TableCell>{tr.uprofile}</TableCell>
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
                        <TableCell>
                          <Trash2
                            size={18}
                            className="text-red-500"
                            onClick={() => setDelOpen(true)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>{users.length} records</TableCell>
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
              <User size={22} />{" "}
              <span className="font-bold">
                {event === 1 ? `Add` : `Edit`} User
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Branch Code</Label>
                <Input type="text" placeholder="Branch Code" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">User ID</Label>
                <Input type="text" placeholder="User ID" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Branch Name</Label>
                <Input type="text" placeholder="Branch Name" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">User Password</Label>
                <Input type="text" placeholder="User Password" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">User Fullname</Label>
                <Input type="text" placeholder="User Fullname" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">User Profile</Label>
                <Input type="text" placeholder="User Profile" />
              </div>

              <div className="grid max-w-md items-center gap-1 ">
                <Label htmlFor="date">Contact Number</Label>
                <Input type="text" placeholder="Contact Number" />
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
            Are you sure you want to delete this user?
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

export default AdminUser;
