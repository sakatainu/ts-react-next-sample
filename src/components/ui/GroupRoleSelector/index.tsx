import { useMemo } from 'react';
import BasicSelector, {
  BasicSelectorItem,
  BasicSelectorProps,
} from '~/components/ui/BasicSelector';

const GroupRoleSelector = (props: Omit<BasicSelectorProps, 'items'>) => {
  const items = useMemo<BasicSelectorItem[]>(
    () => [
      { value: 'member', label: 'メンバー' },
      { value: 'owner', label: 'オーナー' },
    ],
    []
  );

  return <BasicSelector items={items} label="ロール" {...props} />;
};

export default GroupRoleSelector;
