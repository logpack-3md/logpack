// app/page.jsx
"use client"
import { SidebarAdmin } from "@/components/dashboard/Sidebar/SidebarAdmin";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <SidebarAdmin
      onDashboardClick={() => router.push("/dashboard")}
      onUsuariosClick={() => router.push("/usuarios")}
    />
  );
}