import { SideBar } from "@/components/admin/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";

function Admin() {
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
      <SidebarProvider className="bg-green-200 flex">
        <SideBar ref={sidebarRef} />
        <div
          className={`bg-red-100 w-full h-screen `}
          style={{
            paddingLeft: `${sidebarWidth + 50}px`,
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          asd
        </div>
      </SidebarProvider>
    </>
  );
}

export default Admin;
