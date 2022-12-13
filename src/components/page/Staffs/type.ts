export const staffStatusTypes = ['active', 'invited'] as const;
export type StaffStatusType = typeof staffStatusTypes[number];
// export const staffStatusMap: Record<StaffStatusType, string> = {
//   active: 'アクティブ',
//   invited: '招待承認待ち'
// }

export type InvitingStaff = {
  name: string;
  email: string;
  status: StaffStatusType;
};

export type Staff = {
  id: string;
  name: string;
  email: string;
  status: StaffStatusType;
};
