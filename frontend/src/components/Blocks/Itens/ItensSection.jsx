// src/components/Blocks/Itens/ItensSection.jsx
'use client';

import React, { useState } from 'react';
import {
  RiArrowRightUpLine,
  RiLayoutGridLine,
  RiListCheck,
} from '@remixicon/react';
import { User, Shield, Clock } from 'lucide-react';

const data = [
  {
    name: 'Alissia Stone',
    initial: 'AS',
    bgColor: 'bg-fuchsia-100',
    email: 'a.stone@gmail.com',
    href: '#',
    details: [{ type: 'Role', value: 'member' }, { type: 'Last active', value: '2d ago' }],
  },
  {
    name: 'Emma Bern',
    initial: 'EB',
    bgColor: 'bg-blue-100',
    email: 'e.bern@gmail.com',
    href: '#',
    details: [{ type: 'Role', value: 'member' }, { type: 'Last active', value: '1d ago' }],
  },
  {
    name: 'Aaron McFlow',
    initial: 'AM',
    bgColor: 'bg-pink-100',
    email: 'a.flow@acme.com',
    href: '#',
    details: [{ type: 'Role', value: 'admin' }, { type: 'Last active', value: '2min ago' }],
  },
  {
    name: 'Thomas Palstein',
    initial: 'TP',
    bgColor: 'bg-emerald-100',
    email: 't.palstein@acme.com',
    href: '#',
    details: [{ type: 'Role', value: 'admin' }, { type: 'Last active', value: '18min ago' }],
  },
  {
    name: 'Sarah Johnson',
    initial: 'SJ',
    bgColor: 'bg-orange-100',
    email: 's.johnson@gmail.com',
    href: '#',
    details: [{ type: 'Role', value: 'member' }, { type: 'Last active', value: '3h ago' }],
  },
  {
    name: 'David Smith',
    initial: 'DS',
    bgColor: 'bg-indigo-100',
    email: 'd.smith@gmail.com',
    href: '#',
    details: [{ type: 'Role', value: 'guest' }, { type: 'Last active', value: '4h ago' }],
  },
  {
    name: 'Megan Brown',
    initial: 'MB',
    bgColor: 'bg-yellow-100',
    email: 'm.brown@gmail.com',
    href: '#',
    details: [{ type: 'Role', value: 'admin' }, { type: 'Last active', value: '1d ago' }],
  },
];

/* ------------------------------------------------- */
/* CARD (grid view) */
/* ------------------------------------------------- */
const MemberCard = ({ member }) => {
  const colorMap = {
    fuchsia: 'text-fuchsia-500',
    blue: 'text-blue-500',
    pink: 'text-pink-500',
    emerald: 'text-emerald-500',
    orange: 'text-orange-500',
    indigo: 'text-indigo-500',
    yellow: 'text-yellow-500',
  };
  const key = member.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
  const iconColor = colorMap[key] || colorMap.blue;

  return (
    <a href={member.href} className="block group">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow transition-shadow duration-200 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 truncate max-w-[130px]">
                {member.name}
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">{member.email}</p>
            </div>
          </div>
        </div>

        {/* Details com separador cinza */}
        <div className="grid grid-cols-2 gap-3 text-xs border-t border-gray-200 pt-3">
          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-medium text-gray-900 flex items-center mt-0.5">
              <Shield className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {member.details[0].value}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Last active</p>
            <p className="font-medium text-gray-900 flex items-center mt-0.5">
              <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {member.details[1].value}
            </p>
          </div>
        </div>

        {/* Seta no hover */}
        <RiArrowRightUpLine
          className="absolute right-3 top-3 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />
      </div>
    </a>
  );
};

/* ------------------------------------------------- */
/* LIST ROW (table view) */
/* ------------------------------------------------- */
const MemberRow = ({ member }) => {
  const colorMap = {
    fuchsia: 'text-fuchsia-500',
    blue: 'text-blue-500',
    pink: 'text-pink-500',
    emerald: 'text-emerald-500',
    orange: 'text-orange-500',
    indigo: 'text-indigo-500',
    yellow: 'text-yellow-500',
  };
  const key = member.bgColor.match(/bg-([a-z]+)-100/)?.[1] || 'blue';
  const iconColor = colorMap[key] || colorMap.blue;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className={`p-1.5 rounded-lg ${iconColor} bg-opacity-10`}>
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{member.name}</p>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">{member.details[0].value}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{member.details[1].value}</td>
      <td className="px-4 py-3 text-right">
        <a
          href={member.href}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Edit
        </a>
      </td>
    </tr>
  );
};

/* ------------------------------------------------- */
/* MAIN COMPONENT */
/* ------------------------------------------------- */
export default function ItensSection() {
  const [view, setView] = useState('grid');

  return (
    <div className="bg-gray-50 -mx-6 px-6 py-6">
      {/* Header + Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Itens</h3>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
            {data.length}
          </span>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'grid'
                ? 'bg-white shadow-sm text-gray-800'
                : 'bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Grid view"
          >
            <RiLayoutGridLine className="w-4 h-4" />
          </button>

          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-white shadow-sm text-gray-800'
                : 'bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            aria-label="List view"
          >
            <RiListCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last active
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((member) => (
                <MemberRow key={member.name} member={member} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}