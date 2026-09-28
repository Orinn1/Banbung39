import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const AVATARS_DIR = path.join(process.cwd(), 'public', 'avatars');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file !== 'object' || file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'กรุณาเลือกไฟล์รูปภาพ (No image file provided)' },
        { status: 400 }
      );
    }

    // Validate file type
    const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const originalName = file.name.toLowerCase();
    const ext = path.extname(originalName) || '.png';

    if (!validExtensions.includes(ext.toLowerCase()) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'รองรับไฟล์รูปภาพนามสกุล .png, .jpg, .jpeg, .webp เท่านั้น' },
        { status: 400 }
      );
    }

    // Ensure directory exists
    await fs.mkdir(AVATARS_DIR, { recursive: true });

    // Generate safe unique filename
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const fileName = `avatar-${timestamp}-${random}${ext}`;
    const filePath = path.join(AVATARS_DIR, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/avatars/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดรูปภาพสำเร็จ',
      url: publicUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
