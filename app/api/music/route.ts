import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const MUSIC_CONFIG_PATH = path.join(process.cwd(), 'data', 'music.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

interface MusicConfig {
  title: string;
  artist: string;
  url: string;
}

const DEFAULT_CONFIG: MusicConfig = {
  title: 'BANBUNG39',
  artist: 'By.Mike Winterfell',
  url: '/music.mp3',
};

async function getMusicConfig(): Promise<MusicConfig> {
  // 1. Try reading from Firebase Firestore
  try {
    const snap = await getDoc(doc(db, 'settings', 'music'));
    if (snap.exists()) {
      const data = snap.data() as MusicConfig;
      fs.writeFile(MUSIC_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8').catch(() => {});
      return data;
    }
  } catch (err: any) {
    console.warn('Firestore music read warning:', err.message);
  }

  // 2. Fallback to local JSON file
  try {
    const raw = await fs.readFile(MUSIC_CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function GET() {
  const config = await getMusicConfig();
  return NextResponse.json({
    success: true,
    data: config,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string | null;
    const artist = formData.get('artist') as string | null;
    const file = formData.get('file') as File | null;

    const currentConfig = await getMusicConfig();
    let musicUrl = currentConfig.url;

    // If an MP3 file was uploaded
    if (file && typeof file === 'object' && file.size > 0) {
      // Validate audio file
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.mp3') && !file.type.includes('audio')) {
        return NextResponse.json(
          { success: false, error: 'กรุณาอัปโหลดไฟล์นามสกุล .mp3 เท่านั้น (Only .mp3 files allowed)' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const targetFileName = 'music.mp3';
      const targetFilePath = path.join(PUBLIC_DIR, targetFileName);

      await fs.writeFile(targetFilePath, buffer);
      musicUrl = `/music.mp3?t=${Date.now()}`;
    }

    const updatedConfig: MusicConfig = {
      title: title?.trim() || currentConfig.title || 'BANBUNG39',
      artist: artist?.trim() || currentConfig.artist || 'By.Mike Winterfell',
      url: musicUrl,
    };

    // 1. Save to Firebase Firestore
    try {
      await setDoc(doc(db, 'settings', 'music'), updatedConfig, { merge: true });
    } catch (fsErr: any) {
      console.warn('Firestore music setDoc warning:', fsErr.message);
    }

    // 2. Save to local JSON file
    await fs.writeFile(MUSIC_CONFIG_PATH, JSON.stringify(updatedConfig, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'อัปเดตเพลงสำเร็จเรียบร้อย',
      data: updatedConfig,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to upload music' },
      { status: 500 }
    );
  }
}
