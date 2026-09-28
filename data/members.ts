export type MemberRole = 'Founder' | 'Leader' | 'Support' | 'Member';
export type MemberStatus = 'Active' | 'Inactive';

export interface Member {
  id: string;
  memberId: string;
  name: string;
  nickname: string;
  role: MemberRole;
  status: MemberStatus;
  joinedDate: string;
  specialty?: string;
  bio?: string;
  discordId?: string;
}

export const MEMBERS_DATA: Member[] = [
  // FOUNDER
  {
    id: "0001",
    memberId: "#0001",
    name: "MIKE WINTERFELL",
    nickname: "Mike",
    role: "Founder",
    status: "Active",
    joinedDate: "01/01/2026",
    specialty: "Supreme Founder & High Command",
    bio: "ผู้ก่อตั้งและผู้นำสูงสุด BANBUNG39 วางรากฐานและทิศทางอำนาจของตระกูล",
    discordId: "mike_winterfell",
  },

  // LEADERS
  {
    id: "0002",
    memberId: "#0002",
    name: "ALEXANDER CROSS",
    nickname: "Alex",
    role: "Leader",
    status: "Active",
    joinedDate: "05/01/2026",
    specialty: "Tactical Operations & War Commander",
    bio: "ผู้นำทัพสายบู๊ วางแผนยุทธการและบัญชาการสงครามแก๊ง",
    discordId: "alex_cross",
  },
  {
    id: "0003",
    memberId: "#0003",
    name: "DANTE VALENTINO",
    nickname: "Dante",
    role: "Leader",
    status: "Active",
    joinedDate: "08/01/2026",
    specialty: "Clan Strategy & Frontline Captain",
    bio: "คุมวินัยกำลังพลและความพร้อมรบในทุกสถานการณ์ของตระกูล",
    discordId: "dante_bb39",
  },

  // SUPPORT
  {
    id: "0004",
    memberId: "#0004",
    name: "SEBASTIAN GRAY",
    nickname: "Gray",
    role: "Support",
    status: "Active",
    joinedDate: "10/01/2026",
    specialty: "Armory Management & Logistics",
    bio: "ดูแลคลังแสง อาวุธ ยานพาหนะ และเสบียงสงครามส่วนกลาง",
    discordId: "gray_supply",
  },
  {
    id: "0005",
    memberId: "#0005",
    name: "LUCAS NIGHT",
    nickname: "Luke",
    role: "Support",
    status: "Active",
    joinedDate: "12/01/2026",
    specialty: "Diplomacy & Public Relations",
    bio: "ประสานงานพันธมิตร ดูแลความสัมพันธ์ระหว่างแก๊งและการทูต",
    discordId: "luke_night",
  },
  {
    id: "0006",
    memberId: "#0006",
    name: "VICTOR STONE",
    nickname: "Stone",
    role: "Support",
    status: "Active",
    joinedDate: "15/01/2026",
    specialty: "Community Management & Staff Ops",
    bio: "คัดกรองสมาชิกใหม่ ดูแลความเรียบร้อยและระบบดิสคอร์ด",
    discordId: "stone_admin",
  },

  // MEMBERS
  {
    id: "0007",
    memberId: "#0007",
    name: "MARCUS 'GHOST' VANCE",
    nickname: "Ghost",
    role: "Member",
    status: "Active",
    joinedDate: "18/01/2026",
    specialty: "Reconnaissance & Sniper Scout",
    bio: "หน่วยสอดแนมแนวหน้า หาข่าวและชี้เป้าหมาย",
    discordId: "ghost_vance",
  },
  {
    id: "0008",
    memberId: "#0008",
    name: "KAIEN SHADOW",
    nickname: "Kai",
    role: "Member",
    status: "Active",
    joinedDate: "20/01/2026",
    specialty: "Close-Quarters Combat & Assault",
    bio: "หน่วยทะลวงฟัน ปะทะระยะประชิดด้วยความแม่นยำสูง",
    discordId: "kai_shadow",
  },
  {
    id: "0009",
    memberId: "#0009",
    name: "RYAN 'DRIFT' CONNER",
    nickname: "Ryan",
    role: "Member",
    status: "Active",
    joinedDate: "22/01/2026",
    specialty: "High-Speed Extraction & Driver",
    bio: "สารถีระดับพระกาฬ เชี่ยวชาญการหลบหนีและคุมพาหนะ",
    discordId: "ryan_drift",
  },
  {
    id: "0010",
    memberId: "#0010",
    name: "LEO 'BULLET' BAXTER",
    nickname: "Leo",
    role: "Member",
    status: "Active",
    joinedDate: "25/01/2026",
    specialty: "Heavy Artillery & Support Fire",
    bio: "ปืนกลหนักและอาวุธแรง คุมพื้นที่และยิงกดดันศัตรู",
    discordId: "leo_heavy",
  },
  {
    id: "0011",
    memberId: "#0011",
    name: "CHASE MERCER",
    nickname: "Chase",
    role: "Member",
    status: "Active",
    joinedDate: "28/01/2026",
    specialty: "Urban Tactics & Infiltration",
    bio: "ลอบเร้นในเมือง ยึดจุดยุทธศาสตร์สำคัญ",
    discordId: "chase_mercer",
  },
  {
    id: "0012",
    memberId: "#0012",
    name: "DOMINIC TORRES",
    nickname: "Dom",
    role: "Member",
    status: "Inactive",
    joinedDate: "02/02/2026",
    specialty: "Patrol & Defense Enforcer",
    bio: "เวรยามตรวจการณ์ ดูแลความปลอดภัยรอบพื้นที่ตระกูล",
    discordId: "dom_torres",
  },
];

export const CLAN_INFO = {
  name: "BANBUNG39",
  tag: "BB39",
  founder: "Mike Winterfell",
  year: "2K26",
  motto: "BANBUNG39 2K26",
  totalMembersCount: MEMBERS_DATA.length,
  activeMembersCount: MEMBERS_DATA.filter((m) => m.status === 'Active').length,
};

export function getMembers(): Member[] {
  return MEMBERS_DATA;
}

export function getMemberById(id: string): Member | undefined {
  return MEMBERS_DATA.find((m) => m.id === id || m.memberId.replace('#', '') === id.replace('#', ''));
}
