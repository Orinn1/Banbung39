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
    <div className="relative min-h-screen w-full bg-[#05070D] text-[#F3F4F6] flex flex-col justify-between overflow-x-hidden select-none">
      {/* Falling Snowflakes Particle Effect */}
      <SnowEffect />

      {/* Atmospheric Background Layers (Grid + Vignette + Radial Glows) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Swyft 171 Tactical Background Grid */}
        <div className="absolute inset-0 tactical-grid opacity-80" />
        
        {/* Deep Dark Linear Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060912]/80 via-[#04060A]/95 to-[#020306]" />

        {/* Ambient Radial Glows */}
        <div className="absolute top-12 -left-28 w-[32rem] h-[32rem] bg-sky-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-28 w-[34rem] h-[34rem] bg-indigo-600/[0.05] rounded-full blur-3xl pointer-events-none" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 cinematic-vignette" />
      </div>

      {/* TOPBAR (Swyft 171 Glass Shell) */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-5 sm:pt-7">
        <div className="w-full min-h-[62px] px-4 sm:px-6 rounded-2xl bg-[#080D16]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_18px_40px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4">
          {/* Left: Brand with Logo Badge */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <span className="w-8 h-8 rounded-lg border border-sky-400/30 bg-gradient-to-br from-sky-400/20 to-white/[0.02] flex items-center justify-center font-anton text-sm text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:scale-105 transition-transform">
              39
            </span>
            <div className="flex flex-col">
              <span 
                style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                className="text-base sm:text-lg font-anton tracking-wider text-white uppercase leading-tight group-hover:text-zinc-200 transition-colors"
              >
                BANBUNG39
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase -mt-0.5">
                BY.MIKE WINTERFELL
              </span>
            </div>
          </Link>

          {/* Right: Nav Links & Swyft Pulse Online Indicator */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] text-xs font-mono tracking-widest uppercase transition-colors"
            >
              HOME
            </Link>

            <div className="px-4 py-1.5 rounded-xl bg-white/[0.1] border border-white/20 text-white text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.06)]">
              MEMBERS
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300 text-[10px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span>ONLINE</span>
            </div>
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-20 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* TACTICAL HERO (Swyft 171 Layout: Eyebrow + Huge Title + Stat Count Box) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end mb-8 sm:mb-10">
          {/* Left: Eyebrow & Hero Title */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/20 bg-sky-400/[0.04] text-[10px] font-mono tracking-[0.18em] text-sky-300 uppercase mb-3">
              <span className="w-4 h-[1px] bg-sky-400" />
              <span>HOUSE OF <b>BANBUNG39</b> / MEMBERS</span>
            </div>

            <h1 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-5xl sm:text-7xl lg:text-8xl font-anton tracking-wide text-white uppercase leading-[0.92] drop-shadow-md"
            >
              BB39 & MEMBERS
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-mono uppercase tracking-wider">
              • BY.MIKE WINTERFELL • 2K26 OFFICIAL DIRECTORY
            </p>
          </div>

          {/* Right: Swyft Signature Count Card */}
          <div className="w-full sm:w-[190px] p-5 rounded-2xl border border-white/10 bg-gradient-to-b from-[#0C121D]/90 to-[#070B12]/95 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between">
            <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
              TOTAL MEMBERS
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-4xl sm:text-5xl font-anton tracking-wider text-white my-1"
            >
              {String(counts.all).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              HOUSE IS ONLINE
            </span>
          </div>
        </div>

        {/* TACTICAL TOOLBAR (Search Box + Pill Filters) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[#090D18]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl mb-10 shadow-2xl">
          {/* Search Box with ⌕ Symbol */}
          <div className="relative flex-1 sm:max-w-sm">
            <div className="w-full h-10 px-3.5 flex items-center gap-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus-within:border-sky-400/40 transition-colors">
              <span className="text-zinc-500 font-mono text-sm">⌕</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH MEMBER..."
                className="w-full bg-transparent border-0 outline-none text-xs font-mono text-white placeholder-zinc-500 uppercase tracking-wide"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-zinc-500 hover:text-white"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-0.5">
            <button
              onClick={() => setSelectedRole('All')}
              className={`h-9 px-3.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2 ${
                selectedRole === 'All'
                  ? 'bg-sky-400/15 border border-sky-400/30 text-sky-200 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <span>ALL</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'All' ? 'bg-sky-400/20 text-sky-200' : 'bg-white/[0.06] text-zinc-500'
              }`}>
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Founder')}
              className={`h-9 px-3.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2 ${
                selectedRole === 'Founder'
                  ? 'bg-white/15 border border-white/30 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <span>FOUNDER</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Founder' ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-zinc-500'
              }`}>
                {counts.founder}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Leader')}
              className={`h-9 px-3.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2 ${
                selectedRole === 'Leader'
                  ? 'bg-red-500/15 border border-red-500/30 text-red-200 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <span>LEADER</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Leader' ? 'bg-red-500/20 text-red-200' : 'bg-white/[0.06] text-zinc-500'
              }`}>
                {counts.leader}
              </span>
            </button>

            <button
              onClick={() => setSelectedRole('Support')}
              className={`h-9 px-3.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-2 ${
                selectedRole === 'Support'
                  ? 'bg-sky-400/15 border border-sky-400/30 text-sky-200 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <span>SUPPORT</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRole === 'Support' ? 'bg-sky-400/20 text-sky-200' : 'bg-white/[0.06] text-zinc-500'
              }`}>
                {counts.support}
              </span>
            </button>
          </div>
        </div>

        {/* MEMBERS CONTENT */}
        {filteredMembers.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <strong 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-2xl font-anton text-zinc-300 uppercase tracking-wide"
            >
              NO MEMBER FOUND
            </strong>
            <span className="text-zinc-500 font-mono text-xs mt-1 uppercase">
              ไม่พบสมาชิกที่ค้นหา
            </span>
            <button
              onClick={() => {
                setSelectedRole('All');
                setSearchQuery('');
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/20 border border-white/10 text-xs font-mono text-white transition-colors uppercase"
            >
              RESET FILTER
            </button>
          </div>
        ) : selectedRole === 'All' && !searchQuery ? (
          /* SECTIONED VIEW (Founder Featured -> Leader Core -> Support Members) */
          <div className="space-y-12">
            {/* 1. FOUNDER BLOCK */}
            {founderList.length > 0 && (
              <section className="rank-block">
                <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      FOUNDER
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      SUPREME LEADERSHIP
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    0{founderList.length} / REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {founderList.map((m) => (
                    <TacticalMemberCard 
                      key={m.id} 
                      member={m} 
                      isFeatured={true}
                      onSelectMember={() => setActiveModalMember(m)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. LEADER BLOCK */}
            {leaderList.length > 0 && (
              <section className="rank-block">
                <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-red-500/20">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-red-400 uppercase"
                    >
                      LEADER
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      COMMAND & TACTICAL OPS
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    0{leaderList.length} / REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {leaderList.map((m) => (
                    <TacticalMemberCard 
                      key={m.id} 
                      member={m} 
                      onSelectMember={() => setActiveModalMember(m)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3. SUPPORT BLOCK */}
            {supportList.length > 0 && (
              <section className="rank-block">
                <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-sky-400/20">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-sky-300 uppercase"
                    >
                      SUPPORT
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      LOGISTICS & COMMUNITY
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    0{supportList.length} / REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {supportList.map((m) => (
                    <TacticalMemberCard 
                      key={m.id} 
                      member={m} 
                      onSelectMember={() => setActiveModalMember(m)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 4. MEMBER BLOCK (IF ANY) */}
            {regularMemberList.length > 0 && (
              <section className="rank-block">
                <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-3">
                    <h2 
                      style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                      className="text-2xl sm:text-3xl font-anton tracking-wider text-white uppercase"
                    >
                      MEMBERS
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      CORE OPERATIVES
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    0{regularMemberList.length} / REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {regularMemberList.map((m) => (
                    <TacticalMemberCard 
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
              <TacticalMemberCard 
                key={m.id} 
                member={m} 
                onSelectMember={() => setActiveModalMember(m)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
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

      {/* SWYFT 171 STYLE PROFILE POPUP MODAL */}
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
                <span>● ONLINE</span>
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

// Role-specific metallic gradient border and glow themes (Authentic Swyft 171 style)
const getRoleTheme = (role: MemberRole) => {
  switch (role) {
    case 'Founder':
      // Platinum White / Polished Silver Chrome
      return {
        borderGradient: 'from-white/90 via-slate-300/40 to-white/10 hover:from-white hover:via-slate-200 hover:to-white/30',
        glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.08)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.18)]',
        idColor: 'text-zinc-400',
        avatarBg: 'from-white/20 via-slate-300/10 to-transparent border-white/25 text-white',
        ghostColor: 'text-white/[0.08]',
      };
    case 'Leader':
      // Crimson Noir / Blood Ruby
      return {
        borderGradient: 'from-red-500/90 via-red-800/45 to-red-950/20 hover:from-red-400 hover:via-red-700 hover:to-red-900/40',
        glow: 'shadow-[0_4px_30px_rgba(239,68,68,0.12)] hover:shadow-[0_8px_40px_rgba(239,68,68,0.24)]',
        idColor: 'text-red-400/80',
        avatarBg: 'from-red-500/25 via-red-900/15 to-transparent border-red-500/30 text-red-200',
        ghostColor: 'text-red-500/[0.12]',
      };
    case 'Support':
      // Steel Ice Blue / Tactical Cobalt
      return {
        borderGradient: 'from-sky-400/90 via-blue-800/45 to-sky-950/20 hover:from-sky-300 hover:via-blue-700 hover:to-sky-900/40',
        glow: 'shadow-[0_4px_30px_rgba(56,189,248,0.12)] hover:shadow-[0_8px_40px_rgba(56,189,248,0.24)]',
        idColor: 'text-sky-400/80',
        avatarBg: 'from-sky-400/25 via-blue-900/15 to-transparent border-sky-400/30 text-sky-200',
        ghostColor: 'text-sky-400/[0.12]',
      };
    case 'Member':
      // Smoked Titanium Charcoal
      return {
        borderGradient: 'from-zinc-500/50 via-zinc-700/25 to-zinc-900/10 hover:from-zinc-400 hover:via-zinc-600 hover:to-zinc-800/30',
        glow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)]',
        idColor: 'text-zinc-500',
        avatarBg: 'from-zinc-500/20 via-zinc-700/10 to-transparent border-zinc-500/20 text-zinc-300',
        ghostColor: 'text-zinc-500/[0.1]',
      };
  }
};

// Swyft 171 Tactical Member Card with Avatar, Ghost Number, and Metallic Gradient Border
function TacticalMemberCard({ 
  member, 
  isFeatured = false,
  onSelectMember,
}: { 
  member: Member; 
  isFeatured?: boolean;
  onSelectMember: () => void;
}) {
  const theme = getRoleTheme(member.role);
  // Extract number for ghost watermark e.g. "01", "02", "05"
  const ghostNo = member.id.slice(-2);
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <div 
      onClick={onSelectMember}
      className={`group relative p-[1.5px] rounded-2xl bg-gradient-to-br ${theme.borderGradient} ${theme.glow} transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
    >
      <div className="relative p-3.5 sm:p-4 rounded-[14.5px] bg-gradient-to-b from-[#0D121F]/95 to-[#080B12]/98 backdrop-blur-md flex items-center justify-between gap-3 overflow-hidden">
        {/* Left: Avatar Emblem Badge */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border bg-gradient-to-br ${theme.avatarBg} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
          <span 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-xl sm:text-2xl font-anton text-white"
          >
            {initial}
          </span>
        </div>

        {/* Center: Content (ID, Name, Subtitle, Action Links) */}
        <div className="min-w-0 flex-1 z-10">
          <span className={`text-[10px] font-mono block leading-none mb-1 font-bold ${theme.idColor}`}>
            {member.memberId}
          </span>

          <h3 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className={`${
              isFeatured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            } font-anton tracking-wide text-white uppercase truncate group-hover:text-zinc-100 transition-colors`}
          >
            {member.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
              {member.role === 'Founder' 
                ? 'FOUNDER' 
                : member.role === 'Leader' 
                ? 'LEADER' 
                : 'SUPPORT'}
            </span>

            {member.facebook && (
              <a
                href={member.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Profile"
                aria-label="Facebook Profile"
                onClick={(e) => e.stopPropagation()}
                className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/50 text-zinc-400 hover:text-white hover:bg-white/[0.1] flex items-center justify-center transition-all flex-shrink-0"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Right: Giant Ghost Number Watermark (Swyft 171 signature visual) */}
        <div 
          style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
          className={`select-none pointer-events-none text-5xl sm:text-6xl font-anton font-extrabold ${theme.ghostColor} tracking-tighter pr-1 leading-none group-hover:opacity-80 transition-opacity`}
        >
          {ghostNo}
        </div>
      </div>
    </div>
  );
}
