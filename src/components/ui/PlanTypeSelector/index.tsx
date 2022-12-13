import { useMemo } from 'react';
import BasicSelector, {
  BasicSelectorItem,
  BasicSelectorProps,
} from '~/components/ui/BasicSelector';
import { useMasterTypesContext } from '~/contexts/MasterTypesContext';

const PlanTypeSelector = (props: Omit<BasicSelectorProps, 'items'>) => {
  const { planTypes } = useMasterTypesContext();

  const items = useMemo<BasicSelectorItem[]>(
    () =>
      planTypes.map(({ code, label }) => ({
        value: code,
        label: label[0].text,
      })),
    [planTypes]
  );

  return <BasicSelector items={items} label="プラン" {...props} />;
};
export default PlanTypeSelector;
