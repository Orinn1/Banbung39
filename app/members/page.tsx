'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SnowEffect from '@/components/SnowEffect';
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
        m.id.includes(q) ||
        m.role.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [selectedRole, searchQuery]);

  // Group by role
  const founderList = filteredMembers.filter((m) => m.role === 'Founder');
  const leaderList = filteredMembers.filter((m) => m.role === 'Leader');
  const supportList = filteredMembers.filter((m) => m.role === 'Support');
  const regularMemberList = filteredMembers.filter((m) => m.role === 'Member');

  return (
    <div className="relative min-h-screen w-full bg-[#060709] text-[#F3F4F6] flex flex-col justify-between overflow-x-hidden select-none">
      {/* Falling Snowflakes Particle Effect */}
      <SnowEffect />

      {/* Atmospheric Dark Cinematic Background */}
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

      {/* MAIN CONTAINER */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 md:px-12 py-8 sm:py-12">
        {/* Clean Hero Title */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-4xl sm:text-6xl md:text-7xl font-anton tracking-wide text-white uppercase leading-[0.95]"
          >
            BB39 & MEMBERS
          </h1>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-2 bg-[#0C0D12]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl mb-8 shadow-2xl">
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

            {counts.member > 0 && (
              <button
                onClick={() => setSelectedRole('Member')}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 ${
                  selectedRole === 'Member'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>MEMBERS</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedRole === 'Member' ? 'bg-black/10 text-black' : 'bg-white/[0.08] text-zinc-400'
                }`}>
                  {counts.member}
                </span>
              </button>
            )}
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
        ) : (
          <div className="space-y-12">
            {/* 1. FOUNDER SECTION (Wide / 2-Column Layout) */}
            {(selectedRole === 'All' || selectedRole === 'Founder') && founderList.length > 0 && (
              <section>
                <SectionHeader title="FOUNDER" role="Founder" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                  {founderList.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      member={m} 
                      variant="wide"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. LEADER SECTION (2-Column Layout) */}
            {(selectedRole === 'All' || selectedRole === 'Leader') && leaderList.length > 0 && (
              <section>
                <SectionHeader title="LEADER" role="Leader" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                  {leaderList.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      member={m} 
                      variant="wide"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3. SUPPORT SECTION (5-Column Layout) */}
            {(selectedRole === 'All' || selectedRole === 'Support') && supportList.length > 0 && (
              <section>
                <SectionHeader title="SUPPORT" role="Support" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {supportList.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      member={m} 
                      variant="compact"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 4. MEMBERS SECTION (5-Column Layout) */}
            {(selectedRole === 'All' || selectedRole === 'Member') && regularMemberList.length > 0 && (
              <section>
                <SectionHeader title="MEMBERS" role="Member" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {regularMemberList.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      member={m} 
                      variant="compact"
                    />
                  ))}
                </div>
              </section>
            )}
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
    </div>
  );
}

// Section Header with sleek horizontal flanking lines matching reference screenshots
function SectionHeader({
  title,
  role,
}: {
  title: string;
  role: MemberRole;
}) {
  const theme = getRoleTheme(role);
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 my-6 sm:my-8">
      <div className={`h-[1px] flex-1 max-w-[120px] sm:max-w-xs md:max-w-md ${theme.headingLineLeft}`} />
      <h2 
        className={`font-rajdhani text-lg sm:text-xl md:text-2xl font-bold tracking-[0.28em] uppercase text-center ${theme.headingText}`}
      >
        {title}
      </h2>
      <div className={`h-[1px] flex-1 max-w-[120px] sm:max-w-xs md:max-w-md ${theme.headingLineRight}`} />
    </div>
  );
}

// Role-specific metallic gradient border, background, and glow themes (BANBUNG39 Authentic Noir Colors)
const getRoleTheme = (role: MemberRole) => {
  switch (role) {
    case 'Founder':
      // Platinum White / Polished Silver Chrome
      return {
        cardBorder: 'border-white/30 hover:border-white/90',
        cardBg: 'bg-gradient-to-r from-white/[0.06] via-[#0C0D12]/95 to-[#08090C]/95',
        glow: 'shadow-[0_4px_25px_rgba(255,255,255,0.06)] hover:shadow-[0_4px_35px_rgba(255,255,255,0.18)]',
        avatarBorder: 'border-white/20',
        avatarBg: 'bg-gradient-to-br from-white/10 via-zinc-800/40 to-black',
        avatarText: 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]',
        roleText: 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]',
        headingText: 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]',
        headingLineLeft: 'bg-gradient-to-r from-transparent via-white/40 to-white/70',
        headingLineRight: 'bg-gradient-to-l from-transparent via-white/40 to-white/70',
        idColor: 'text-zinc-400',
      };
    case 'Leader':
      // Crimson Noir / Blood Ruby
      return {
        cardBorder: 'border-red-500/40 hover:border-red-400',
        cardBg: 'bg-gradient-to-r from-red-950/30 via-[#0C0D12]/95 to-[#08090C]/95',
        glow: 'shadow-[0_4px_25px_rgba(239,68,68,0.12)] hover:shadow-[0_4px_35px_rgba(239,68,68,0.25)]',
        avatarBorder: 'border-red-500/30',
        avatarBg: 'bg-gradient-to-br from-red-950/60 via-zinc-900/40 to-black',
        avatarText: 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]',
        roleText: 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]',
        headingText: 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.55)]',
        headingLineLeft: 'bg-gradient-to-r from-transparent via-red-500/40 to-red-500/80',
        headingLineRight: 'bg-gradient-to-l from-transparent via-red-500/40 to-red-500/80',
        idColor: 'text-red-400/80',
      };
    case 'Support':
      // Steel Ice Blue / Tactical Cobalt
      return {
        cardBorder: 'border-sky-400/40 hover:border-sky-300',
        cardBg: 'bg-gradient-to-r from-sky-950/30 via-[#0C0D12]/95 to-[#08090C]/95',
        glow: 'shadow-[0_4px_25px_rgba(56,189,248,0.12)] hover:shadow-[0_4px_35px_rgba(56,189,248,0.25)]',
        avatarBorder: 'border-sky-400/30',
        avatarBg: 'bg-gradient-to-br from-sky-950/60 via-zinc-900/40 to-black',
        avatarText: 'text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]',
        roleText: 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]',
        headingText: 'text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.55)]',
        headingLineLeft: 'bg-gradient-to-r from-transparent via-sky-400/40 to-sky-400/80',
        headingLineRight: 'bg-gradient-to-l from-transparent via-sky-400/40 to-sky-400/80',
        idColor: 'text-sky-400/80',
      };
    case 'Member':
      // Smoked Titanium Charcoal
      return {
        cardBorder: 'border-zinc-700/50 hover:border-zinc-500',
        cardBg: 'bg-gradient-to-r from-zinc-900/40 via-[#0C0D12]/95 to-[#08090C]/95',
        glow: 'shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.06)]',
        avatarBorder: 'border-zinc-700/40',
        avatarBg: 'bg-gradient-to-br from-zinc-800/40 via-zinc-900/40 to-black',
        avatarText: 'text-zinc-300',
        roleText: 'text-zinc-400',
        headingText: 'text-zinc-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]',
        headingLineLeft: 'bg-gradient-to-r from-transparent via-zinc-600/40 to-zinc-500/70',
        headingLineRight: 'bg-gradient-to-l from-transparent via-zinc-600/40 to-zinc-500/70',
        idColor: 'text-zinc-500',
      };
  }
};

// Format Facebook handle for display
const getFacebookHandle = (url?: string, name?: string) => {
  if (!url) return 'facebook.com';
  try {
    const clean = url.replace(/^https?:\/\/(www\.)?facebook\.com\//, '');
    if (clean.startsWith('profile.php') || clean.startsWith('share/')) {
      const slug = name ? name.toLowerCase().replace(/[^a-z0-9]/g, '.') : 'profile';
      return `facebook.com/${slug}`;
    }
    return `facebook.com/${clean.split('?')[0].replace(/\/$/, '')}`;
  } catch {
    return 'facebook.com';
  }
};

// Theme tokens for the Facebook hover profile popup card
const getPopupTheme = (role: MemberRole) => {
  switch (role) {
    case 'Founder':
      return {
        cardBorder: 'border-white/20',
        bannerGradient: 'from-white/[0.14] via-zinc-800/25 to-[#0C0D12]',
        avatarRing: 'from-white via-slate-200 to-zinc-600 shadow-[0_0_20px_rgba(255,255,255,0.22)]',
        avatarText: 'text-white',
        badgeBorder: 'border-white/30 bg-white/10 text-white',
        badgeIcon: 'crown',
        button: 'border-white/25 hover:border-white/60 bg-white/[0.06] hover:bg-white/15 text-white',
      };
    case 'Leader':
      return {
        cardBorder: 'border-red-500/30',
        bannerGradient: 'from-red-950/70 via-red-950/25 to-[#0C0D12]',
        avatarRing: 'from-red-500 via-red-700 to-red-950 shadow-[0_0_20px_rgba(239,68,68,0.35)]',
        avatarText: 'text-red-400',
        badgeBorder: 'border-red-500/40 bg-red-500/10 text-red-400',
        badgeIcon: 'swords',
        button: 'border-red-500/40 hover:border-red-500/80 bg-red-500/[0.06] hover:bg-red-500/15 text-red-400 hover:text-red-300',
      };
    case 'Support':
      return {
        cardBorder: 'border-sky-400/30',
        bannerGradient: 'from-sky-950/70 via-blue-950/25 to-[#0C0D12]',
        avatarRing: 'from-sky-400 via-blue-700 to-sky-950 shadow-[0_0_20px_rgba(56,189,248,0.35)]',
        avatarText: 'text-sky-300',
        badgeBorder: 'border-sky-400/40 bg-sky-400/10 text-sky-400',
        badgeIcon: 'shield',
        button: 'border-sky-400/40 hover:border-sky-400/80 bg-sky-400/[0.06] hover:bg-sky-400/15 text-sky-400 hover:text-sky-300',
      };
    case 'Member':
      return {
        cardBorder: 'border-zinc-500/30',
        bannerGradient: 'from-zinc-800/40 via-zinc-900/20 to-[#0C0D12]',
        avatarRing: 'from-zinc-300 via-zinc-500 to-zinc-800 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
        avatarText: 'text-zinc-200',
        badgeBorder: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-300',
        badgeIcon: 'zap',
        button: 'border-zinc-500/40 hover:border-zinc-300 bg-white/[0.05] hover:bg-white/10 text-zinc-200',
      };
  }
};

const renderRoleIcon = (icon: string) => {
  switch (icon) {
    case 'crown':
      return (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
      );
    case 'swords':
      return (
        <svg className="w-3 h-3 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
          <path d="M13 19l6-6" />
          <path d="M16 16l4 4" />
          <path d="M19 21l2-2" />
        </svg>
      );
    case 'shield':
      return (
        <svg className="w-3 h-3 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
  }
};

// Facebook button with the smooth bouncy hover profile popup card
function FacebookPopupButton({
  member,
  popup,
  size = 'normal',
}: {
  member: Member;
  popup: ReturnType<typeof getPopupTheme>;
  size?: 'normal' | 'compact';
}) {
  const btnClasses = size === 'compact'
    ? 'w-7 h-7 rounded-lg'
    : 'w-8 h-8 sm:w-8 sm:h-8 rounded-xl';
  const iconClasses = size === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="relative group/fb flex-shrink-0">
      <a
        href={member.facebook}
        target="_blank"
        rel="noopener noreferrer"
        title="Facebook Profile"
        aria-label="Facebook Profile"
        className={`${btnClasses} bg-white/[0.04] border border-white/15 hover:border-white/50 text-zinc-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm`}
      >
        <svg className={`${iconClasses} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>

      {/* Bouncy Hover Profile Card Popup */}
      <div className="invisible group-hover/fb:visible opacity-0 scale-90 -translate-y-2 group-hover/fb:opacity-100 group-hover/fb:scale-100 group-hover/fb:translate-y-0 group-hover/fb:animate-popup-bounce transition-all duration-200 origin-bottom-right absolute bottom-full right-0 mb-3 z-50 pointer-events-auto">
        {/* Invisible Hover Bridge to prevent premature closing */}
        <div className="absolute -bottom-3 left-0 right-0 h-4" />

        {/* The Profile Mini Card */}
        <div className={`w-64 rounded-2xl bg-[#0C0D12] border ${popup.cardBorder} shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(0,0,0,0.85)] overflow-hidden text-left`}>
          {/* Header Banner Area */}
          <div className={`h-16 bg-gradient-to-b ${popup.bannerGradient} relative p-3 flex items-start justify-between`}>
            {/* Avatar with Metallic Glowing Ring */}
            <div className={`w-14 h-14 rounded-full p-[2px] bg-gradient-to-b ${popup.avatarRing} relative -mb-7 mt-0.5`}>
              <div className="w-full h-full rounded-full bg-[#0C0D12] flex items-center justify-center overflow-hidden border border-black/40">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className={`font-anton text-2xl uppercase ${popup.avatarText}`}>
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {/* Facebook Watermark Icon in Top Right */}
            <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
          </div>

          {/* Card Body Info */}
          <div className="px-4 pb-4 pt-5 flex flex-col gap-2.5">
            <div>
              <h4 className="text-base font-bold text-white font-sans tracking-wide leading-tight truncate">
                {member.name}
              </h4>
              <p className="text-xs text-zinc-400 font-sans truncate mt-0.5">
                {getFacebookHandle(member.facebook, member.name)}
              </p>
            </div>

            {/* Role Badge */}
            <div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border ${popup.badgeBorder} text-[10px] font-mono font-bold tracking-wider uppercase`}>
                {renderRoleIcon(popup.badgeIcon)}
                <span>{member.role}</span>
              </div>
            </div>

            {/* View Profile Action Button */}
            <a
              href={member.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1 w-full py-2.5 px-3 rounded-xl border ${popup.button} text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all duration-200 group/btn shadow-sm`}
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>View Profile</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Member Card with Wide (Founder/Leader) and Compact (Support/Member 5-column) variants
function MemberCard({ 
  member, 
  variant = 'wide',
}: { 
  member: Member; 
  variant?: 'wide' | 'compact';
}) {
  const theme = getRoleTheme(member.role);
  const popup = getPopupTheme(member.role);

  const roleLabel = member.role === 'Founder' 
    ? 'FOUNDER' 
    : member.role === 'Leader' 
    ? 'LEADER' 
    : member.role === 'Support' 
    ? 'SUPPORT' 
    : 'MEMBERS';

  if (variant === 'wide') {
    return (
      <div 
        className={`rounded-2xl border ${theme.cardBorder} ${theme.cardBg} ${theme.glow} p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 hover:-translate-y-0.5 relative group/card`}
      >
        {/* Left: Square avatar with rounded corners */}
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border ${theme.avatarBorder} ${theme.avatarBg} flex-shrink-0 flex items-center justify-center relative shadow-inner`}>
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <span className={`text-xl sm:text-2xl font-rajdhani font-bold ${theme.avatarText}`}>
              {member.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Middle: Member Name & ID */}
        <div className="flex-1 min-w-0 pr-1">
          <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide truncate group-hover/card:text-zinc-100 transition-colors">
            {member.name}
          </h3>
          <p className={`text-[11px] font-mono mt-0.5 ${theme.idColor}`}>
            {member.memberId}
          </p>
        </div>

        {/* Right: Role text + Facebook Button */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <span className={`font-rajdhani font-bold text-xs sm:text-sm tracking-[0.2em] uppercase ${theme.roleText}`}>
            {roleLabel}
          </span>
          {member.facebook && (
            <FacebookPopupButton member={member} popup={popup} size="normal" />
          )}
        </div>
      </div>
    );
  }

  // Compact variant for 5-column grid (Support & Member)
  return (
    <div 
      className={`rounded-xl border ${theme.cardBorder} ${theme.cardBg} ${theme.glow} p-2.5 sm:p-3 flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 relative group/card`}
    >
      {/* Left: Square avatar with rounded corners */}
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden border ${theme.avatarBorder} ${theme.avatarBg} flex-shrink-0 flex items-center justify-center relative shadow-inner`}>
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <span className={`text-base sm:text-lg font-rajdhani font-bold ${theme.avatarText}`}>
            {member.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Middle: Member Name & ID */}
      <div className="flex-1 min-w-0">
        <h3 
          className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide truncate group-hover/card:text-zinc-100 transition-colors"
          title={member.name}
        >
          {member.name}
        </h3>
        <p className={`text-[10px] font-mono ${theme.idColor} truncate`}>
          {member.memberId}
        </p>
      </div>

      {/* Right: Role text + Facebook Button */}
      <div className="flex flex-col items-end justify-center gap-1 flex-shrink-0">
        <span className={`font-rajdhani font-bold text-[10px] sm:text-[11px] tracking-wider uppercase ${theme.roleText}`}>
          {roleLabel}
        </span>
        {member.facebook && (
          <FacebookPopupButton member={member} popup={popup} size="compact" />
        )}
      </div>
    </div>
  );
}
