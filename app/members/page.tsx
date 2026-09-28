'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import SnowEffect from '@/components/SnowEffect';
import MusicPlayer from '@/components/MusicPlayer';
import { MEMBERS_DATA, Member, MemberRole } from '@/data/members';

export default function MembersPage() {
  const [selectedRole, setSelectedRole] = useState<'All' | MemberRole>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalMember, setActiveModalMember] = useState<Member | null>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Counts by role
  const counts = useMemo(() => {
    return {
      all: MEMBERS_DATA.length,
      founder: MEMBERS_DATA.filter((m) => m.role === 'Founder').length,
      leader: MEMBERS_DATA.filter((m) => m.role === 'Leader').length,
      support: MEMBERS_DATA.filter((m) => m.role === 'Support').length,
      member: MEMBERS_DATA.filter((m) => m.role === 'Member').length,
    };
  }, []);

  // Filtered members based on role and search query
  const filteredMembers = useMemo(() => {
    return MEMBERS_DATA.filter((m) => {
      const matchesRole = selectedRole === 'All' || m.role === selectedRole;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.id.includes(q) ||
        m.role.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [selectedRole, searchQuery]);

  // Group by role for the "All" view
  const founderList = filteredMembers.filter((m) => m.role === 'Founder');
  const leaderList = filteredMembers.filter((m) => m.role === 'Leader');
  const supportList = filteredMembers.filter((m) => m.role === 'Support');
  const regularMemberList = filteredMembers.filter((m) => m.role === 'Member');

  return (
    <div className="relative min-h-screen w-full bg-[#060709] text-[#F3F4F6] flex flex-col justify-between overflow-x-hidden select-none">
      {/* Falling Snowflakes Particle Effect */}
      <SnowEffect />

      {/* Atmospheric Dark Cinematic Background (Matching Home Page) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1117]/80 via-[#08090C]/95 to-[#040507]" />
        
        {/* Soft atmospheric radial glow */}
        <div className="absolute top-1/6 left-1/3 w-[36rem] h-[36rem] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-zinc-800/[0.05] rounded-full blur-3xl pointer-events-none" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 cinematic-vignette" />
      </div>

      {/* TOP NAVBAR (Exact Same as Home Page) */}
      <header className="relative z-30 w-full px-6 sm:px-12 md:px-16 pt-7 sm:pt-9 flex items-center justify-between">
        {/* Left: Brand Name with Link back home */}
        <Link href="/" className="flex flex-col group cursor-pointer">
          <span className="text-sm sm:text-base font-mono font-bold tracking-[0.25em] text-white uppercase leading-tight group-hover:text-zinc-300 transition-colors">
            BANBUNG39
          </span>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase -mt-0.5">
            BY.MIKE WINTERFELL
          </span>
        </Link>

        {/* Right: Navigation Pill Menu */}
        <nav className="flex items-center gap-2.5">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.04] text-xs font-mono tracking-widest uppercase transition-colors"
          >
            HOME
          </Link>

          <div className="px-5 py-1.5 rounded-full bg-white/[0.08] border border-white/20 text-white text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md">
            MEMBERS
          </div>
        </nav>
      </header>

      {/* MAIN CONTAINER (Matching Home Page Max Width & Padding) */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 md:px-16 py-8 sm:py-12">
        {/* Clean Hero Title (Matching Home Page Style) */}
        <div className="mb-10 sm:mb-12">
          <h1 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-4xl sm:text-6xl md:text-7xl font-anton tracking-wide text-white uppercase leading-[0.95]"
          >
            BB39 & MEMBERS
          </h1>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2 bg-[#0C0D12]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl mb-10 shadow-2xl">
          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1">
            <button
              onClick={() => setSelectedRole('All')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'All'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>ALL</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'All' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Founder')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'Founder'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>FOUNDER</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Founder' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.founder}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Leader')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'Leader'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>LEADER</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Leader' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.leader}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Support')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                selectedRole === 'Support'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span>SUPPORT</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Support' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
              }`}>
                {counts.support}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[280px] px-2 py-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH BY NAME OR #ID..."
              className="w-full px-4 py-2 bg-[#12141C] border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 uppercase transition-colors"
            />
          </div>
        </div>

        {/* MEMBERS CONTENT */}
        {filteredMembers.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              [ NO MEMBERS FOUND ]
            </p>
            <button
              onClick={() => {
                setSelectedRole('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 rounded-xl bg-white/[0.06] text-xs font-mono text-white hover:bg-white/15 transition-colors uppercase"
            >
              RESET FILTER
            </button>
          </div>
        ) : selectedRole === 'All' && !searchQuery ? (
          /* SECTIONED VIEW WHEN 'ALL' IS SELECTED */
          <div className="space-y-12">
            {/* 1. FOUNDER SECTION */}
            {founderList.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      FOUNDER
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      SUPREME LEADERSHIP
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {founderList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {founderList.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      member={m} 
                      isFeatured 
                      onSelectMember={() => setActiveModalMember(m)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. LEADER SECTION */}
            {leaderList.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      LEADER
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      COMMAND & TACTICAL OPS
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {leaderList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {leaderList.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      member={m} 
                      onSelectMember={() => setActiveModalMember(m)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3. SUPPORT SECTION */}
            {supportList.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      SUPPORT
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      LOGISTICS & COMMUNITY
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {supportList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {supportList.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      member={m} 
                      onSelectMember={() => setActiveModalMember(m)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 4. MEMBER SECTION */}
            {regularMemberList.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      MEMBER
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      CORE OPERATIVES
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {regularMemberList.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {regularMemberList.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      member={m} 
                      onSelectMember={() => setActiveModalMember(m)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* UNIFIED GRID VIEW WHEN FILTERED */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredMembers.map((m) => (
              <MemberCard 
                key={m.id} 
                member={m} 
                onSelectMember={() => setActiveModalMember(m)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER (Matching Home Page) */}
      <footer className="relative z-20 w-full px-6 sm:px-12 md:px-16 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div>
          BANBUNG39 • BY.MIKE WINTERFELL • 2K26
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-zinc-400">MEMBERS</span>
        </div>
      </footer>

      {/* PERSISTENT MUSIC PLAYER */}
      <MusicPlayer />

      {/* PROFILE POPUP MODAL */}
      {activeModalMember && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalMember(null)}
        >
          <div 
            className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#101522] to-[#080B12] border border-white/15 shadow-[0_35px_90px_rgba(0,0,0,0.85)] overflow-hidden grid grid-cols-1 sm:grid-cols-[220px_1fr]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalMember(null)}
              className="absolute right-3.5 top-3.5 z-20 w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/15 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-mono transition-colors"
            >
              &times;
            </button>

            {/* Left Side: Avatar Symbol & Role Badge */}
            <div className="p-6 sm:p-7 border-b sm:border-b-0 sm:border-r border-white/10 bg-[#0C101A] flex flex-col items-center justify-center gap-4 text-center">
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border ${
                activeModalMember.role === 'Founder'
                  ? 'border-white/30 bg-white/10 text-white'
                  : activeModalMember.role === 'Leader'
                  ? 'border-red-500/30 bg-red-500/10 text-red-300'
                  : 'border-sky-400/30 bg-sky-400/10 text-sky-300'
              }`}>
                {activeModalMember.role}
              </span>

              {/* Symbol Avatar */}
              <div className="w-24 h-24 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <span 
                  style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                  className="text-4xl font-anton text-white"
                >
                  {activeModalMember.name.charAt(0)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Right Side: Details & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase block mb-1">
                  BANBUNG39 / MEMBER PROFILE
                </span>
                <h2 
                  style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                  className="text-3xl sm:text-4xl font-anton tracking-wide text-white uppercase"
                >
                  {activeModalMember.name}
                </h2>
                <p className="text-xs font-mono text-zinc-400 uppercase mt-0.5 tracking-wider">
                  {activeModalMember.role === 'Founder' 
                    ? 'FOUNDER • SUPREME LEADERSHIP'
                    : activeModalMember.role === 'Leader'
                    ? 'LEADER • COMMAND OPS'
                    : 'SUPPORT • LOGISTICS'}
                </p>

                {/* 3-Column Meta Info Grid */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/10">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                      JOINED
                    </span>
                    <strong className="text-xs font-mono text-white block mt-0.5">
                      2026
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                      ID
                    </span>
                    <strong className="text-xs font-mono text-white block mt-0.5">
                      {activeModalMember.memberId}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                      HOUSE
                    </span>
                    <strong className="text-xs font-mono text-white block mt-0.5">
                      BB39
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action: Facebook Link Button */}
              {activeModalMember.facebook && (
                <div>
                  <a
                    href={activeModalMember.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 hover:border-white/40 text-xs font-mono text-white flex items-center justify-center gap-2.5 transition-all uppercase tracking-wider group"
                  >
                    <svg className="w-4 h-4 fill-current text-sky-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>OPEN FACEBOOK PROFILE &rarr;</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Role-specific metallic gradient border and glow themes (Authentic, dark, non-AI)
const getRoleTheme = (role: MemberRole) => {
  switch (role) {
    case 'Founder':
      // Platinum White / Polished Silver Chrome
      return {
        borderGradient: 'from-white/90 via-slate-300/40 to-white/10 hover:from-white hover:via-slate-200 hover:to-white/30',
        glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.08)] hover:shadow-[0_6px_40px_rgba(255,255,255,0.15)]',
        idColor: 'text-zinc-400',
      };
    case 'Leader':
      // Crimson Noir / Blood Ruby
      return {
        borderGradient: 'from-red-500/90 via-red-800/45 to-red-950/20 hover:from-red-400 hover:via-red-700 hover:to-red-900/40',
        glow: 'shadow-[0_4px_30px_rgba(239,68,68,0.12)] hover:shadow-[0_6px_40px_rgba(239,68,68,0.22)]',
        idColor: 'text-red-400/80',
      };
    case 'Support':
      // Steel Ice Blue / Tactical Cobalt
      return {
        borderGradient: 'from-sky-400/90 via-blue-800/45 to-sky-950/20 hover:from-sky-300 hover:via-blue-700 hover:to-sky-900/40',
        glow: 'shadow-[0_4px_30px_rgba(56,189,248,0.12)] hover:shadow-[0_6px_40px_rgba(56,189,248,0.22)]',
        idColor: 'text-sky-400/80',
      };
    case 'Member':
      // Smoked Titanium Charcoal
      return {
        borderGradient: 'from-zinc-500/50 via-zinc-700/25 to-zinc-900/10 hover:from-zinc-400 hover:via-zinc-600 hover:to-zinc-800/30',
        glow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
        idColor: 'text-zinc-500',
      };
  }
};

// Clean Typographic Member Card with Role Gradient Border (No role badge text)
function MemberCard({ 
  member, 
  isFeatured = false,
  onSelectMember,
}: { 
  member: Member; 
  isFeatured?: boolean;
  onSelectMember: () => void;
}) {
  const theme = getRoleTheme(member.role);

  return (
    <div 
      onClick={onSelectMember}
      className={`p-[1.5px] rounded-2xl bg-gradient-to-br ${theme.borderGradient} ${theme.glow} transition-all duration-300 hover:-translate-y-0.5 cursor-pointer`}
    >
      <div className="p-4 sm:p-5 rounded-[14.5px] bg-[#0C0D12]/95 backdrop-blur-md flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className={`text-xs font-mono block mb-1 font-bold ${theme.idColor}`}>
            {member.memberId}
          </span>
          <h3 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className={`${
              isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl'
            } font-anton tracking-wide text-white uppercase truncate`}
          >
            {member.name}
          </h3>
        </div>

        {member.facebook && (
          <a
            href={member.facebook}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook Profile"
            aria-label="Facebook Profile"
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/15 hover:border-white/50 text-zinc-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200 flex-shrink-0"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
