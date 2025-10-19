"use client";

import * as React from "react";
import {
  BookText,
  Building2,
  // CalendarDays,
  // ChevronRight,
  // Clock5,
  Combine,
  LayoutDashboard,
  // Link2,
  // MapPinCheckInside,
  MonitorStop,
  Package,
  // SquareChartGantt,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  // CollapsibleContent,
  // CollapsibleTrigger,
} from "@/components/ui/collapsible";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useColorBranding } from "../reusables/ColorBranding";
import Logo from "@/assets/PROSERVELOGO.png";

// 💡 Convert SideBar to forwardRef
export const SideBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Sidebar>
>((props, ref) => {
  // const apiDomain = import.meta.env.VITE_API_BASE;
  const location = useLocation();
  // const brandColor = localStorage.getItem("color") ?? "black";
  // const textColor = useColorBranding(brandColor);

  const navs = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: <BookText />,
    },
    {
      title: "Account",
      url: "/admin/account",
      icon: <Building2 />,
    },
    {
      title: "Branch",
      url: "/admin/branch",
      icon: <Combine />,
    },
    {
      title: "Terminal",
      url: "/admin/terminal",
      icon: <MonitorStop />,
    },
    {
      title: "User",
      url: "/admin/users",
      icon: <User />,
    },
    {
      title: "Product",
      url: "/admin/product",
      icon: <Package />,
    },
    // {
    //   title: "Events",
    //   url: "#",
    //   icon: <SquareChartGantt />,
    //   items: [
    //     {
    //       title: "All",
    //       url: "/events/all?search=&filter=0&sort=1&loc=&sdate=&edate=",
    //     },
    //     {
    //       title: "Live",
    //       url: "/events/live?search=&filter=0&sort=1&loc=&sdate=&edate=",
    //     },
    //     {
    //       title: "Upcoming",
    //       url: "/events/upcoming?search=&filter=0&sort=3&loc=&sdate=&edate=",
    //     },
    //     {
    //       title: "Completed",
    //       url: "/events/completed?search=&filter=0&sort=1&loc=&sdate=&edate=",
    //     },
    //     {
    //       title: "Canceled",
    //       url: "/events/canceled?search=&filter=0&sort=1&loc=&sdate=&edate=",
    //     },
    //     {
    //       title: "Trash",
    //       url: "/events/trash?search=&filter=0&sort=1&loc=&sdate=&edate=",
    //     },
    //   ],
    // },
  ];

  const isActive = (link: string): boolean => {
    const linkPath = link.split("?")[0];
    return location.pathname === linkPath;
  };

  // const isGroupActive = (item: (typeof navs)[number]) => {
  //   return true;
  // };

  const { state } = useSidebar();
  const isRailMode = state === "collapsed";

  return (
    <>
      <Sidebar collapsible="icon" className="bg-gray-50 p-2">
        <div ref={ref} className="flex flex-col p-4">
          <SidebarHeader>
            <div className="flex gap-2">
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {/* <img src={apiDomain + localStorage.getItem("logo")} /> */}
                <img src={Logo} />
              </div>
              <div className="flex flex-1 text-left text-lg leading-tight items-center gap-1">
                <span className="truncate font-bold">
                  {!isRailMode && `Project Name`}
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {navs.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    // defaultOpen={isGroupActive(item)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      {/* {item?.items?.length || 0 > 0 ? (
                        isRailMode ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <SidebarMenuButton tooltip={item.title}>
                                {item.icon}
                              </SidebarMenuButton>
                            </PopoverTrigger>
                            <PopoverContent side="right" className="w-48 p-2">
                              <div className="flex flex-col space-y-1">
                                {item.items?.map((subItem) => (
                                  <Link to={subItem.url} key={subItem.title}>
                                    <SidebarMenuSubButton
                                      className={`flex w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 ${
                                        isActive(subItem.url) &&
                                        "bg-gray-500 text-white"
                                      }`}
                                    >
                                      {subItem.title}
                                    </SidebarMenuSubButton>
                                  </Link>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isGroupActive(item)}
                            className="group/collapsible"
                          >
                            <div>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                  {item.icon}
                                  <span>{item.title}</span>
                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {item.items?.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <Link to={subItem.url}>
                                        <SidebarMenuSubButton
                                          asChild
                                          className={`${
                                            isActive(subItem.url)
                                              ? "bg-gray-500 text-white hover:text-gray-100 hover:bg-gray-500"
                                              : ""
                                          }`}
                                        >
                                          <span>{subItem.title}</span>
                                        </SidebarMenuSubButton>
                                      </Link>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        )
                      ) : ( */}
                      <Link to={item.url}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={`${
                            isActive(item.url)
                              ? "bg-[#dcdcfc] text-[#636ae8] hover:bg-[#dcdcfc] hover:text-[#636ae8]"
                              : "hover:bg-[#dcdcfc] hover:text-[#636ae8]"
                          }`}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                      {/* )} */}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
          <SidebarRail />
        </div>
      </Sidebar>
      <div className="flex-1">{props.children}</div>
    </>
  );
});

// Add displayName for better devtools experience
SideBar.displayName = "SideBar";
