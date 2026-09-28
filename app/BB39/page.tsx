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
  Link2,
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Music Manager states
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);
  const [musicTab, setMusicTab] = useState<'file' | 'link'>('file');
  const [musicTitle, setMusicTitle] = useState<string>('BANBUNG39');
  const [musicArtist, setMusicArtist] = useState<string>('By.Mike Winterfell');
  const [musicUrl, setMusicUrl] = useState<string>('/music.mp3');
  const [directMusicUrl, setDirectMusicUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploadingMusic, setIsUploadingMusic] = useState<boolean>(false);
  const [musicError, setMusicError] = useState<string>('');

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

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
        if (data.data.url && (data.data.url.startsWith('http://') || data.data.url.startsWith('https://'))) {
          setDirectMusicUrl(data.data.url);
          setMusicTab('link');
        }
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

  // Handle Avatar file selection from computer
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('กรุณาเลือกไฟล์รูปภาพ (.png, .jpg, .jpeg, .webp)');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFormError('');
    }
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
    setFormAvatar(DEFAULT_AVATAR);
    setAvatarFile(null);
    setAvatarPreview(DEFAULT_AVATAR);
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
    setFormAvatar(member.avatar || DEFAULT_AVATAR);
    setAvatarFile(null);
    setAvatarPreview(member.avatar || DEFAULT_AVATAR);
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
      // 1. Upload avatar image if new file was selected from computer
      let finalAvatarUrl = formAvatar.trim() || DEFAULT_AVATAR;

      if (avatarFile) {
        try {
          const uploadData = new FormData();
          uploadData.append('file', avatarFile);
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData,
          });
          const uploadResult = await uploadRes.json();
          if (uploadResult.success && uploadResult.url) {
            finalAvatarUrl = uploadResult.url;
          } else {
            setFormError(uploadResult.error || 'Failed to upload avatar image');
            setIsSubmitting(false);
            return;
          }
        } catch {
          setFormError('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
          setIsSubmitting(false);
          return;
        }
      }

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
            avatar: finalAvatarUrl,
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
            avatar: finalAvatarUrl,
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
      formData.append('title', musicTitle.trim() || 'BANBUNG39');
      formData.append('artist', musicArtist.trim() || 'By.Mike Winterfell');

      if (musicTab === 'file') {
        if (!selectedFile && !musicUrl) {
          setMusicError('กรุณาเลือกไฟล์เพลง MP3 หรือเปลี่ยนไปใช้แท็บวางลิงก์ (URL)');
          setIsUploadingMusic(false);
          return;
        }
        if (selectedFile) {
          formData.append('file', selectedFile);
        }
      } else {
        if (!directMusicUrl.trim()) {
          setMusicError('กรุณากรอกลิงก์ไฟล์เพลง (.mp3 link)');
          setIsUploadingMusic(false);
          return;
        }
        formData.append('url', directMusicUrl.trim());
      }

      const res = await fetch('/api/music', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        showToast('บันทึกและอัปเดตเพลงขึ้นระบบสำเร็จเรียบร้อย!');
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
      <div className="min-h-screen w-full bg-[#08090C] text-[#F3F4F6] flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden select-none">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0E1017]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-9 shadow-2xl backdrop-blur-2xl relative z-10 text-center">
          {/* Lock Icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-inner">
            <KeyRound className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 animate-pulse" />
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
          <p className="text-xs text-zinc-400 font-mono mb-5 sm:mb-6">
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
              className="w-full py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 shadow-lg shadow-red-950/40 active:scale-95"
            >
              UNLOCK ACCESS
            </button>
          </form>

          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-500">
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
      {/* Toast Notification (Responsive mobile full width or top right) */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 z-50 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-mono tracking-wider uppercase flex items-center justify-center sm:justify-start gap-2.5 animate-in slide-in-from-top duration-200 ${
          toast.type === 'success'
            ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
            : 'bg-red-950/95 border-red-500/50 text-red-200 shadow-red-950/50'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ADMIN TOP NAVBAR */}
      <header className="relative z-30 w-full px-3.5 sm:px-10 py-3.5 sm:py-5 bg-[#0C0E14]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black border border-white/15 overflow-hidden flex-shrink-0">
            <img src={DEFAULT_AVATAR} alt="BB39" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-white uppercase">
                BANBUNG39
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[8px] sm:text-[9px] font-mono font-bold text-red-400 uppercase">
                ADMIN
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-zinc-400 uppercase truncate max-w-[120px] sm:max-w-none">
              BACKOFFICE SYSTEM
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Music Manager Button */}
          <button
            onClick={() => setIsMusicModalOpen(true)}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Upload and Manage Music"
          >
            <Music className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="hidden sm:inline">จัดการเพลง (MUSIC)</span>
            <span className="sm:hidden text-[11px] font-semibold">เพลง</span>
          </button>

          {/* View Live Public Site */}
          <Link
            href="/members"
            target="_blank"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Open Live Public Site in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LIVE SITE</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono text-red-300 hover:text-red-200 transition-all flex items-center gap-1.5 active:scale-95"
            title="Log out from Backoffice"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </header>

      {/* MAIN ADMIN CONTENT */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3.5 sm:px-8 md:px-10 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
          {/* Total (Full width top banner on mobile, 1 col on desktop) */}
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-r from-red-950/30 via-[#0D0F16] to-[#0D0F16] border border-white/15 rounded-2xl p-3 sm:p-4 flex sm:flex-col justify-between items-center sm:items-start">
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-red-400 flex-shrink-0" /> ทั้งหมด (TOTAL)
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-2xl sm:text-3xl font-anton text-white sm:mt-1"
            >
              {stats.total}
            </span>
          </div>

          {/* Founder */}
          <div className="bg-[#0D0F16] border border-amber-400/20 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" /> FOUNDER
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-2xl sm:text-3xl font-anton text-amber-300 mt-1"
            >
              {stats.founder}
            </span>
          </div>

          {/* Leader */}
          <div className="bg-[#0D0F16] border border-red-500/20 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="w-3 h-3 text-red-400 flex-shrink-0" /> LEADER
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-2xl sm:text-3xl font-anton text-red-400 mt-1"
            >
              {stats.leader}
            </span>
          </div>

          {/* Support */}
          <div className="bg-[#0D0F16] border border-sky-400/20 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-sky-300 flex-shrink-0" /> SUPPORT
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-2xl sm:text-3xl font-anton text-sky-200 mt-1"
            >
              {stats.support}
            </span>
          </div>

          {/* Member */}
          <div className="bg-[#0D0F16] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-zinc-400 flex-shrink-0" /> MEMBER
            </span>
            <span 
              style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
              className="text-2xl sm:text-3xl font-anton text-zinc-200 mt-1"
            >
              {stats.member}
            </span>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTERS, ADD BUTTON */}
        <div className="flex flex-col gap-2.5 sm:gap-3 p-3 bg-[#0D0F16] border border-white/10 rounded-2xl shadow-xl">
          {/* Top Row: Search Box + Refresh + Add Member */}
          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อ หรือ #ID..."
                className="w-full pl-8 pr-7 py-2.5 sm:py-2 bg-[#141722] border border-white/10 focus:border-white/30 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none uppercase transition-colors"
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
              className="p-2.5 sm:p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white transition-all disabled:opacity-50 flex-shrink-0 active:scale-95"
              title="Refresh Members"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add Member Button */}
            <button
              onClick={openAddModal}
              className="px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 flex-shrink-0 active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">ADD MEMBER</span>
              <span className="sm:hidden font-semibold">เพิ่มสมาชิก</span>
            </button>
          </div>

          {/* Bottom Row: Role Filter Pills with Counter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 -mx-1 px-1">
            {(['All', 'Founder', 'Leader', 'Support', 'Member'] as const).map((r) => {
              const count = r === 'All' ? stats.total : stats[r.toLowerCase() as keyof typeof stats];
              const isSelected = selectedRoleFilter === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRoleFilter(r)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05] bg-[#141722]/60 border border-white/[0.06]'
                  }`}
                >
                  <span>{r === 'All' ? 'ทั้งหมด' : r.toUpperCase()}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MEMBERS CONTAINER */}
        <div className="bg-[#0D0F16] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="px-4 py-3 border-b border-white/[0.08] bg-[#11131C] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-medium">รายการสมาชิก</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold text-[11px]">
                {filteredMembers.length} คน
              </span>
              {searchQuery && (
                <span className="text-zinc-500 text-[11px] truncate max-w-[130px] sm:max-w-none">
                  (&ldquo;{searchQuery}&rdquo;)
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">
              เรียงรหัสประจำตัวอัตโนมัติ (#0001 &rarr; ล่าสุด)
            </span>
          </div>

          {loading ? (
            <div className="py-24 text-center flex flex-col items-center justify-center">
              <RefreshCw className="w-6 h-6 text-red-500 animate-spin mb-3" />
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                LOADING MEMBERS DATA...
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center p-4">
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
                [ ไม่พบข้อมูลสมาชิก ]
              </p>
              <button
                onClick={() => {
                  setSelectedRoleFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-xs font-mono text-white uppercase transition-colors"
              >
                ล้างตัวกรอง (RESET)
              </button>
            </div>
          ) : (
            <>
              {/* 1. MOBILE CARDS VIEW (md:hidden) - Optimized for touch, no horizontal scroll */}
              <div className="md:hidden divide-y divide-white/[0.06]">
                {filteredMembers.map((member) => {
                  const badge = getRoleBadge(member.role);
                  return (
                    <div 
                      key={member.id}
                      className="p-3.5 flex flex-col gap-3 bg-[#0D0F16] hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Top Row: Avatar + Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/15 flex-shrink-0 shadow-md">
                            <img
                              src={member.avatar || DEFAULT_AVATAR}
                              alt={member.name}
                              onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Name + ID + Role */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-white uppercase text-sm tracking-wide truncate">
                                {member.name}
                              </span>
                              <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/25 px-1.5 py-0.5 rounded">
                                {member.memberId || `#${member.id}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {/* Role Badge */}
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${badge.bg}`}>
                                {badge.icon}
                                <span>{member.role}</span>
                              </span>

                              {/* Facebook Profile Link */}
                              {member.facebook && (
                                <a
                                  href={member.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/25 px-2 py-0.5 rounded-md"
                                  title="Open Facebook Profile"
                                >
                                  <span>FACEBOOK</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Full touch width Edit & Delete buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.04]">
                        <button
                          onClick={() => openEditModal(member)}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] border border-white/10 text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs font-mono font-bold active:scale-95 shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>แก้ไข (EDIT)</span>
                        </button>

                        <button
                          onClick={() => setDeleteCandidate(member)}
                          className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 transition-all flex items-center justify-center gap-1.5 text-xs font-mono font-bold active:scale-95 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>ลบ (DELETE)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 2. DESKTOP TABLE VIEW (hidden md:block) */}
              <div className="hidden md:block overflow-x-auto">
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
                                <span>EDIT</span>
                              </button>
                              <button
                                onClick={() => setDeleteCandidate(member)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all flex items-center gap-1 text-[11px] active:scale-95"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>DELETE</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full px-4 sm:px-10 py-4 sm:py-5 border-t border-white/[0.08] bg-[#0A0B10] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono text-zinc-500 text-center sm:text-left">
        <div>BANBUNG39 • MANAGEMENT BACKOFFICE • 2K26</div>
        <div>AUTHORIZED ADMIN: BB39</div>
      </footer>

      {/* 3. ADD / EDIT MEMBER MODAL (Scrollable & Mobile Keyboard Friendly) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0E1119] border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] flex-shrink-0">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  {editingMember ? 'UPDATE RECORD' : 'CREATE RECORD (เรียงรหัสอัตโนมัติ)'}
                </span>
                <h3 
                  style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                  className="text-lg sm:text-xl font-anton text-white tracking-wider uppercase mt-0.5"
                >
                  {editingMember ? `EDIT: ${editingMember.name}` : 'ADD NEW MEMBER'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form: Scrollable */}
            <form onSubmit={handleSaveMember} className="mt-4 sm:mt-5 space-y-4 overflow-y-auto overscroll-contain pr-1 -mr-1 flex-1">
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
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
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

              {/* Avatar Upload from Computer */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  รูปโปรไฟล์สมาชิก (เลือกรูปจากเครื่อง)
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />

                <div className="flex items-center gap-3.5 p-3.5 bg-[#141723] border border-white/10 rounded-2xl">
                  {/* Avatar Preview */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black border-2 border-white/20 flex-shrink-0 flex items-center justify-center relative shadow-md">
                    <img
                      src={avatarPreview || formAvatar || DEFAULT_AVATAR}
                      alt="Avatar Preview"
                      onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <p className="text-xs font-mono font-bold text-white truncate">
                      {avatarFile
                        ? avatarFile.name
                        : formAvatar && formAvatar !== DEFAULT_AVATAR
                        ? 'รูปภาพปัจจุบัน'
                        : 'โลโก้เริ่มต้น BB39'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] border border-white/15 text-[11px] font-mono font-semibold text-white uppercase transition-colors flex items-center gap-1.5 active:scale-95"
                      >
                        <Upload className="w-3 h-3 text-emerald-400" />
                        <span>เลือกรูปจากเครื่อง</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(DEFAULT_AVATAR);
                          setFormAvatar(DEFAULT_AVATAR);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-[11px] font-mono text-zinc-400 hover:text-white uppercase transition-colors"
                      >
                        ใช้โลโก้ BB39
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-zinc-300 hover:text-white uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0E1119] border border-red-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl text-center">
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

            <div className="flex items-center justify-center gap-2.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E1119] border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 
                    style={{ fontFamily: 'var(--font-anton), "Anton", sans-serif' }}
                    className="text-lg sm:text-xl font-anton text-white tracking-wider uppercase"
                  >
                    MUSIC SETTINGS
                  </h3>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                    อัปโหลดไฟล์ MP3 จากเครื่อง
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMusicModalOpen(false);
                  setSelectedFile(null);
                  setFilePreviewUrl(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Music Form: Scrollable */}
            <form onSubmit={handleSaveMusic} className="mt-4 sm:mt-5 space-y-4 overflow-y-auto overscroll-contain pr-1 -mr-1 flex-1">
              {musicError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs font-mono text-red-200">
                  {musicError}
                </div>
              )}

              {/* Tab Selector: Upload MP3 File vs Direct Link */}
              <div className="flex rounded-xl bg-[#141723] p-1 border border-white/10 gap-1">
                <button
                  type="button"
                  onClick={() => setMusicTab('file')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    musicTab === 'file'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>อัปโหลดไฟล์ MP3</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMusicTab('link')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    musicTab === 'link'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>วางลิงก์เพลง (URL)</span>
                </button>
              </div>

              {/* Mode 1: File Upload Box */}
              {musicTab === 'file' && (
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
                    className="border-2 border-dashed border-white/20 hover:border-emerald-400/50 bg-[#141723] rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all hover:bg-[#181C2B] group"
                  >
                    <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-400 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
                    <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {selectedFile ? selectedFile.name : 'คลิกเพื่อเลือกไฟล์ MP3 จากเครื่อง'}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">
                      {selectedFile
                        ? `ขนาดไฟล์: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : 'รองรับไฟล์นามสกุล .mp3 เท่านั้น (บันทึกขึ้น Cloud อัตโนมัติ)'}
                    </p>
                  </div>
                </div>
              )}

              {/* Mode 2: Direct URL Input */}
              {musicTab === 'link' && (
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    ลิงก์ไฟล์เพลง (.MP3 Direct URL)
                  </label>
                  <input
                    type="url"
                    value={directMusicUrl}
                    onChange={(e) => setDirectMusicUrl(e.target.value)}
                    placeholder="https://.../music.mp3 หรือลิงก์ตรง Discord / Catbox / Google Drive"
                    className="w-full px-4 py-2.5 bg-[#161924] border border-white/15 focus:border-white/40 rounded-xl text-xs font-mono text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] font-mono text-zinc-500 mt-1.5">
                    สามารถวางลิงก์ไฟล์เสียง .mp3 ได้โดยตรงจากเว็บฝากไฟล์ทั่วไป หรือ Discord CDN
                  </p>
                </div>
              )}

              {/* Audio Preview if selected or existing */}
              {((musicTab === 'file' && (filePreviewUrl || musicUrl)) ||
                (musicTab === 'link' && (directMusicUrl || musicUrl))) && (
                <div className="p-3 rounded-xl bg-[#141723] border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> ตัวอย่างเสียง (PREVIEW):
                  </span>
                  <audio
                    key={musicTab === 'file' ? (filePreviewUrl || musicUrl) : (directMusicUrl || musicUrl)}
                    controls
                    src={musicTab === 'file' ? (filePreviewUrl || musicUrl) : (directMusicUrl || musicUrl)}
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
              <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsMusicModalOpen(false);
                    setSelectedFile(null);
                    setFilePreviewUrl(null);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-zinc-300 hover:text-white uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isUploadingMusic}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingMusic ? 'SAVING TO CLOUD...' : 'SAVE MUSIC'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
