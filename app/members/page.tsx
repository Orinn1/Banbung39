'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import MusicPlayer from '@/components/MusicPlayer';
import { MEMBERS_DATA, Member, MemberRole } from '@/data/members';

export default function MembersPage() {
  const [selectedRole, setSelectedRole] = useState<'All' | MemberRole>('All');
  const [searchQuery, setSearchQuery] = useState('');

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
        m.id.includes(q);
      return matchesRole && matchesSearch;
    });
  }, [selectedRole, searchQuery]);

  // Group by role for the "All" view
  const founderList = filteredMembers.filter((m) => m.role === 'Founder');
  const leaderList = filteredMembers.filter((m) => m.role === 'Leader');
  const supportList = filteredMembers.filter((m) => m.role === 'Support');
  const regularMemberList = filteredMembers.filter((m) => m.role === 'Member');

  return (
    <div className="min-h-screen w-full bg-[#090A0D] text-[#ECECF0] flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      {/* MINIMAL TOP NAVBAR */}
      <header className="w-full border-b border-zinc-900 bg-[#090A0D]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-lg font-anton tracking-wide text-zinc-100 group-hover:text-white transition-colors"
            >
              BANBUNG39
            </span>
            <span className="text-[11px] font-mono text-zinc-500 uppercase">
              / COMMUNITY DIRECTORY
            </span>
          </Link>

          {/* Right: Navigation Links */}
          <nav className="flex items-center gap-6 text-xs font-mono">
            <Link
              href="/"
              className="text-zinc-500 hover:text-zinc-200 transition-colors uppercase"
            >
              Home
            </Link>
            <span className="text-zinc-300 font-medium uppercase border-b border-zinc-400 pb-0.5">
              Members
            </span>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 py-10 sm:py-14">
        {/* Back Link & Meta Stamp */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900 text-xs font-mono text-zinc-500">
          <Link
            href="/"
            className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Index</span>
          </Link>
          <div className="flex items-center gap-3">
            <span>BB39 • ROSTER 2K26</span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400">{MEMBERS_DATA.length} ENLISTED</span>
          </div>
        </div>

        {/* Editorial Page Headline */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
            <span>BANBUNG39</span>
            <span className="text-zinc-700">/</span>
            <span>GANGSTER</span>
          </div>

          <h1
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-4xl sm:text-6xl md:text-7xl font-anton tracking-wide text-zinc-100 uppercase leading-[0.96]"
          >
            BB39 & MEMBERS
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-zinc-500 font-mono uppercase tracking-wider">
            • BY.MIKE WINTERFELL
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 mb-10 border-b border-zinc-900">
          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                { label: 'All', value: 'All', count: counts.all },
                { label: 'Founder', value: 'Founder', count: counts.founder },
                { label: 'Leader', value: 'Leader', count: counts.leader },
                { label: 'Support', value: 'Support', count: counts.support },
                { label: 'Member', value: 'Member', count: counts.member },
              ] as const
            ).map((tab) => {
              const isActive = selectedRole === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedRole(tab.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 font-medium'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="uppercase">{tab.label}</span>
                  <span
                    className={`text-[10px] ${
                      isActive ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member or #id..."
              className="w-full px-3.5 py-1.5 bg-[#101115] border border-zinc-800/80 rounded-md text-xs text-zinc-200 placeholder-zinc-600 font-mono focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>
        </div>

        {/* MEMBERS CONTENT */}
        {filteredMembers.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">
              [ NO MATCHING MEMBERS FOUND ]
            </p>
            <button
              onClick={() => {
                setSelectedRole('All');
                setSearchQuery('');
              }}
              className="mt-4 px-3.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            >
              Reset filter
            </button>
          </div>
        ) : selectedRole === 'All' && !searchQuery ? (
          /* SECTIONED DIRECTORY VIEW */
          <div className="space-y-14 sm:space-y-16">
            {/* 1. FOUNDER SECTION */}
            {founderList.length > 0 && (
              <section>
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-zinc-800/70">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                    <h2
                      style={{
                        fontFamily: 'var(--font-anton), "Anton", sans-serif',
                      }}
                      className="text-2xl sm:text-3xl font-anton tracking-wide text-zinc-100 uppercase"
                    >
                      FOUNDER
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-zinc-600">
                    0{founderList.length} / REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {founderList.map((m) => (
                    <EditorialMemberCard key={m.id} member={m} isFeatured />
                  ))}
                </div>
              </section>
            )}

            {/* 2. LEADER SECTION */}
            {leaderList.length > 0 && (
              <section>
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-zinc-800/70">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
                    <h2
                      style={{
                        fontFamily: 'var(--font-anton), "Anton", sans-serif',
                      }}
                      className="text-2xl sm:text-3xl font-anton tracking-wide text-zinc-100 uppercase"
                    >
                      LEADER
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-zinc-600">
                    0{leaderList.length} / REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {leaderList.map((m) => (
                    <EditorialMemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}

            {/* 3. SUPPORT SECTION */}
            {supportList.length > 0 && (
              <section>
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-zinc-800/70">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500/80" />
                    <h2
                      style={{
                        fontFamily: 'var(--font-anton), "Anton", sans-serif',
                      }}
                      className="text-2xl sm:text-3xl font-anton tracking-wide text-zinc-100 uppercase"
                    >
                      SUPPORT
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-zinc-600">
                    0{supportList.length} / REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {supportList.map((m) => (
                    <EditorialMemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}

            {/* 4. MEMBER SECTION */}
            {regularMemberList.length > 0 && (
              <section>
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-zinc-800/70">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <h2
                      style={{
                        fontFamily: 'var(--font-anton), "Anton", sans-serif',
                      }}
                      className="text-2xl sm:text-3xl font-anton tracking-wide text-zinc-100 uppercase"
                    >
                      MEMBER
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-zinc-600">
                    {regularMemberList.length < 10
                      ? `0${regularMemberList.length}`
                      : regularMemberList.length}{' '}
                    / REGISTERED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {regularMemberList.map((m) => (
                    <EditorialMemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* FILTERED UNIFIED GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMembers.map((m) => (
              <EditorialMemberCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </main>

      {/* RESTRAINED EDITORIAL FOOTER */}
      <footer className="w-full border-t border-zinc-900 py-8 mt-16 text-xs font-mono text-zinc-600">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>BANBUNG39 • OFFICIAL DIRECTORY 2K26</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Home
            </Link>
            <span className="text-zinc-800">/</span>
            <span className="text-zinc-400">Members</span>
          </div>
        </div>
      </footer>

      {/* AUDIO PLAYER */}
      <MusicPlayer />
    </div>
  );
}

// Subtle role styling accents (IDs, subtle hover)
const getRoleAccent = (role: MemberRole) => {
  switch (role) {
    case 'Founder':
      return {
        idColor: 'text-zinc-400',
        hoverBorder: 'hover:border-zinc-700',
      };
    case 'Leader':
      return {
        idColor: 'text-rose-400/90',
        hoverBorder: 'hover:border-rose-950/60',
      };
    case 'Support':
      return {
        idColor: 'text-sky-400/90',
        hoverBorder: 'hover:border-sky-950/60',
      };
    case 'Member':
      return {
        idColor: 'text-zinc-500',
        hoverBorder: 'hover:border-zinc-700',
      };
  }
};

// Flatter, editorial member card with thin dark-gray border and clean typography
function EditorialMemberCard({
  member,
  isFeatured = false,
}: {
  member: Member;
  isFeatured?: boolean;
}) {
  const accent = getRoleAccent(member.role);

  return (
    <div
      className={`group bg-[#101115] border border-zinc-800/80 ${accent.hoverBorder} hover:bg-[#131419] rounded-lg transition-colors duration-150 flex items-center justify-between gap-4 ${
        isFeatured ? 'p-4 sm:p-5' : 'p-3.5 sm:p-4'
      }`}
    >
      <div className="min-w-0 flex-1">
        <span
          className={`text-[11px] font-mono block mb-1 tracking-wider ${accent.idColor}`}
        >
          {member.memberId}
        </span>
        <h3
          className={`font-sans font-medium text-zinc-100 tracking-tight truncate ${
            isFeatured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
          }`}
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
          aria-label={`${member.name}'s Facebook Profile`}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-200 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <svg
            className="w-3.5 h-3.5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      )}
    </div>
  );
}
