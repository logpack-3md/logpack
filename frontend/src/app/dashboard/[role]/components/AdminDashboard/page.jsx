"use client"
import SidebarAdmin from "@/components/layout/sidebar-admin";
import { ListUsers } from "@/components/ListUsers/page";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


import { useState } from "react";

export default function AdminDashboard() {
  // Estado 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0000005d] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <SidebarAdmin isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">
        <ListUsers />
      </div>

    </>
  );
}
