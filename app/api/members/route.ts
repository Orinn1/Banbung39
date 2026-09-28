import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Member, MemberRole, MEMBERS_DATA } from '@/data/members';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'members.json');

async function readMembersFromFile(): Promise<Member[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return MEMBERS_DATA;
  }
}

async function writeMembersToFile(members: Member[]): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');
}

// GET all members (supports ?search= and ?role=)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase().trim();
    const role = searchParams.get('role');

    let list = await readMembersFromFile();

    if (search) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.id.toLowerCase().includes(search) ||
          m.memberId.toLowerCase().includes(search) ||
          m.role.toLowerCase().includes(search)
      );
    }

    if (role && role !== 'All') {
      list = list.filter((m) => m.role.toLowerCase() === role.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      total: list.length,
      data: list,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST - Add new member
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, facebook, avatar, memberId } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Member name is required' },
        { status: 400 }
      );
    }

    const validRoles: MemberRole[] = ['Founder', 'Leader', 'Support', 'Member'];
    const assignedRole: MemberRole = validRoles.includes(role) ? role : 'Member';

    const currentMembers = await readMembersFromFile();

    // Auto calculate next sequential ID if not provided
    let finalId = memberId?.replace('#', '').trim();
    if (!finalId) {
      const numericIds = currentMembers
        .map((m) => parseInt(m.id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
      finalId = String(maxId + 1).padStart(4, '0');
    }

    const newMember: Member = {
      id: finalId,
      memberId: `#${finalId}`,
      name: name.trim().toUpperCase(),
      role: assignedRole,
      facebook: facebook?.trim() || undefined,
      avatar: avatar?.trim() || undefined,
    };

    // Prepend or append depending on role hierarchy
    // Founder -> Leader -> Support -> Member
    const updated = [...currentMembers, newMember];
    await writeMembersToFile(updated);

    return NextResponse.json({
      success: true,
      message: 'Member added successfully',
      data: newMember,
      total: updated.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to add member' },
      { status: 500 }
    );
  }
}

// PUT - Update existing member
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, role, facebook, avatar, memberId } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required for update' },
        { status: 400 }
      );
    }

    const currentMembers = await readMembersFromFile();
    const cleanId = String(id).replace('#', '').trim();

    const index = currentMembers.findIndex(
      (m) => m.id === cleanId || m.memberId.replace('#', '') === cleanId
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    const existing = currentMembers[index];
    const validRoles: MemberRole[] = ['Founder', 'Leader', 'Support', 'Member'];

    const updatedMember: Member = {
      ...existing,
      name: name ? name.trim().toUpperCase() : existing.name,
      role: validRoles.includes(role) ? role : existing.role,
      memberId: memberId ? (memberId.startsWith('#') ? memberId : `#${memberId}`) : existing.memberId,
      facebook: facebook !== undefined ? facebook.trim() : existing.facebook,
      avatar: avatar !== undefined ? (avatar.trim() || undefined) : existing.avatar,
    };

    currentMembers[index] = updatedMember;
    await writeMembersToFile(currentMembers);

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a member
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required for deletion' },
        { status: 400 }
      );
    }

    const cleanId = String(id).replace('#', '').trim();
    const currentMembers = await readMembersFromFile();

    const exists = currentMembers.some(
      (m) => m.id === cleanId || m.memberId.replace('#', '') === cleanId
    );

    if (!exists) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    const updated = currentMembers.filter(
      (m) => m.id !== cleanId && m.memberId.replace('#', '') !== cleanId
    );

    await writeMembersToFile(updated);

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully',
      total: updated.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete member' },
      { status: 500 }
    );
  }
}
