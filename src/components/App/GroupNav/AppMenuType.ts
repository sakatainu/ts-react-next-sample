export const appMenuItemTypes = [
  'analytics',
  'compare',
  'reports',
  'news',
  'notifications',
] as const;

export type AppMenuItemType = typeof appMenuItemTypes[number];
export type MaybeAppMenuItemType = AppMenuItemType | undefined;
