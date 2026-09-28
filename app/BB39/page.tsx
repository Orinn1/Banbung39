'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  KeyRound,
  LogOut,
  X,
  Check,
  RefreshCw,
  Sparkles,
  Users,
  Crown,
  Swords,
  Shield,
  Zap,
  Music,
  Upload,
  Play,
  Pause,
  Volume2,
} from 'lucide-react';
import { Member, MemberRole, MEMBERS_DATA } from '@/data/members';

const DEFAULT_AVATAR = '/Logo.jpg';

export default function BackofficePage() {
  // Auth state - Password is BB39 (case-insensitive)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Members data state
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'All' | MemberRole>('All');

  // Member Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Member | null>(null);

  // Member Form states
  const [formName, setFormName] = useState<string>('');
  const [formRole, setFormRole] = useState<MemberRole>('Member');
  const [formMemberId, setFormMemberId] = useState<string>('');
  const [formFacebook, setFormFacebook] = useState<string>('');
  const [formAvatar, setFormAvatar] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Music Manager states
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);
  const [musicTitle, setMusicTitle] = useState<string>('BANBUNG39');
  const [musicArtist, setMusicArtist] = useState<string>('By.Mike Winterfell');
  const [musicUrl, setMusicUrl] = useState<string>('/music.mp3');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploadingMusic, setIsUploadingMusic] = useState<boolean>(false);
  const [musicError, setMusicError] = useState<string>('');

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Check saved session on client mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('bb39_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchMembers();
      fetchMusic();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch members from API
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMembers(data.data);
      } else {
        setMembers(MEMBERS_DATA);
      }
    } catch {
      setMembers(MEMBERS_DATA);
    } finally {
      setLoading(false);
    }
  };

  // Fetch music config
  const fetchMusic = async () => {
    try {
      const res = await fetch('/api/music');
      const data = await res.json();
      if (data.success && data.data) {
        setMusicTitle(data.data.title || 'BANBUNG39');
        setMusicArtist(data.data.artist || 'By.Mike Winterfell');
        setMusicUrl(data.data.url || '/music.mp3');
      }
    } catch {}
  };

  // Handle Login: Password is BB39 or bb39
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim().toUpperCase();
    if (clean === 'BB39') {
      setIsAuthenticated(true);
      sessionStorage.setItem('bb39_admin_auth', 'true');
      setPasswordError('');
      fetchMembers();
      fetchMusic();
    } else {
      setPasswordError('รหัสผ่านไม่ถูกต้อง (กรุณากรอก BB39 หรือ bb39)');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bb39_admin_auth');
    setPasswordInput('');
  };

  // Calculate next sequential ID automatically continuing from existing numbers (#0001 -> #0023 -> #0024)
  const getNextSequentialId = () => {
    const numericIds = members
      .map((m) => parseInt(m.id.replace(/\D/g, ''), 10))
      .filter((n) => !isNaN(n));
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    const nextNum = maxId + 1;
    return `#${String(nextNum).padStart(4, '0')}`;
  };

  // Open modal for Adding Member
  const openAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('Member');
    // Auto sequence from the latest old member ID
    const nextId = getNextSequentialId();
    setFormMemberId(nextId);
    setFormFacebook('');
    setFormAvatar('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing Member
  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormMemberId(member.memberId || `#${member.id}`);
    setFormFacebook(member.facebook || '');
    setFormAvatar(member.avatar || '');
    setFormError('');
    setIsModalOpen(true);
  };

  // Save Member (Add or Edit)
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('กรุณากรอกชื่อสมาชิก (Member Name is required)');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingMember) {
        // Edit existing
        const res = await fetch('/api/members', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingMember.id,
            name: formName.trim().toUpperCase(),
            role: formRole,
            memberId: formMemberId.trim(),
            facebook: formFacebook.trim() || undefined,
            avatar: formAvatar.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`แก้ไขข้อมูล ${formName.toUpperCase()} สำเร็จ`);
          setIsModalOpen(false);
          fetchMembers();
        } else {
          setFormError(data.error || 'Failed to update member');
        }
      } else {
        // Add new
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim().toUpperCase(),
            role: formRole,
            memberId: formMemberId.trim() || getNextSequentialId(),
            facebook: formFacebook.trim() || undefined,
            avatar: formAvatar.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`เพิ่มสมาชิก ${formName.toUpperCase()} เรียบร้อยแล้ว`);
          setIsModalOpen(false);
          fetchMembers();
        } else {
          setFormError(data.error || 'Failed to add member');
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Member
  const handleDeleteMember = async () => {
    if (!deleteCandidate) return;

    try {
      const res = await fetch(`/api/members?id=${encodeURIComponent(deleteCandidate.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`ลบสมาชิก ${deleteCandidate.name} เรียบร้อยแล้ว`);
        setDeleteCandidate(null);
        fetchMembers();
      } else {
        showToast(data.error || 'Failed to delete member', 'error');
      }
    } catch {
      showToast('เกิดข้อผิดพลาดในการลบสมาชิก', 'error');
    }
  };

  // Handle MP3 File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.mp3')) {
        setMusicError('กรุณาเลือกไฟล์นามสกุล .mp3 เท่านั้น');
        return;
      }
      setSelectedFile(file);
      setMusicError('');
      // Create local object URL for preview
      const preview = URL.createObjectURL(file);
      setFilePreviewUrl(preview);
    }
  };

  // Handle Upload Music
  const handleSaveMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingMusic(true);
    setMusicError('');

    try {
      const formData = new FormData();
      formData.append('title', musicTitle.trim());
      formData.append('artist', musicArtist.trim());
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await fetch('/api/music', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        showToast('อัปโหลดและบันทึกเพลงสำเร็จเรียบร้อยแล้ว!');
        setMusicUrl(data.data.url);
        setIsMusicModalOpen(false);
        setSelectedFile(null);
        setFilePreviewUrl(null);
      } else {
        setMusicError(data.error || 'Failed to upload music');
      }
    } catch (err: any) {
      setMusicError(err.message || 'Error uploading file');
    } finally {
      setIsUploadingMusic(false);
    }
  };

  // Filtered and Sorted members list: Sorted chronologically by ID (#0001 -> #0002 -> #0024)
  const filteredMembers = useMemo(() => {
    const list = members.filter((m) => {
      const matchesRole = selectedRoleFilter === 'All' || m.role === selectedRoleFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });

    // เรียงรหัสประจำตัวจากเก่าไปใหม่ (#0001 -> #0024)
    return list.sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
  }, [members, selectedRoleFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: members.length,
      founder: members.filter((m) => m.role === 'Founder').length,
      leader: members.filter((m) => m.role === 'Leader').length,
      support: members.filter((m) => m.role === 'Support').length,
      member: members.filter((m) => m.role === 'Member').length,
    };
  }, [members]);

  // Role Badge Styling Helper
  const getRoleBadge = (role: MemberRole) => {
    switch (role) {
      case 'Founder':
        return {
          bg: 'bg-amber-400/10 border-amber-400/30 text-amber-300',
          icon: <Crown className="w-3 h-3 text-amber-400" />,
        };
      case 'Leader':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-300',
          icon: <Swords className="w-3 h-3 text-red-400" />,
        };
      case 'Support':
        return {
          bg: 'bg-sky-400/10 border-sky-400/30 text-sky-200',
          icon: <Shield className="w-3 h-3 text-sky-300" />,
        };
      default:
        return {
          bg: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300',
          icon: <Zap className="w-3 h-3 text-zinc-400" />,
        };
    }
  };

  // 1. PASSWORD LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#08090C] text-[#F3F4F6] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0E1017]/95 border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-2xl relative z-10 text-center">
          {/* Lock Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <KeyRound className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>

          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
            BANBUNG39 • MANAGEMENT
          </span>
          <h1 
            style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
            className="text-2xl sm:text-3xl font-anton text-white tracking-wider uppercase mt-1 mb-2"
          >
            BB39 BACKOFFICE
          </h1>
          <p className="text-xs text-zinc-400 font-mono mb-6">
            กรุณากรอกรหัสผ่านเพื่อเข้าสู่ระบบจัดการหลังบ้าน
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError('');
                }}
                placeholder="ENTER PASSWORD (BB39)..."
                autoFocus
                className="w-full px-4 py-3 bg-[#151822] border border-white/15 focus:border-white/40 rounded-xl text-center text-sm font-mono tracking-widest text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner uppercase"
              />
              {passwordError && (
                <p className="text-xs text-red-400 font-mono mt-2 animate-bounce">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 shadow-lg shadow-red-950/40 active:scale-95"
            >
              UNLOCK ACCESS
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>PASSWORD: BB39 / bb39</span>
            <Link href="/" className="hover:text-white transition-colors">
              &larr; BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen w-full bg-[#07080B] text-[#F3F4F6] flex flex-col justify-between overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-mono tracking-wider uppercase flex items-center gap-2.5 animate-in slide-in-from-top duration-200 ${
          toast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            : 'bg-red-950/90 border-red-500/40 text-red-200'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ADMIN TOP NAVBAR */}
      <header className="relative z-30 w-full px-4 sm:px-10 py-5 bg-[#0C0E14]/85 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-white/15 overflow-hidden flex-shrink-0">
            <img src={DEFAULT_AVATAR} alt="BB39" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                BANBUNG39
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[9px] font-mono font-bold text-red-400 uppercase">
                ADMIN
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              BACKOFFICE MANAGEMENT SYSTEM
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Music Manager Button */}
          <button
            onClick={() => setIsMusicModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Upload and Manage Music"
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            <span>จัดการเพลง (MUSIC)</span>
          </button>

          {/* View Live Public Site */}
          <Link
            href="/members"
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Open Live Public Site in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LIVE SITE</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono text-red-300 hover:text-red-200 transition-all flex items-center gap-1.5 active:scale-95"
            title="Log out from Backoffice"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </header>

      {/* MAIN ADMIN CONTENT */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 md:px-10 py-6 sm:py-8 space-y-6">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {/* Total */}
          <div className="bg-[#0D0F16] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-zinc-300" /> TOTAL
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-3xl font-anton text-white mt-1"
            >
              {stats.total}
            </span>
          </div>

          {/* Founder */}
          <div className="bg-[#0D0F16] border border-amber-400/20 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> FOUNDER
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-3xl font-anton text-amber-300 mt-1"
            >
              {stats.founder}
            </span>
          </div>

          {/* Leader */}
          <div className="bg-[#0D0F16] border border-red-500/20 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-red-400" /> LEADER
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-3xl font-anton text-red-400 mt-1"
            >
              {stats.leader}
            </span>
          </div>

          {/* Support */}
          <div className="bg-[#0D0F16] border border-sky-400/20 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-sky-300 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-300" /> SUPPORT
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-3xl font-anton text-sky-200 mt-1"
            >
              {stats.support}
            </span>
          </div>

          {/* Member */}
          <div className="col-span-2 sm:col-span-1 bg-[#0D0F16] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-zinc-400" /> MEMBERS
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-3xl font-anton text-zinc-200 mt-1"
            >
              {stats.member}
            </span>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTERS, ADD BUTTON */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-[#0D0F16] border border-white/10 rounded-2xl shadow-xl">
          {/* Role Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {(['All', 'Founder', 'Leader', 'Support', 'Member'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoleFilter(r)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                  selectedRoleFilter === r
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Search Box */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH NAME OR #ID..."
                className="w-full pl-9 pr-7 py-2 bg-[#141722] border border-white/10 focus:border-white/30 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none uppercase transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchMembers}
              disabled={loading}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white transition-all disabled:opacity-50"
              title="Refresh Members"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add Member Button */}
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 flex-shrink-0 active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>ADD MEMBER</span>
            </button>
          </div>
        </div>

        {/* MEMBERS TABLE / LIST */}
        <div className="bg-[#0D0F16] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-24 text-center flex flex-col items-center justify-center">
              <RefreshCw className="w-6 h-6 text-red-500 animate-spin mb-3" />
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                LOADING MEMBERS DATA...
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center justify-center">
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
                [ NO MEMBERS FOUND ]
              </p>
              <button
                onClick={() => {
                  setSelectedRoleFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-xs font-mono text-white uppercase transition-colors"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#11131C] text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                    <th className="py-3.5 px-4 sm:px-6">MEMBER (เรียงรหัส)</th>
                    <th className="py-3.5 px-3">ROLE</th>
                    <th className="py-3.5 px-3">#ID</th>
                    <th className="py-3.5 px-3">FACEBOOK</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-xs font-mono">
                  {filteredMembers.map((member) => {
                    const badge = getRoleBadge(member.role);
                    return (
                      <tr 
                        key={member.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Member Avatar & Name */}
                        <td className="py-3 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-white/15 flex-shrink-0">
                              <img
                                src={member.avatar || DEFAULT_AVATAR}
                                alt={member.name}
                                onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-white uppercase tracking-wide group-hover:text-zinc-200">
                                {member.name}
                              </p>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                ID: {member.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${badge.bg}`}>
                            {badge.icon}
                            <span>{member.role}</span>
                          </span>
                        </td>

                        {/* Member #ID */}
                        <td className="py-3 px-3 font-bold text-zinc-200">
                          {member.memberId}
                        </td>

                        {/* Facebook Link */}
                        <td className="py-3 px-3">
                          {member.facebook ? (
                            <a
                              href={member.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1.5 text-xs truncate max-w-[220px]"
                            >
                              <span className="truncate">{member.facebook}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0 text-zinc-500" />
                            </a>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>

                        {/* Action Buttons: Edit & Delete */}
                        <td className="py-3 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(member)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all flex items-center gap-1 text-[11px] active:scale-95"
                              title="Edit Member"
                            >
                              <Edit2 className="w-3 h-3 text-amber-400" />
                              <span className="hidden sm:inline">EDIT</span>
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(member)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all flex items-center gap-1 text-[11px] active:scale-95"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span className="hidden sm:inline">DELETE</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full px-4 sm:px-10 py-5 border-t border-white/[0.08] bg-[#0A0B10] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500 text-center sm:text-left">
        <div>BANBUNG39 • MANAGEMENT BACKOFFICE • 2K26</div>
        <div>AUTHORIZED ADMIN: BB39</div>
      </footer>

      {/* 3. ADD / EDIT MEMBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0E1119] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  {editingMember ? 'UPDATE RECORD' : 'CREATE NEW RECORD (เรียงรหัสอัตโนมัติ)'}
                </span>
                <h3 
                  style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                  className="text-xl font-anton text-white tracking-wider uppercase mt-0.5"
                >
                  {editingMember ? `EDIT: ${editingMember.name}` : 'ADD NEW MEMBER'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveMember} className="mt-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs font-mono text-red-200">
                  {formError}
                </div>
              )}

              {/* Member Name */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  ชื่อสมาชิก / FACEBOOK NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. MIKE RAGNAROK"
                  className="w-full px-4 py-2.5 bg-[#161924] border border-white/15 focus:border-white/40 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none uppercase transition-colors"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  ตำแหน่ง / ROLE *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Founder', 'Leader', 'Support', 'Member'] as MemberRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormRole(r)}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        formRole === r
                          ? r === 'Founder'
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md'
                            : r === 'Leader'
                            ? 'bg-red-500/20 border-red-500 text-red-300 shadow-md'
                            : r === 'Support'
                            ? 'bg-sky-400/20 border-sky-400 text-sky-200 shadow-md'
                            : 'bg-zinc-300/20 border-white text-white shadow-md'
                          : 'bg-[#161924] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Member #ID (Auto sequenced from old ones) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    รหัสประจำตัว / MEMBER #ID
                  </label>
                  {!editingMember && (
                    <span className="text-[10px] font-mono text-emerald-400">
                      ✓ เรียงต่อจากเดิมอัตโนมัติ
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formMemberId}
                    onChange={(e) => setFormMemberId(e.target.value)}
                    placeholder="e.g. #0024"
                    className="w-full px-4 py-2.5 bg-[#161924] border border-white/15 focus:border-white/40 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none uppercase transition-colors"
                  />
                  {!editingMember && (
                    <button
                      type="button"
                      onClick={() => setFormMemberId(getNextSequentialId())}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-white/[0.08] hover:bg-white/15 text-[10px] font-mono text-zinc-300 uppercase transition-colors"
                      title="Reset to Next Sequential ID"
                    >
                      AUTO NEXT
                    </button>
                  )}
                </div>
              </div>

              {/* Facebook Profile URL */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  ลิงก์เฟสบุ๊ค / FACEBOOK URL
                </label>
                <input
                  type="text"
                  value={formFacebook}
                  onChange={(e) => setFormFacebook(e.target.value)}
                  placeholder="https://www.facebook.com/..."
                  className="w-full px-4 py-2.5 bg-[#161924] border border-white/15 focus:border-white/40 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Avatar Image URL (Optional) */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  รูปโปรไฟล์ / AVATAR URL (เว้นว่างไว้จะใช้โลโก้ BB39)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formAvatar}
                    onChange={(e) => setFormAvatar(e.target.value)}
                    placeholder="https://... หรือเว้นว่าง"
                    className="flex-1 px-4 py-2.5 bg-[#161924] border border-white/15 focus:border-white/40 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setFormAvatar(DEFAULT_AVATAR)}
                    className="px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-white uppercase transition-colors"
                  >
                    DEFAULT
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-zinc-300 hover:text-white uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'SAVING...' : editingMember ? 'SAVE CHANGES' : 'CREATE MEMBER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. DELETE CONFIRMATION MODAL */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0E1119] border border-red-500/30 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-xl font-anton text-white tracking-wider uppercase"
            >
              CONFIRM DELETION
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-2 mb-6">
              ต้องการลบสมาชิก <span className="text-white font-bold">{deleteCandidate.name}</span> ({deleteCandidate.memberId}) ใช่หรือไม่?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-zinc-300 hover:text-white uppercase transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteMember}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MUSIC MANAGEMENT MODAL (MP3 UPLOAD FROM COMPUTER) */}
      {isMusicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E1119] border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 
                    style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                    className="text-xl font-anton text-white tracking-wider uppercase"
                  >
                    MUSIC SETTINGS
                  </h3>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                    อัปโหลดไฟล์ MP3 จากคอมพิวเตอร์
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMusicModalOpen(false);
                  setSelectedFile(null);
                  setFilePreviewUrl(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Music Form */}
            <form onSubmit={handleSaveMusic} className="mt-5 space-y-4">
              {musicError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs font-mono text-red-200">
                  {musicError}
                </div>
              )}

              {/* File Upload Box */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  เลือกไฟล์เพลง (.MP3) จากเครื่องคอมพิวเตอร์
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".mp3,audio/mpeg,audio/mp3"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 hover:border-emerald-400/50 bg-[#141723] rounded-2xl p-5 text-center cursor-pointer transition-all hover:bg-[#181C2B] group"
                >
                  <Upload className="w-8 h-8 text-zinc-400 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {selectedFile ? selectedFile.name : 'คลิกเพื่อเลือกไฟล์ MP3 จากเครื่อง'}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1">
                    {selectedFile
                      ? `ขนาดไฟล์: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : 'รองรับไฟล์นามสกุล .mp3 เท่านั้น'}
                  </p>
                </div>
              </div>

              {/* Audio Preview if selected or existing */}
              {(filePreviewUrl || musicUrl) && (
                <div className="p-3 rounded-xl bg-[#141723] border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> ตัวอย่างเสียง (PREVIEW):
                  </span>
                  <audio
                    controls
                    src={filePreviewUrl || musicUrl}
                    className="w-full h-8"
                  />
                </div>
              )}

              {/* Song Title */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  ชื่อเพลง (SONG TITLE)
                </label>
                <input
                  type="text"
                  required
                  value={musicTitle}
                  onChange={(e) => setMusicTitle(e.target.value)}
                  placeholder="e.g. BANBUNG39"
                  className="w-full px-4 py-2.5 bg-[#161924] border border-white/15 focus:border-white/40 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none uppercase transition-colors"
                />
              </div>

              {/* Artist Name */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  ศิลปิน / ผู้จัดทำ (ARTIST / BY)
                </label>
                <input
                  type="text"
                  required
                  value={musicArtist}
                  onChange={(e) => setMusicArtist(e.target.value)}
                  placeholder="e.g. By.Mike Winterfell"
                  className="w-full px-4 py-2.5 bg-[#161924] border border-white/15 focus:border-white/40 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsMusicModalOpen(false);
                    setSelectedFile(null);
                    setFilePreviewUrl(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-zinc-300 hover:text-white uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isUploadingMusic}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingMusic ? 'UPLOADING...' : 'UPLOAD & SAVE'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
