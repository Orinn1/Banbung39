import { NextResponse } from 'next/server';
import { getMemberById } from '@/data/members';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const member = getMemberById(id);

  if (!member) {
    return NextResponse.json(
      { success: false, error: 'Member not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: member,
  });
}
