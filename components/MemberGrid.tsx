'use client';

import React, { useState, useMemo } from 'react';
import { Users, AlertCircle, RefreshCw } from 'lucide-react';
import MemberCard from './MemberCard';
import Filter from './Filter';
import SearchBar from './SearchBar';
import { Member } from '@/data/members';

interface MemberGridProps {
  members: Member[];
  initialSearch?: string;
  onSearchChange?: (val: string) => void;
}

export default function MemberGrid({
  members,
  initialSearch = '',
  onSearchChange,
}: MemberGridProps) {
  const [internalSearch, setInternalSearch] = useState(initialSearch);
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('id-asc');

  // Sync if parent updates initialSearch
  const currentSearch = onSearchChange ? initialSearch : internalSearch;
  const handleSearch = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  // Compute counts for each role based on full dataset
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: members.length,
      Founder: 0,
      Leader: 0,
      'Co-Leader': 0,
      Member: 0,
    };
    members.forEach((m) => {
      if (counts[m.role] !== undefined) {
        counts[m.role]++;
      }
    });
    return counts;
  }, [members]);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Filter by Search Query
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q) ||
          m.nickname.toLowerCase().includes(q) ||
          m.id.includes(q) ||
          m.memberId.toLowerCase().includes(q) ||
          (m.specialty && m.specialty.toLowerCase().includes(q))
      );
    }

    // Filter by Role
    if (selectedRole !== 'All') {
      result = result.filter((m) => m.role.toLowerCase() === selectedRole.toLowerCase());
    }

    // Filter by Status
    if (selectedStatus !== 'All') {
      result = result.filter((m) => m.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'id-asc') {
        return parseInt(a.id, 10) - parseInt(b.id, 10);
      }
      if (sortBy === 'id-desc') {
        return parseInt(b.id, 10) - parseInt(a.id, 10);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'role') {
        const order: Record<string, number> = {
          Founder: 1,
          Leader: 2,
          'Co-Leader': 3,
          Member: 4,
        };
        return (order[a.role] || 99) - (order[b.role] || 99);
      }
      return 0;
    });

    return result;
  }, [members, currentSearch, selectedRole, selectedStatus, sortBy]);

  const handleClearAll = () => {
    handleSearch('');
    setSelectedRole('All');
    setSelectedStatus('All');
  };

  return (
    <section id="members" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Directory Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-sm" />
            <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wide text-white">
              สมาชิกในตระกูล
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            ROSTER DIRECTORY • TOTAL {filteredMembers.length} MEMBERS DISPLAYED
          </p>
        </div>

        {/* Directory Mini Search */}
        <div className="w-full md:w-72">
          <SearchBar
            value={currentSearch}
            onChange={handleSearch}
            placeholder="ค้นหาชื่อ, Username, ID..."
          />
        </div>
      </div>

      {/* Filter & Sort Controls */}
      <Filter
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        roleCounts={roleCounts}
      />

      {/* Active Filter Indicators if filtered */}
      {(currentSearch || selectedRole !== 'All' || selectedStatus !== 'All') && (
        <div className="flex items-center justify-between gap-2 mb-6 px-3 py-2 bg-[#12141C] border border-white/[0.06] rounded text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>ตัวกรองที่ใช้งาน:</span>
            {currentSearch && (
              <span className="px-2 py-0.5 bg-red-600/20 text-red-300 rounded border border-red-500/30 font-mono">
                &ldquo;{currentSearch}&rdquo;
              </span>
            )}
            {selectedRole !== 'All' && (
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-white/[0.08] font-mono">
                Role: {selectedRole}
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-white/[0.08] font-mono">
                Status: {selectedStatus}
              </span>
            )}
          </div>
          <button
            onClick={handleClearAll}
            className="text-red-400 hover:text-red-300 font-mono text-[11px] underline underline-offset-4"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {/* Grid of Members */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-4 text-center rounded-lg border border-dashed border-white/[0.1] bg-[#111319]/50 max-w-lg mx-auto my-6">
          <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-400 mb-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-bold font-display uppercase tracking-wider text-white">
            No members found
          </h3>
          <p className="mt-1 text-xs text-zinc-400 font-sans max-w-xs mx-auto">
            ไม่พบสมาชิกที่ตรงกับเงื่อนไขการค้นหา &ldquo;{currentSearch}&rdquo;
          </p>
          <button
            onClick={handleClearAll}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold tracking-wider text-white bg-red-600 hover:bg-red-700 rounded transition-colors uppercase border border-red-500/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Search</span>
          </button>
        </div>
      )}
    </section>
  );
}
