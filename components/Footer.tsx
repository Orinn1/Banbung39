'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowUp, ExternalLink } from 'lucide-react';
import { FAMILY_INFO } from '@/data/members';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#08090C] border-t border-white/[0.08] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Branding & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded bg-[#14161F] border border-white/[0.1] flex items-center justify-center text-red-500">
                <Shield className="w-3.5 h-3.5 fill-red-500/20" />
              </div>
              <span className="text-sm font-bold tracking-wider font-display text-white uppercase">
                {FAMILY_INFO.name}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Official Member Directory • {FAMILY_INFO.serverName}
            </p>
          </div>

          {/* Center: Quick Links */}
          <div className="flex items-center gap-6 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              MEMBERS
            </Link>
            <Link href="/family" className="hover:text-white transition-colors">
              ORGANIZATION
            </Link>
            <Link href="/rules" className="hover:text-white transition-colors">
              RULES
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              ABOUT
            </Link>
          </div>

          {/* Right: Social Links & Back to Top */}
          <div className="flex items-center gap-4">
            <a
              href={FAMILY_INFO.discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-[#12141C] border border-white/[0.08] hover:border-indigo-500/40 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Discord</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <a
              href={FAMILY_INFO.facebookPage}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-[#12141C] border border-white/[0.08] hover:border-blue-500/40 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded bg-[#12141C] border border-white/[0.08] hover:border-red-500/40 text-zinc-400 hover:text-white transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-600 gap-2">
          <span>&copy; 2026 {FAMILY_INFO.name}. All rights reserved.</span>
          <span>Designed for FiveM Community • Developed with Clean Tactical Precision</span>
        </div>
      </div>
    </footer>
  );
}
