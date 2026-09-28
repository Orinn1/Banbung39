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
