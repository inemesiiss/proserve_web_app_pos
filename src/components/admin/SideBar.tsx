"use client";

import * as React from "react";
import {
  BookText,
  Building2,
  Combine,
  LayoutDashboard,
  MonitorStop,
  Package,
  Settings,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible } from "@/components/ui/collapsible";
import { Link, useLocation } from "react-router-dom";

export const SideBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Sidebar>
>((props, ref) => {
  const location = useLocation();

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
    {
      title: "Settings",
      url: "/admin/settings",
      icon: <Settings />,
    },
  ];

  const isActive = (link: string): boolean => {
    const linkPath = link.split("?")[0];
    return location.pathname === linkPath;
  };

  const isGroupActive = (item: (typeof navs)[number]) => {
    console.log(item);
    return true;
  };

  const { state } = useSidebar();
  const isRailMode = state === "collapsed";

  return (
    <>
      <Sidebar collapsible="icon" className="bg-orange-200 w-52">
        <div ref={ref} className="flex flex-col p-4 ">
          <SidebarHeader>
            <div className="flex gap-2">
              {/* <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <img src={Logo} />
              </div> */}
              <div className="flex flex-1 text-left text-lg leading-tight items-center gap-1">
                <span className="truncate font-bold">
                  {!isRailMode && (
                    <span className="text-2xl">
                      <span>PRO</span>
                      <span className="text-[#1DD75BFF]">POS</span>
                    </span>
                  )}
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
                    defaultOpen={isGroupActive(item)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
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
          {/* <SidebarRail /> */}
        </div>
      </Sidebar>
      <div className="flex-1">{props.children}</div>
    </>
  );
});

// Add displayName for better devtools experience
SideBar.displayName = "SideBar";
