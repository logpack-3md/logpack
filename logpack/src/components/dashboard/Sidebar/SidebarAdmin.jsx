// components/ui/Sidebar/SidebarAdmin.jsx
"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar.jsx";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CardHoverEffectDemo, projects } from "@/components/dashboard/Card3D/CardHoverDemo.jsx"; // Importando projects
import { GlowingEffectDemo } from "@/components/dashboard/Glowing/GlowingDemo.jsx";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { Input } from "@/components/dashboard/input.jsx";
import { Button } from "@/components/dashboard/button.jsx";
import { Badge } from "@/components/dashboard/badge.jsx";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/dashboard/table.jsx";
import { GlowingEffect } from "@/components/dashboard/Glowing/glowing-effect.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/dashboard/tabs.jsx";

export function SidebarAdmin() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Usuários",
      href: "usuarios",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <div className="p-4 flex justify-end">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">LogPack Dashboard</h2>
          <Tabs defaultValue="value-comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-2">
              <TabsTrigger value="value-comparison">Value Comparison</TabsTrigger>
              <TabsTrigger value="average-values">Average Values</TabsTrigger>
              <TabsTrigger value="configurable-analysis">Configurable Analysis</TabsTrigger>
              <TabsTrigger value="filter-analysis">Filter Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="value-comparison">
              <CardHoverEffectDemo items={[projects[0]]} />
              <OverviewSection />
              <GlowingEffectDemo />
              <div className="grid gap-4 md:grid-cols-2">
                <RecentActivitiesSection />
                <OrderStatusSection />
              </div>
            </TabsContent>
            <TabsContent value="average-values">
              <CardHoverEffectDemo items={[projects[1]]} />
              <AverageValuesContent />
            </TabsContent>
            <TabsContent value="configurable-analysis">
              <CardHoverEffectDemo items={[projects[2]]} />
              <ConfigurableAnalysisContent />
            </TabsContent>
            <TabsContent value="filter-analysis">
              <CardHoverEffectDemo items={[projects[3]]} />
              <FilterAnalysisContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Dashboard
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Componente para Overview com gráficos
const lineData = [
  { name: "Jan", amt: 0 },
  { name: "Feb", amt: 10 },
  { name: "Feb", amt: 20 },
  { name: "Mar", amt: 30 },
  { name: "Apr", amt: 25 },
  { name: "May", amt: 15 },
];

const pieData = [
  { name: "Sale", value: 80 },
  { name: "Distribute", value: 10 },
  { name: "Return", value: 5 },
  { name: "Other", value: 5 },
];

const COLORS = ['oklch(0.6278 0.1129 53.5290)', 'oklch(0.4868 0.0861 53.9016)', '#f56565', '#faf089'];

const OverviewSection = () => {
  return (
    <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      <div className="border-0.75 relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
        <h2 className="text-xl font-bold">Insumos em tempo real</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total de insumos no geral</p>
            <h3 className="text-2xl font-bold">10L/10KG</h3>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reabastecimentos</p>
            <h3 className="text-2xl font-bold">82</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amt" stroke="#a855f7" />
              <Line type="monotone" dataKey="amt" stroke="#fbbf24" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="amt" stroke="#f56565" strokeDasharray="3 4 5 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">80%</p>
              <p className="text-sm text-muted-foreground text-white">Insumos</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-2 rounded-full" />
            <p className="text-sm">Madeira</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <p className="text-sm">Água</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <p className="text-sm">Papel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para Recent Activities
const RecentActivitiesSection = () => {
  return (
    <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      <div className="border-0.75 relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
        <h2 className="text-xl font-bold">Recent Activities</h2>
        <ul className="space-y-4">
          <li className="flex items-center gap-4">
            <Badge variant="secondary">40 Min Ago</Badge>
            <p>Task Updated - Nikolai Updated a Task</p>
          </li>
          <li className="flex items-center gap-4">
            <Badge variant="secondary">1 day ago</Badge>
            <p>Deal Added - Panushi Added a Deal</p>
          </li>
          <li className="flex items-center gap-4">
            <Badge variant="secondary">40 Min Ago</Badge>
            <p>Published Article - Sanashi Published a Article</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Novo OrderStatusSection com tabela manual
const OrderStatusSection = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const data = [
    {
      invoice: "12386",
      customers: "Charity dues",
      from: "Russia",
      price: "$2652",
      status: "Process",
    },
    {
      invoice: "12386",
      customers: "Charity dues",
      from: "Russia",
      price: "$2652",
      status: "Open",
    },
  ];

  const filteredData = data.filter((item) =>
    item.invoice.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="border-0.75 relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Order Status latest month</h2>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>INVOICE</TableHead>
                <TableHead>CUSTOMERS</TableHead>
                <TableHead>FROM</TableHead>
                <TableHead className="text-right">PRICE</TableHead>
                <TableHead>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.invoice}</TableCell>
                  <TableCell>{item.customers}</TableCell>
                  <TableCell>{item.from}</TableCell>
                  <TableCell className="text-right">{item.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "Process"
                          ? "outline"
                          : item.status === "Open"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing 1 to {filteredData.length} entries</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder para Average Values Content
const AverageValuesContent = () => {
  const barData = [
    { name: "Orders List", value: 38 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Average Values</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-semibold">A 01</h3>
          <p className="text-2xl">$49,690</p>
          <p className="text-sm text-muted-foreground">4,365</p>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-semibold">A 02</h3>
          <p className="text-2xl">2,245</p>
          <p className="text-sm text-muted-foreground">Since last week -13.45%</p>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-lg font-semibold">A 03</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={barData}>
              <Bar dataKey="value" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Placeholder para Configurable Analysis Content
const ConfigurableAnalysisContent = () => {
  const lineData2 = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 2000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
    { name: "Jul", sales: 3490 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Configurable Analysis</h2>
      <div className="rounded-md border p-4">
        <h3 className="text-lg font-semibold">Sales Report</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Placeholder para Filter Analysis Content
const FilterAnalysisContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Filter Analysis</h2>
      <div className="rounded-md border p-4">
        <h3 className="text-lg font-semibold">Orders List</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Num</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>John C.</TableCell>
              <TableCell>#8454-12</TableCell>
              <TableCell>$57.50</TableCell>
              <TableCell>7 Feb 2023</TableCell>
              <TableCell>*****</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
            {/* Adicione mais linhas conforme necessário */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}