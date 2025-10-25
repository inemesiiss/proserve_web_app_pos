import { SideBar } from "@/components/admin/SideBar";
import { Button } from "@/components/ui/button";
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
import { Search } from "lucide-react";
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

  // transaction history

  const transactions = [
    {
      id: 1,
      dateOfPurchase: "06/21/24 14:25",
      orNumber: "062124-0036",
      branchName: "Makati",
      amount: 500,
      tax: 55,
      discount: 10,
      cashier: "Superman",
    },
    {
      id: 2,
      dateOfPurchase: "06/21/24 13:25",
      orNumber: "062124-0037",
      branchName: "Ortigas",
      amount: null,
      tax: null,
      discount: 100,
      cashier: null,
    },
    {
      id: 3,
      dateOfPurchase: "06/21/24 13:25",
      orNumber: "062124-0039",
      branchName: "Product replacement",
      amount: null,
      tax: null,
      discount: 100,
      cashier: null,
    },
    {
      id: 4,
      dateOfPurchase: "06/21/24 12:25",
      orNumber: "062124-0042",
      branchName: "Request for product sample",
      amount: null,
      tax: null,
      discount: 100,
      cashier: null,
    },
    {
      id: 5,
      dateOfPurchase: "06/21/24 11:25",
      orNumber: "062124-0043",
      branchName: "Wholesale purchase request",
      amount: null,
      tax: null,
      discount: 100,
      cashier: null,
    },
    {
      id: 6,
      dateOfPurchase: "06/21/24 10:25",
      orNumber: "062124-0044",
      branchName: "Wholesale purchase request",
      amount: null,
      tax: null,
      discount: 100,
      cashier: null,
    },
    {
      id: 7,
      dateOfPurchase: "06/21/24 10:15",
      orNumber: "062124-0045",
      branchName: "Customized order",
      amount: null,
      tax: null,
      discount: 100,
      cashier: null,
    },
  ];

  const products = [
    {
      id: 1,
      category: "Food",
      product: "Rice (25kg sack)",
      beginning: 0,
      added: 500,
      deducted: 55,
      current: 445,
      branch: "Downtown",
    },
    {
      id: 2,
      category: "Beverage",
      product: "Bottled Water (1L)",
      beginning: 100,
      added: 300,
      deducted: 120,
      current: 280,
      branch: "Uptown",
    },
    {
      id: 3,
      category: "Snack",
      product: "Potato Chips (50g)",
      beginning: 50,
      added: 200,
      deducted: 75,
      current: 175,
      branch: "Central Market",
    },
    {
      id: 4,
      category: "Food",
      product: "Pasta (1kg)",
      beginning: 20,
      added: 150,
      deducted: 40,
      current: 130,
      branch: "East Side",
    },
    {
      id: 5,
      category: "Beverage",
      product: "Orange Juice (1L)",
      beginning: 60,
      added: 200,
      deducted: 90,
      current: 170,
      branch: "West End",
    },
    {
      id: 6,
      category: "Dairy",
      product: "Fresh Milk (1L)",
      beginning: 30,
      added: 250,
      deducted: 180,
      current: 100,
      branch: "Suburban",
    },
    {
      id: 7,
      category: "Food",
      product: "Bread Loaf",
      beginning: 10,
      added: 100,
      deducted: 45,
      current: 65,
      branch: "Downtown",
    },
  ];

  const components = [
    {
      id: 1,
      category: "Food",
      product: "Rice (25kg sack)",
      amount: 1250,
      quantity: 500,
      branch: "Downtown",
    },
    {
      id: 2,
      category: "Beverage",
      product: "Mineral Water (1L)",
      amount: 300,
      quantity: 800,
      branch: "Uptown",
    },
    {
      id: 3,
      category: "Snack",
      product: "Potato Chips (50g)",
      amount: 150,
      quantity: 400,
      branch: "Central Market",
    },
    {
      id: 4,
      category: "Food",
      product: "Instant Noodles (80g)",
      amount: 220,
      quantity: 1000,
      branch: "East Side",
    },
    {
      id: 5,
      category: "Beverage",
      product: "Orange Juice (1L)",
      amount: 450,
      quantity: 350,
      branch: "West End",
    },
    {
      id: 6,
      category: "Dairy",
      product: "Fresh Milk (1L)",
      amount: 520,
      quantity: 600,
      branch: "Suburban",
    },
    {
      id: 7,
      category: "Food",
      product: "Bread Loaf",
      amount: 300,
      quantity: 250,
      branch: "Downtown",
    },
  ];

  const attendance = [
    {
      id: 1,
      name: "John Doe",
      branch: "Manila",
      timeIn: "7:00 am",
      breakOut: "11:00 am",
      breakIn: "12:00 pm",
      timeOut: "4:00 pm",
      total: 8,
    },
    {
      id: 2,
      name: "Jane Smith",
      branch: "Cebu",
      timeIn: "8:00 am",
      breakOut: "12:00 pm",
      breakIn: "1:00 pm",
      timeOut: "5:00 pm",
      total: 8,
    },
    {
      id: 3,
      name: "Carlos Reyes",
      branch: "Davao",
      timeIn: "6:30 am",
      breakOut: "10:30 am",
      breakIn: "11:30 am",
      timeOut: "3:30 pm",
      total: 8,
    },
    {
      id: 4,
      name: "Maria Santos",
      branch: "Quezon City",
      timeIn: "9:00 am",
      breakOut: "1:00 pm",
      breakIn: "2:00 pm",
      timeOut: "6:00 pm",
      total: 8,
    },
    {
      id: 5,
      name: "Leo Cruz",
      branch: "Makati",
      timeIn: "7:30 am",
      breakOut: "11:30 am",
      breakIn: "12:30 pm",
      timeOut: "4:30 pm",
      total: 8,
    },
    {
      id: 6,
      name: "Anna Rivera",
      branch: "Baguio",
      timeIn: "8:00 am",
      breakOut: "12:00 pm",
      breakIn: "1:00 pm",
      timeOut: "5:00 pm",
      total: 8,
    },
    {
      id: 7,
      name: "Mark Villanueva",
      branch: "Taguig",
      timeIn: "6:45 am",
      breakOut: "10:45 am",
      breakIn: "11:45 am",
      timeOut: "3:45 pm",
      total: 8,
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
          <div className="flex flex-col gap-2 pr-10 pb-10">
            <div className="p-6 border rounded-2xl">
              <div className="pb-4">
                <span className="font-bold text-xl">Transaction History</span>
              </div>

              <div className="flex pb-4 justify-between">
                <div className="flex gap-4 ">
                  <span className="text-green-600 font-bold underline">
                    Completed (12)
                  </span>
                  <span>Refund</span>
                </div>
                <div className="grid w-xs items-center gap-1">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search" className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
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
                    <Label>Agent</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Hourly" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="cagent_all">All Agents</SelectItem>
                          <SelectItem value="agent_1">Agent 1</SelectItem>
                          <SelectItem value="agent_2">Agent 2</SelectItem>
                          <SelectItem value="agent_3">Agent 3</SelectItem>
                          <SelectItem value="agent_4">Agent 4</SelectItem>
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

                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#379AE6FF] hover:bg-[#1e83d0]">
                        Download CSV
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#1DD75BFF] hover:bg-[#04ab3c]">
                        Print Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-6">
                <Table className="border ">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date of Purchase</TableHead>
                      <TableHead>OR Number</TableHead>
                      <TableHead>Branch Name</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead>Cashier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-medium">
                          {tr.dateOfPurchase}
                        </TableCell>
                        <TableCell>{tr.orNumber}</TableCell>
                        <TableCell>{tr.branchName}</TableCell>
                        <TableCell className="text-right">
                          {tr.amount}
                        </TableCell>
                        <TableCell className="text-right">{tr.tax}</TableCell>
                        <TableCell className="text-right">
                          {tr.discount}
                        </TableCell>
                        <TableCell>{tr.cashier}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>7 records</TableCell>
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

          <div className="flex flex-col gap-2 pr-10 pb-10">
            <div className="p-6 border rounded-2xl">
              <div className="pb-4">
                <span className="font-bold text-xl">Inventory Report</span>
              </div>

              <div className="flex pb-4 justify-between">
                <div className="flex gap-4 ">
                  <span className="text-green-600 font-bold underline">
                    Product (52)
                  </span>
                  <span>Component</span>
                </div>
                <div className="grid w-xs items-center gap-1">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search" className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="grid max-w-xs items-center gap-1 ">
                    <Label htmlFor="date">Category</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="category_all">
                            All Category
                          </SelectItem>
                          <SelectItem value="category_1">Category 1</SelectItem>
                          <SelectItem value="category_2">Category 2</SelectItem>
                          <SelectItem value="category_3">Category 3</SelectItem>
                          <SelectItem value="category_4">Category 4</SelectItem>
                          <SelectItem value="category_5">Category 5</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid  max-w-xs items-center gap-1">
                    <Label htmlFor="branch">Product</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="product_all">
                            All Product
                          </SelectItem>
                          <SelectItem value="product_1">Product 1</SelectItem>
                          <SelectItem value="product_2">Product 2</SelectItem>
                          <SelectItem value="product_3">Product 3</SelectItem>
                          <SelectItem value="product_4">Product 4</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid max-w-xs items-center gap-1">
                    <Label>Branches</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="branch_all">
                            All Branches
                          </SelectItem>
                          <SelectItem value="branch_1">Branch 1</SelectItem>
                          <SelectItem value="branch_2">Branch 2</SelectItem>
                          <SelectItem value="branch_3">Branch 3</SelectItem>
                          <SelectItem value="branch_4">Branch 4</SelectItem>
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

                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#379AE6FF] hover:bg-[#1e83d0]">
                        Download CSV
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#1DD75BFF] hover:bg-[#04ab3c]">
                        Print Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-6">
                <Table className="border ">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Beginning</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Deducted</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Branch</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-medium">
                          {tr.category}
                        </TableCell>
                        <TableCell>{tr.product}</TableCell>
                        <TableCell>{tr.beginning}</TableCell>
                        <TableCell>{tr.added}</TableCell>
                        <TableCell>{tr.deducted}</TableCell>
                        <TableCell>{tr.current}</TableCell>
                        <TableCell>{tr.branch}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>7 records</TableCell>
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

          <div className="flex flex-col gap-2 pr-10 pb-10">
            <div className="p-6 border rounded-2xl">
              <div className="flex pb-4 justify-between">
                <span className="font-bold text-xl">Product Mix Report</span>
                <div className="grid w-xs items-center gap-1">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search" className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
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

                  <div className="grid max-w-xs items-center gap-1">
                    <Label>Branches</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="branch_all">
                            All Branches
                          </SelectItem>
                          <SelectItem value="branch_1">Branch 1</SelectItem>
                          <SelectItem value="branch_2">Branch 2</SelectItem>
                          <SelectItem value="branch_3">Branch 3</SelectItem>
                          <SelectItem value="branch_4">Branch 4</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid  max-w-xs items-center gap-1">
                    <Label htmlFor="branch">Product</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="product_all">
                            All Product
                          </SelectItem>
                          <SelectItem value="product_1">Product 1</SelectItem>
                          <SelectItem value="product_2">Product 2</SelectItem>
                          <SelectItem value="product_3">Product 3</SelectItem>
                          <SelectItem value="product_4">Product 4</SelectItem>
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

                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#379AE6FF] hover:bg-[#1e83d0]">
                        Download CSV
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#1DD75BFF] hover:bg-[#04ab3c]">
                        Print Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-6">
                <Table className="border ">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Branch</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {components.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-medium">
                          {tr.category}
                        </TableCell>
                        <TableCell>{tr.product}</TableCell>
                        <TableCell>{tr.amount}</TableCell>
                        <TableCell>{tr.quantity}</TableCell>
                        <TableCell>{tr.branch}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>7 records</TableCell>
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

          <div className="flex flex-col gap-2 pr-10 pb-20">
            <div className="p-6 border rounded-2xl">
              <div className="flex pb-4 justify-between">
                <span className="font-bold text-xl">
                  Agents Attendance Report
                </span>
                <div className="grid w-xs items-center gap-1">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search" className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
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

                  <div className="grid max-w-xs items-center gap-1">
                    <Label>Branches</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="branch_all">
                            All Branches
                          </SelectItem>
                          <SelectItem value="branch_1">Branch 1</SelectItem>
                          <SelectItem value="branch_2">Branch 2</SelectItem>
                          <SelectItem value="branch_3">Branch 3</SelectItem>
                          <SelectItem value="branch_4">Branch 4</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid max-w-xs items-center gap-1">
                    <Label>Agent</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Hourly" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="cagent_all">All Agents</SelectItem>
                          <SelectItem value="agent_1">Agent 1</SelectItem>
                          <SelectItem value="agent_2">Agent 2</SelectItem>
                          <SelectItem value="agent_3">Agent 3</SelectItem>
                          <SelectItem value="agent_4">Agent 4</SelectItem>
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

                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#379AE6FF] hover:bg-[#1e83d0]">
                        Download CSV
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="grid  max-w-xs items-center gap-1">
                      <Label>&nbsp;</Label>
                      <Button className="bg-[#1DD75BFF] hover:bg-[#04ab3c]">
                        Print Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-6">
                <Table className="border ">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name of Agent</TableHead>
                      <TableHead>Assigned Branch</TableHead>
                      <TableHead>Time-in</TableHead>
                      <TableHead>Break-out</TableHead>
                      <TableHead>Break-in</TableHead>
                      <TableHead>Time-out</TableHead>
                      <TableHead>No. of hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((tr) => (
                      <TableRow key={tr.id}>
                        <TableCell className="font-medium">{tr.name}</TableCell>
                        <TableCell>{tr.branch}</TableCell>
                        <TableCell>{tr.timeIn}</TableCell>
                        <TableCell>{tr.breakOut}</TableCell>
                        <TableCell>{tr.breakIn}</TableCell>
                        <TableCell>{tr.timeOut}</TableCell>
                        <TableCell>{tr.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>7 records</TableCell>
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
    </>
  );
}

export default AdminReports;
