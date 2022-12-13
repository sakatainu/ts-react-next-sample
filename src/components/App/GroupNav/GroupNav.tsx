import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import {
  DataTable as ListIcon,
  DocumentSearch as DocumentSearchIcon,
  Graph as GraphIcon,
  GraphCompare as GraphCompareIcon,
} from '~/components/icon';
import AppSideMenu from '~/components/ui/AppSideMenu';
import { useGroupContext } from '~/contexts/GroupContext';
import {
  AppMenuItemType,
  appMenuItemTypes,
  MaybeAppMenuItemType,
} from './AppMenuType';
import NotificationIcon from './NotificationIcon';
import { Compare } from './subNavs';

const groupHomePathname = '/home/groups/[groupId]';
const groupHomePath = '/home/groups';

const subNavMap: Record<AppMenuItemType, React.ReactNode> = {
  compare: <Compare path="/compare" />,
  analytics: null,
  news: null,
  notifications: null,
  reports: <Compare path="/reports" />,
};

export const getCurrentMenu = (
  pathname: string
): AppMenuItemType | undefined => {
  if (!pathname.startsWith(groupHomePathname)) return undefined;

  const fileName = pathname.replace(`${groupHomePathname}/`, '');
  return appMenuItemTypes.find((v) => v === fileName);
};

const GroupNav = () => {
  const router = useRouter();
  const { group } = useGroupContext();
  const [selectedMenu, setSelectedMenu] = useState<MaybeAppMenuItemType>(
    getCurrentMenu(router.pathname)
  );

  const subNav = useMemo(
    () => selectedMenu && subNavMap[selectedMenu],
    [selectedMenu]
  );

  return (
    <AppSideMenu
      selectedMenu={selectedMenu}
      appMenu={[
        {
          name: 'analytics',
          label: '自社分析',
          Icon: GraphIcon,
          path: `${groupHomePath}/${group.id}/analytics`,
        },
        {
          name: 'compare',
          label: '企業比較',
          Icon: GraphCompareIcon,
        },
        {
          name: 'reports',
          label: '指標比較',
          Icon: ListIcon,
        },
        {
          name: 'news',
          label: 'ニュース検索',
          Icon: DocumentSearchIcon,
          path: `${groupHomePath}/${group.id}/news`,
        },
        {
          name: 'notifications',
          label: 'カスタムアラート',
          Icon: NotificationIcon,
          path: `${groupHomePath}/${group.id}/notifications`,
        },
      ]}
      subMenu={subNav}
      subMenuWidth={240}
      onClickMenu={(menu) => setSelectedMenu(menu as AppMenuItemType)}
    />
  );
};

export default GroupNav;
