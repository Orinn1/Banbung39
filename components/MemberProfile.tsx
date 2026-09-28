'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Shield,
  Radio,
  Hash,
  ExternalLink,
  Copy,
  Check,
  Phone,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Crown,
  Star,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Member, MemberRole, MEMBERS_DATA } from '@/data/members';
import { FacebookIcon, InstagramIcon, DiscordIcon, TikTokIcon } from './SocialIcons';

interface MemberProfileProps {
  member: Member;
}

export default function MemberProfile({ member }: MemberProfileProps) {
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  // Find previous and next members for seamless navigation
  const currentIndex = MEMBERS_DATA.findIndex((m) => m.id === member.id);
  const prevMember = currentIndex > 0 ? MEMBERS_DATA[currentIndex - 1] : null;
  const nextMember = currentIndex < MEMBERS_DATA.length - 1 ? MEMBERS_DATA[currentIndex + 1] : null;

  const isActive = member.status === 'Active';

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

  const handleCopyDiscord = () => {
    if (member.discordId) {
      navigator.clipboard.writeText(member.discordId);
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#12141C] border border-white/[0.08] text-xs font-mono text-zinc-400 hover:text-white hover:border-white/[0.2] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO DIRECTORY</span>
        </Link>

        {/* Prev / Next Pagination */}
        <div className="flex items-center gap-2">
          {prevMember ? (
            <Link
              href={`/members/${prevMember.id}`}
              className="p-1.5 rounded bg-[#12141C] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-red-500/40 transition-colors"
              title={`Previous: ${prevMember.name}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-1.5 rounded bg-[#12141C]/50 border border-white/[0.03] text-zinc-600 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </span>
          )}

          <span className="text-xs font-mono text-zinc-500">
            {currentIndex + 1} / {MEMBERS_DATA.length}
          </span>

          {nextMember ? (
            <Link
              href={`/members/${nextMember.id}`}
              className="p-1.5 rounded bg-[#12141C] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-red-500/40 transition-colors"
              title={`Next: ${nextMember.name}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-1.5 rounded bg-[#12141C]/50 border border-white/[0.03] text-zinc-600 cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-[#111319] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
        {/* Profile Card Header Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-red-950/40 via-[#181B26] to-[#111319] border-b border-white/[0.06] relative p-6 flex items-end">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            LOS SANTOS SYNDICATE DOSSIER • CONFIDENTIAL
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20">
          {/* Avatar + Main Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 pb-6 border-b border-white/[0.08]">
            {/* Avatar with status indicator */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-lg overflow-hidden border-2 border-white/[0.15] bg-[#161822] shadow-xl flex-shrink-0">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>

            {/* Name, Nickname & Badges */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {badge.icon}
                  {badge.label}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider border ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-emerald-500' : 'bg-zinc-500'
                    }`}
                  />
                  {member.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-white uppercase tracking-tight">
                {member.name}
              </h1>

              <div className="flex items-center gap-3 mt-1 text-sm font-mono text-zinc-400">
                <span>{member.username}</span>
                <span>•</span>
                <span className="text-zinc-500">{member.nickname}</span>
              </div>
            </div>
          </div>

          {/* Member Information Section */}
          <div className="py-6 border-b border-white/[0.08]">
            <h2 className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-sm" />
              Member Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Member ID */}
              <div className="p-3.5 bg-[#141620] border border-white/[0.05] rounded-md">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-red-500" />
                  Member ID
                </span>
                <span className="text-base font-bold font-mono text-white mt-1 block">
                  {member.memberId}
                </span>
              </div>

              {/* Joined Date */}
              <div className="p-3.5 bg-[#141620] border border-white/[0.05] rounded-md">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-red-500" />
                  Joined Date
                </span>
                <span className="text-base font-bold font-mono text-white mt-1 block">
                  {member.joinedDate}
                </span>
              </div>

              {/* Status */}
              <div className="p-3.5 bg-[#141620] border border-white/[0.05] rounded-md">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-500" />
                  Status
                </span>
                <span
                  className={`text-base font-bold font-mono mt-1 block ${
                    isActive ? 'text-emerald-400' : 'text-zinc-400'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              {/* In-Game Phone */}
              <div className="p-3.5 bg-[#141620] border border-white/[0.05] rounded-md">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-red-500" />
                  In-Game Phone
                </span>
                <span className="text-base font-bold font-mono text-zinc-300 mt-1 block">
                  {member.phone || 'N/A'}
                </span>
              </div>
            </div>

            {/* Specialty & Bio */}
            <div className="mt-4 p-4 bg-[#141620] border border-white/[0.05] rounded-md">
              <span className="text-[11px] font-mono text-zinc-500 block mb-1">
                SPECIALTY & DOSSIER PROFILE
              </span>
              <p className="text-sm font-semibold text-zinc-200">
                {member.specialty}
              </p>
              {member.bio && (
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">
                  &ldquo;{member.bio}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Social Section */}
          <div className="pt-6">
            <h2 className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-sm" />
              Social & Communications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Facebook Button */}
              {member.facebook ? (
                <a
                  href={member.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-[#141620] border border-white/[0.06] hover:border-blue-500/40 hover:bg-[#181B26] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <FacebookIcon className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-xs font-bold text-white block">Facebook</span>
                      <span className="text-[10px] font-mono text-zinc-500">Open Profile</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                </a>
              ) : (
                <div className="p-3 rounded-md bg-[#141620]/40 border border-white/[0.03] text-zinc-600 flex items-center gap-2.5 opacity-50 cursor-not-allowed">
                  <FacebookIcon className="w-4 h-4" />
                  <span className="text-xs">Facebook N/A</span>
                </div>
              )}

              {/* Discord Button */}
              {member.discord ? (
                <a
                  href={member.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-[#141620] border border-white/[0.06] hover:border-indigo-500/40 hover:bg-[#181B26] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <DiscordIcon className="w-4 h-4 text-indigo-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Discord</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {member.discordId || 'Join Server'}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                </a>
              ) : (
                <div className="p-3 rounded-md bg-[#141620]/40 border border-white/[0.03] text-zinc-600 flex items-center gap-2.5 opacity-50 cursor-not-allowed">
                  <DiscordIcon className="w-4 h-4" />
                  <span className="text-xs">Discord N/A</span>
                </div>
              )}

              {/* Instagram Button */}
              {member.instagram ? (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md bg-[#141620] border border-white/[0.06] hover:border-pink-500/40 hover:bg-[#181B26] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <InstagramIcon className="w-4 h-4 text-pink-500" />
                    <div>
                      <span className="text-xs font-bold text-white block">Instagram</span>
                      <span className="text-[10px] font-mono text-zinc-500">Open Profile</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-pink-400 transition-colors" />
                </a>
              ) : (
                <div className="p-3 rounded-md bg-[#141620]/40 border border-white/[0.03] text-zinc-600 flex items-center gap-2.5 opacity-50 cursor-not-allowed">
                  <InstagramIcon className="w-4 h-4" />
                  <span className="text-xs">Instagram N/A</span>
                </div>
              )}

              {/* TikTok / Copy Discord ID */}
              {member.discordId ? (
                <button
                  onClick={handleCopyDiscord}
                  className="flex items-center justify-between p-3 rounded-md bg-[#141620] border border-white/[0.06] hover:border-red-500/40 hover:bg-[#181B26] transition-all group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Copy className="w-4 h-4 text-red-500" />
                    <div>
                      <span className="text-xs font-bold text-white block">Copy Tag</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {copiedDiscord ? 'Copied to clipboard!' : `@${member.discordId}`}
                      </span>
                    </div>
                  </div>
                  {copiedDiscord ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400 transition-colors" />
                  )}
                </button>
              ) : (
                <div className="p-3 rounded-md bg-[#141620]/40 border border-white/[0.03] text-zinc-600 flex items-center gap-2.5 opacity-50 cursor-not-allowed">
                  <TikTokIcon className="w-4 h-4" />
                  <span className="text-xs">TikTok N/A</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
