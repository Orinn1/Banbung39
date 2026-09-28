'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Crown, Star, User } from 'lucide-react';
import { Member, MemberRole } from '@/data/members';
import { FacebookIcon, InstagramIcon, DiscordIcon } from './SocialIcons';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // Role badge styling
  const getRoleBadge = (role: MemberRole) => {
    switch (role) {
      case 'Founder':
        return {
          label: 'FOUNDER',
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/30',
          icon: <Crown className="w-3 h-3 text-red-400" />,
        };
      case 'Leader':
        return {
          label: 'LEADER',
          bg: 'bg-orange-500/10',
          text: 'text-orange-400',
          border: 'border-orange-500/30',
          icon: <Star className="w-3 h-3 text-orange-400" />,
        };
      case 'Co-Leader':
        return {
          label: 'CO-LEADER',
          bg: 'bg-amber-500/10',
          text: 'text-amber-300',
          border: 'border-amber-500/30',
          icon: <ShieldCheck className="w-3 h-3 text-amber-300" />,
        };
      default:
        return {
          label: 'MEMBER',
          bg: 'bg-zinc-800/60',
          text: 'text-zinc-300',
          border: 'border-zinc-700/50',
          icon: <User className="w-3 h-3 text-zinc-400" />,
        };
    }
  };

  const badge = getRoleBadge(member.role);
  const isActive = member.status === 'Active';

  return (
    <div className="group relative flex flex-col bg-[#111319] rounded-lg border border-white/[0.08] hover:border-red-600/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover overflow-hidden">
      {/* Top ID & Status header */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/[0.05] bg-[#0D0F14]">
        <span className="text-xs font-mono font-semibold text-zinc-400">
          {member.memberId}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'
            }`}
          />
          <span className={`text-[11px] font-mono tracking-wider ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {member.status}
          </span>
        </div>
      </div>

      {/* Main Profile Info */}
      <Link href={`/members/${member.id}`} className="p-4 flex-1 flex flex-col">
        {/* Avatar Container */}
        <div className="relative aspect-square w-full rounded-md overflow-hidden bg-[#181B24] border border-white/[0.06] mb-3.5">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
            loading="lazy"
          />
          {/* Subtle gradient vignette at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111319]/80 via-transparent to-transparent pointer-events-none" />

          {/* Role Badge pinned at bottom-left of avatar */}
          <div className="absolute bottom-2.5 left-2.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {badge.icon}
              {badge.label}
            </span>
          </div>
        </div>

        {/* Name and Nickname */}
        <div className="mb-2">
          <h3 className="text-base font-bold font-display text-white group-hover:text-red-400 transition-colors uppercase tracking-tight truncate">
            {member.name}
          </h3>
          <p className="text-xs font-mono text-zinc-400 truncate">
            {member.username}
          </p>
        </div>

        {/* Member Specialty / Role Description */}
        {member.specialty && (
          <p className="text-[11px] text-zinc-400 line-clamp-1 mb-3">
            {member.specialty}
          </p>
        )}
      </Link>

      {/* Footer Area: Socials & "VIEW PROFILE" on hover */}
      <div className="px-4 py-2.5 border-t border-white/[0.06] bg-[#0E1015] flex items-center justify-between min-h-[46px] relative">
        {/* Default: Social Icons */}
        <div className="flex items-center gap-2 group-hover:opacity-20 transition-opacity">
          {member.facebook && (
            <a
              href={member.facebook}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {member.discord && (
            <a
              href={member.discord}
              target="_blank"
              rel="noopener noreferrer"
              title="Discord"
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <DiscordIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Hover Action: VIEW PROFILE Button */}
        <div className="absolute inset-x-0 bottom-0 top-0 px-3 flex items-center justify-end opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 bg-[#0E1015]">
          <Link
            href={`/members/${member.id}`}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-semibold tracking-wider text-white bg-red-600 hover:bg-red-700 rounded transition-colors uppercase border border-red-500/30"
          >
            <span>VIEW PROFILE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
