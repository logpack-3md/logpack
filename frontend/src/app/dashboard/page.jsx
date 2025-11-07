"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import DataStats from '@/components/ui/datastats';
import { Menu } from 'lucide-react';
import Blog from "../../components/blog";
import { FloatingActions } from '@/components/ui/floating-actions';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-full bg-gray-50"> {/* ← h-full, não h-screen */}
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content - ÚNICO SCROLL */}
      <div className="flex-1 overflow-y-auto relative"> {/* ← overflow-y-auto */}
        <FloatingActions />

        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Conteúdo */}
        <div className="pt-4 lg:pt-2">
          <div className="max-w-7xl mx-auto">
            <div className="px-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Hi, welcome back</h1>
            </div>
            <DataStats />
          </div>
        </div>

        <div className="mt-8 px-6">
          <Blog />
        </div>
      </div>
    </div>
  );
}