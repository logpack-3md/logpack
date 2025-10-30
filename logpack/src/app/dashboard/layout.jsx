// app/(dashboard)/layout.jsx
import { SidebarAdmin } from "@/components/dashboard/Sidebar/SidebarAdmin";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixa */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gray-100 border-r border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 z-50">
        <SidebarAdmin />
      </aside>
      {/* Conteúdo principal com margem */}
      <main className="flex-1 ml-64 p-6 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}