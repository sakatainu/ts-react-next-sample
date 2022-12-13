import { Button } from '@mui/material';
import { useModal } from 'mui-modal-provider';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GroupNav from '~/components/App/GroupNav';
import ConfirmDialog from '~/components/ui/ConfirmDialog';
import Row from '~/components/ui/Row';
import UserGroupEventFormDialog, {
  UserGroupEventFormDialogProps,
} from '~/components/ui/UserGroupEventFormDialog';
import GroupContext, { useGroupContext } from '~/contexts/GroupContext';
import SignedInUserContext from '~/contexts/SignedInUserContext';
import useGroupEventDispatcher from '~/hooks/useGroupEventDispatcher';
import useNewsItems from '~/hooks/useNewsItems';
import useStockPrices from '~/hooks/useStockPrices';
import { GroupEventType } from '~/types/graphql';
import { distinct } from '~/utils';
import Template, { TechnicalIndicatorType } from './Template';

export type AnalyticsProps = {
  group: {
    id: GroupId;
    name: string;
    stockIssue: StockIssue;
  };
};

const Inner = ({ group }: AnalyticsProps) => {
  const groupStockIssue = group.stockIssue;
  const [selectedIndicators, setSelectedIndicators] = useState<
    TechnicalIndicatorType[]
  >([]);
  const [selectedCompares, setSelectedCompares] = useState<string[]>([]);
  const [openGroupEventFormDialog, setOpenGroupEventFormDialog] =
    useState(false);

  const [groupEventFormState, setGroupEventFormState] =
    useState<UserGroupEventFormDialogProps['initialState']>();

  const { result: stockPricesResult, fetching: fetchingStockPrices } =
    useStockPrices([groupStockIssue.code]);

  const { result: compares } = useStockPrices(selectedCompares);

  const { result: newsItemsResult } = useNewsItems(group.id, {
    condition: { stockIssueCodes: [groupStockIssue.code] },
  });

  const {
    deleteDispatcher: deleteGroupEvent,
    insertDispatcher: insertGroupEvent,
    updateDispatcher: updateGroupEvent,
  } = useGroupEventDispatcher(group.id);

  const handleOnChangeIndicators = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const targetValue = e.target.value as TechnicalIndicatorType;
    let newValue;
    if (checked) {
      newValue = distinct([...selectedIndicators, targetValue]);
    } else {
      newValue = selectedIndicators.filter((v) => v !== targetValue);
    }

    setSelectedIndicators(newValue);
  };

  const handleOnChangeCompares = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    let newValue;
    if (checked) {
      newValue = distinct([...selectedCompares, e.target.value]);
    } else {
      newValue = selectedCompares.filter((v) => v !== e.target.value);
    }

    setSelectedCompares(newValue);
  };

  const handleClickAddEvent = () => {
    setGroupEventFormState({
      date: stockPricesResult.at(0)?.items.at(-1)?.date,
    });
    setOpenGroupEventFormDialog(true);
  };

  const handleCloseGroupEventFromDialog = () => {
    setOpenGroupEventFormDialog(false);
  };

  const handleClickGroupEventLink = (e: unknown, groupEventId: string) => {
    const groupEvent = newsItemsResult.values.find(
      (v) => v.id === groupEventId
    );

    if (!groupEvent)
      throw new Error(`unrecognized groupEventId [${groupEventId}]`);

    setGroupEventFormState({
      id: groupEvent.id,
      type: groupEvent.type.value as GroupEventType,
      date: groupEvent.timestamp,
      memo: groupEvent.description,
    });

    setOpenGroupEventFormDialog(true);
  };

  const handleSubmitGroupEventFromDialog: UserGroupEventFormDialogProps['onSubmit'] =
    async (reason, value) => {
      const param = {
        stockIssueCode: groupStockIssue.code,
        date: value.date.toISOString(),
        eventTypeCode: value.type,
        memo: value.memo,
      };

      if (reason === 'delete') {
        if (!value.id) return;
        await deleteGroupEvent(value.id);
      } else if (reason === 'create') {
        await insertGroupEvent(param);
      } else if (reason === 'update') {
        if (!value.id) return;
        await updateGroupEvent(value.id, param);
      }

      setOpenGroupEventFormDialog(true);
    };

  return (
    <>
      <Template
        graphEditorTopToolbarProps={{
          stockIssue: groupStockIssue,
          selectedIndicators,
          onChangeSelectedIndicators: handleOnChangeIndicators,
          selectedCompares,
          onChangeCompares: handleOnChangeCompares,
        }}
        graphEditorProps={{
          loading: fetchingStockPrices,
          primarySource: stockPricesResult.at(0),
          comparesSource: compares,
          newsItemSource: newsItemsResult.values,
        }}
        newsTableProps={{
          values: newsItemsResult.values,
          onClickAddEvent: handleClickAddEvent,
          onClickGroupEventLink: handleClickGroupEventLink,
        }}
      />
      <UserGroupEventFormDialog
        open={openGroupEventFormDialog}
        initialState={groupEventFormState}
        onClose={handleCloseGroupEventFromDialog}
        onSubmit={handleSubmitGroupEventFromDialog}
      />
    </>
  );
};

const Container = () => {
  const router = useRouter();
  const { group } = useGroupContext();

  const { showModal } = useModal();

  useEffect(() => {
    if (group.stockIssue) return;

    const onConfirmed = () => {
      (async () => {
        await router.push(`/home/groups/${group.id}/info`);
      })();
    };

    showModal(ConfirmDialog, {
      title: '紐づく銘柄が設定されてません。',
      message:
        '企業アカウントに紐づく銘柄が設定されてません。銘柄を先に設定してください。',
      actions: [
        <Button key="1" onClick={onConfirmed}>
          OK
        </Button>,
      ],
    });
  }, [group.id, group.stockIssue, router, showModal]);

  if (!group.stockIssue) return null;

  return (
    <Inner
      group={{
        id: group.id,
        name: group.name,
        stockIssue: group.stockIssue,
      }}
    />
  );
};

const Analytics = () => (
  <SignedInUserContext>
    <GroupContext>
      <Row>
        <GroupNav />
        <Container />
      </Row>
    </GroupContext>
  </SignedInUserContext>
);

export default Analytics;
