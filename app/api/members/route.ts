import { NextResponse } from 'next/server';
import { MEMBERS_DATA } from '@/data/members';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const role = searchParams.get('role');
  const status = searchParams.get('status');

  let filtered = [...MEMBERS_DATA];

  if (search) {
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(search) ||
        (m.username && m.username.toLowerCase().includes(search)) ||
        m.nickname.toLowerCase().includes(search) ||
        m.id.includes(search) ||
        m.memberId.toLowerCase().includes(search)
    );
  }

  if (role && role !== 'All') {
    filtered = filtered.filter((m) => m.role.toLowerCase() === role.toLowerCase());
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((m) => m.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}
