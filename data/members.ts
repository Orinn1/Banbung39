export type MemberRole = 'Founder' | 'Leader' | 'Support' | 'Member';

export interface Member {
  id: string;
  memberId: string;
  name: string;
  role: MemberRole;
}

export const MEMBERS_DATA: Member[] = [
  // FOUNDER
  {
    id: "0001",
    memberId: "#0001",
    name: "MIKE WINTERFELL",
    role: "Founder",
  },

  // LEADERS
  {
    id: "0002",
    memberId: "#0002",
    name: "ALEXANDER CROSS",
    role: "Leader",
  },
  {
    id: "0003",
    memberId: "#0003",
    name: "DANTE VALENTINO",
    role: "Leader",
  },

  // SUPPORT
  {
    id: "0004",
    memberId: "#0004",
    name: "SEBASTIAN GRAY",
    role: "Support",
  },
  {
    id: "0005",
    memberId: "#0005",
    name: "LUCAS NIGHT",
    role: "Support",
  },
  {
    id: "0006",
    memberId: "#0006",
    name: "VICTOR STONE",
    role: "Support",
  },

  // MEMBERS
  {
    id: "0007",
    memberId: "#0007",
    name: "MARCUS 'GHOST' VANCE",
    role: "Member",
  },
  {
    id: "0008",
    memberId: "#0008",
    name: "KAIEN SHADOW",
    role: "Member",
  },
  {
    id: "0009",
    memberId: "#0009",
    name: "RYAN 'DRIFT' CONNER",
    role: "Member",
  },
  {
    id: "0010",
    memberId: "#0010",
    name: "LEO 'BULLET' BAXTER",
    role: "Member",
  },
  {
    id: "0011",
    memberId: "#0011",
    name: "CHASE MERCER",
    role: "Member",
  },
  {
    id: "0012",
    memberId: "#0012",
    name: "DOMINIC TORRES",
    role: "Member",
  },
];

export const CLAN_INFO = {
  name: "BANBUNG39",
  tag: "BB39",
  founder: "Mike Winterfell",
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
