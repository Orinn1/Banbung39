export type MemberRole = 'Founder' | 'Leader' | 'Support' | 'Member';

export interface Member {
  id: string;
  memberId: string;
  name: string;
  role: MemberRole;
  facebook?: string;
}

export const MEMBERS_DATA: Member[] = [
  // FOUNDER
  {
    id: "0001",
    memberId: "#0001",
    name: "MIKE RAGNAROK",
    role: "Founder",
    facebook: "https://www.facebook.com/profile.php?id=61594030961114",
  },
  {
    id: "0002",
    memberId: "#0002",
    name: "FOCUS FAHPATHAN",
    role: "Founder",
    facebook: "https://www.facebook.com/profile.php?id=61593157962156",
  },
  {
    id: "0003",
    memberId: "#0003",
    name: "ŇXNGMILKII YOUNGTHUG",
    role: "Founder",
    facebook: "https://www.facebook.com/profile.php?id=61583619095119",
  },
  {
    id: "0004",
    memberId: "#0004",
    name: "BUALOY GODYOUKNOW",
    role: "Founder",
    facebook: "https://www.facebook.com/share/19niB2fFby/?mibextid=wwXIfr",
  },

  // LEADER
  {
    id: "0005",
    memberId: "#0005",
    name: "JAYPER GODNEVERDIEȘ",
    role: "Leader",
    facebook: "https://www.facebook.com/profile.php?id=61583886642792",
  },
  {
    id: "0006",
    memberId: "#0006",
    name: "PIPER FAHPATHAN",
    role: "Leader",
    facebook: "https://www.facebook.com/nongpiper00",
  },
  {
    id: "0007",
    memberId: "#0007",
    name: "JANNY WHITE",
    role: "Leader",
    facebook: "https://www.facebook.com/janny.whtie",
  },

  // SUPPORT
  {
    id: "0008",
    memberId: "#0008",
    name: "GOTJI ECLIPSE",
    role: "Support",
    facebook: "https://www.facebook.com/gotjiwinterfell",
  },
  {
    id: "0009",
    memberId: "#0009",
    name: "BXNGSNOW WINTERFELL",
    role: "Support",
    facebook: "https://www.facebook.com/snowwinterfellz",
  },
  {
    id: "0010",
    memberId: "#0010",
    name: "BIGBAS DIAMONDONSNOW",
    role: "Support",
    facebook: "https://www.facebook.com/bigbas.wtfdelta",
  },
];

export const CLAN_INFO = {
  name: "BANBUNG39",
  tag: "BB39",
  founder: "Mike Ragnarok",
  year: "2K26",
  motto: "BANBUNG39 2K26",
  totalMembersCount: MEMBERS_DATA.length,
};

export const FAMILY_INFO = CLAN_INFO;

export function getMembers(): Member[] {
  return MEMBERS_DATA;
}

export function getMemberById(id: string): Member | undefined {
  return MEMBERS_DATA.find((m) => m.id === id || m.memberId.replace('#', '') === id.replace('#', ''));
}
