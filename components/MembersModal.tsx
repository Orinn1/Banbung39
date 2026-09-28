'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_MEMBERS = [
  { id: '#0001', name: 'MIKE WINTERFELL', role: 'FOUNDER', status: 'Active' },
  { id: '#0002', name: 'ALEXANDER CROSS', role: 'LEADER', status: 'Active' },
  { id: '#0003', name: 'DANTE VALENTINO', role: 'LEADER', status: 'Active' },
  { id: '#0004', name: 'SEBASTIAN GRAY', role: 'SUPPORT', status: 'Active' },
  { id: '#0005', name: 'LUCAS NIGHT', role: 'SUPPORT', status: 'Active' },
  { id: '#0006', name: 'VICTOR STONE', role: 'SUPPORT', status: 'Active' },
  { id: '#0007', name: 'MARCUS VANCE', role: 'MEMBER', status: 'Active' },
  { id: '#0008', name: 'KAIEN SHADOW', role: 'MEMBER', status: 'Active' },
];

export default function MembersModal({ isOpen, onClose }: MembersModalProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = SAMPLE_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl bg-[#0C0D12] border border-white/[0.1] rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <h3 
                style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                className="text-lg font-anton font-normal text-white uppercase tracking-wider"
              >
                BANBUNG39 • ROSTER
              </h3>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5 uppercase tracking-wide">
              LEADERSHIP: BY.MIKE WINTERFELL • FIVEM COMMUNITY
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            [CLOSE]
          </button>
        </div>

        {/* Search */}
        <div className="my-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH BY NAME OR #ID..."
            className="w-full px-4 py-2.5 bg-[#14161F] border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 uppercase font-sans"
          />
        </div>

        {/* Members Grid / List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#14161F]/80 border border-white/[0.06] hover:border-white/[0.15] transition-colors"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    {member.id}
                  </span>
                  <span 
                    style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                    className="text-base font-normal text-white font-anton uppercase tracking-wide"
                  >
                    {member.name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase border border-white/10 px-2 py-0.2 rounded-full">
                    {member.role}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-400">
                [{member.status.toUpperCase()}]
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link to Dedicated Page */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            BANBUNG39 2K26
          </span>
          <Link
            href="/members"
            onClick={onClose}
            className="text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            [ FULL DIRECTORY &rarr; ]
          </Link>
        </div>
      </div>
    </div>
  );
}
