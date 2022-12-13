import { useMemo } from 'react';
import BasicSelector, {
  BasicSelectorItem,
  BasicSelectorProps,
} from '~/components/ui/BasicSelector';
import { useMasterTypesContext } from '~/contexts/MasterTypesContext';

const GroupTypeSelector = (props: Omit<BasicSelectorProps, 'items'>) => {
  const { groupTypes } = useMasterTypesContext();

  const items = useMemo<BasicSelectorItem[]>(
    () =>
      groupTypes.map(({ code, label }) => ({
        value: code,
        label: label[0].text,
      })),
    [groupTypes]
  );

  return <BasicSelector items={items} label="上場区分" {...props} />;
};

export default GroupTypeSelector;
