'use client';

import React from 'react';
import { Filter as FilterIcon, ArrowUpDown } from 'lucide-react';
import { MemberRole } from '@/data/members';

interface FilterProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  roleCounts: Record<string, number>;
}

export default function Filter({
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  roleCounts,
}: FilterProps) {
  const roles: (MemberRole | 'All')[] = ['All', 'Founder', 'Leader', 'Co-Leader', 'Member'];
  const statuses = ['All', 'Active', 'Inactive'];

  return (
    <div className="flex flex-col gap-4 py-4 border-b border-white/[0.08] mb-6">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Role Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase text-zinc-500 mr-1 hidden sm:inline-flex items-center gap-1">
            <FilterIcon className="w-3 h-3 text-red-500" />
            ROLE:
          </span>
          {roles.map((role) => {
            const isSelected = selectedRole === role;
            const count = roleCounts[role] ?? 0;
            return (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all duration-150 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-red-600 text-white font-semibold shadow-sm'
                    : 'bg-[#12141C] text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.06]'
                }`}
              >
                <span>{role}</span>
                <span
                  className={`text-[10px] px-1 rounded ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-white/[0.06] text-zinc-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary controls: Status & Sort */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Status selector */}
          <div className="flex items-center rounded bg-[#12141C] border border-white/[0.08] p-0.5 text-xs font-mono">
            {statuses.map((status) => {
              const isSelected = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
                    isSelected
                      ? 'bg-white/[0.08] text-white font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#12141C] border border-white/[0.08] px-2.5 py-1 rounded text-xs font-mono">
            <ArrowUpDown className="w-3 h-3 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-zinc-300 text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="id-asc" className="bg-[#12141C] text-white">ID: Min &rarr; Max</option>
              <option value="id-desc" className="bg-[#12141C] text-white">ID: Max &rarr; Min</option>
              <option value="name" className="bg-[#12141C] text-white">ชื่อ: A-Z</option>
              <option value="role" className="bg-[#12141C] text-white">ตำแหน่ง</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
