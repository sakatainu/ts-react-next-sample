import { Button, Typography } from '@mui/material';
import { useModal } from 'mui-modal-provider';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useToggle } from 'react-use';
import GroupNav from '~/components/App/GroupNav';
import ConfirmDialog from '~/components/ui/ConfirmDialog';
import ProgressBox from '~/components/ui/ProgressBox';
import Row from '~/components/ui/Row';
import UserGroupEventFormDialog, {
  UserGroupEventFormDialogProps,
} from '~/components/ui/UserGroupEventFormDialog';
import GroupContext, { useGroupContext } from '~/contexts/GroupContext';
import SignedInUserContext from '~/contexts/SignedInUserContext';
import useGroupEventDispatcher from '~/hooks/useGroupEventDispatcher';
import useGroupStockIssueLists from '~/hooks/useGroupStockIssueLists';
import useNewsItems from '~/hooks/useNewsItems';
import useStockIssues from '~/hooks/useStockIssues';
import useStockPrices from '~/hooks/useStockPrices';
import useWatchFolder, {
  InputGroupStockIssueList,
} from '~/hooks/useWatchFolder';
import {
  GroupEventType,
  GroupListedStockIssueId,
  GroupStockIssueListId,
} from '~/types/graphql';
import Template, { TemplateProps } from './Template';
import {
  IndicatorType,
  StockIndexType,
  stockIndexTypes,
  TechnicalType,
  technicalTypes,
} from './types';

const defaultTitle = '新規ウォッチリスト';

type CompareStockIssue = {
  id?: GroupListedStockIssueId;
  stockIssue: StockIssue;
};

type EditObject = {
  id?: GroupStockIssueListId;
  groupId: GroupId;
  name: string;
  items: CompareStockIssue[];
};

const Inner = ({
  group,
  initialValue,
}: {
  group: Omit<Group, 'stockIssue'> & { stockIssue: StockIssue };
  initialValue: EditObject;
}) => {
  const groupStockIssue = group.stockIssue;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [, setHasChange] = useToggle(false);

  const [title, setTitle] = useState(initialValue.name);
  const [selectedCompares, setSelectedCompares] = useState<CompareStockIssue[]>(
    initialValue.items
  );

  const [selectedIndicator, setSelectedIndicator] =
    useState<IndicatorType>('close');
  const [selectedTechnicals, setSelectedTechnicals] = useState<TechnicalType[]>(
    []
  );
  const [selectedStockIndexes, setSelectedStockIndexes] = useState<
    StockIssueCode[]
  >([]);
  const [showNewsMarker, toggleShowNewsMarker] = useToggle(true);

  const [openGroupEventFormDialog, setOpenGroupEventFormDialog] =
    useState(false);

  const [groupEventFormState, setGroupEventFormState] =
    useState<UserGroupEventFormDialogProps['initialState']>();

  const { result: stockPricesResult, fetching: fetchingStockPrices } =
    useStockPrices([groupStockIssue.code]);

  const compareCodes = useMemo(
    () =>
      selectedCompares
        .map((v) => v.stockIssue.code)
        .concat(selectedStockIndexes),
    [selectedCompares, selectedStockIndexes]
  );
  const { result: compares } = useStockPrices(compareCodes);

  const { result: newsItemsResult } = useNewsItems(group.id, {
    condition: { stockIssueCodes: [groupStockIssue.code] },
  });

  const { result: stockIssues } = useStockIssues();

  const {
    deleteDispatcher: deleteGroupEvent,
    insertDispatcher: insertGroupEvent,
    updateDispatcher: updateGroupEvent,
  } = useGroupEventDispatcher(group.id);

  const {
    createDispatcher: createWatchFolder,
    updateDispatcher: updateWatchFolder,
    deleteDispatcher: deleteWatchFolder,
  } = useWatchFolder(group.id);

  const handleChangeTitle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.currentTarget.value);
  };

  const handleBlurTitle = () => {
    setTitle(title.trim());
    setHasChange(true);
  };

  const handleChangeIndicator = (e: React.FormEvent<HTMLElement>) => {
    const targetValue = (e.target as HTMLInputElement).value as IndicatorType;
    setSelectedIndicator(targetValue);
  };

  const handleChangeTechnicals = (e: React.FormEvent<HTMLElement>) => {
    const targetValue = e.target as HTMLInputElement;
    const isChecked = (type: TechnicalType) => {
      if (type === targetValue.value) return targetValue.checked;
      return selectedTechnicals.includes(type);
    };

    const newValue = technicalTypes
      .map<[TechnicalType, boolean]>((v) => [v, isChecked(v)])
      .flatMap(([k, v]) => (v ? [k] : []));

    setSelectedTechnicals(newValue);
  };

  const handleChangeStockIndexes = (e: React.FormEvent<HTMLElement>) => {
    const targetValue = e.target as HTMLInputElement;
    const isChecked = (type: StockIndexType) => {
      if (type === targetValue.value) return targetValue.checked;
      return selectedStockIndexes.includes(type);
    };

    const newValue = stockIndexTypes
      .map<[StockIndexType, boolean]>((v) => [v, isChecked(v)])
      .flatMap(([k, v]) => (v ? [k] : []));

    setSelectedStockIndexes(newValue);
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

  const handleSelectCompare: TemplateProps['stockIssueSelectorProps']['onSelectCompare'] =
    (_, v) => {
      setSelectedCompares((prev) => prev.concat([{ stockIssue: v }]));
      setHasChange(true);
    };

  const handleDeleteCompare: TemplateProps['stockIssueSelectorProps']['onDeleteCompare'] =
    (index) => {
      const newValue = [...selectedCompares];
      newValue.splice(index, 1);
      setSelectedCompares(newValue);
      setHasChange(true);
    };

  const doSaveWatchFolder = async (
    value: Omit<InputGroupStockIssueList, 'id'> & { id?: string }
  ) => {
    let groupStockIssueListId = value.id;
    let error;
    if (groupStockIssueListId) {
      const result = await updateWatchFolder({
        ...value,
        id: groupStockIssueListId,
      });
      error = result.error;
    } else {
      const result = await createWatchFolder(value);
      error = result.error;
      groupStockIssueListId = result.data?.groupStockIssueListId;
    }

    if (error || !groupStockIssueListId) {
      const message = '保存に失敗しました。時間をおいて再度お試しください。';
      enqueueSnackbar(message, { variant: 'error' });
      console.error(error);
    } else {
      const message = '保存に成功しました。';
      enqueueSnackbar(message, { variant: 'success' });
      setHasChange(false);

      if (!value.id) {
        router.query.id = groupStockIssueListId;
        delete router.query.compares;
        await router.replace(router);
      }
    }
  };

  const handleSave = async () => {
    if (!title) {
      enqueueSnackbar('ウォッチリスト名は空にできません。', {
        variant: 'error',
      });
      return;
    }

    if (!selectedCompares.length) {
      enqueueSnackbar('比較銘柄は1件以上選択する必要があります。', {
        variant: 'error',
      });
      return;
    }

    await doSaveWatchFolder({
      id: initialValue?.id,
      name: title,
      items: selectedCompares.map((v) => ({
        stockIssueCode: v.stockIssue.code,
      })),
    });
  };

  const handleSaveAs = async (saveName: string) => {
    if (!selectedCompares.length) {
      enqueueSnackbar('比較銘柄は1件以上選択する必要があります。', {
        variant: 'error',
      });
      return;
    }

    await doSaveWatchFolder({
      name: saveName,
      items: selectedCompares.map((v) => ({
        stockIssueCode: v.stockIssue.code,
      })),
    });
  };

  const handleDelete = () => {
    if (!initialValue.id) return;
    const groupStockIssueListId = initialValue.id;

    (async () => {
      const { error } = await deleteWatchFolder(groupStockIssueListId);

      if (error) {
        const message = '削除に失敗しました。時間をおいて再度お試しください。';
        enqueueSnackbar(message, { variant: 'error' });
        return;
      }

      const message = '削除に成功しました。新規作成画面を表示します。';
      enqueueSnackbar(message, { variant: 'success' });

      (async () => {
        delete router.query.id;
        delete router.query.compares;
        await router.replace(router);
      })();
    })();
  };

  return (
    <>
      <Template
        // hasChange={hasChange}
        // userGroup={userGroup}
        id={initialValue.id}
        baseProps={{
          stockIssues,
        }}
        titleProps={{
          value: title,
          onChange: handleChangeTitle,
          onBlur: handleBlurTitle,
        }}
        graphEditorTopToolbarProps={{
          value: {
            stockIssue: groupStockIssue,
            selectedIndicator,
            selectedTechnicals,
            selectedStockIndexes,
            showNewsMarker,
          },
          onChangeIndicator: handleChangeIndicator,
          onChangeTechnicals: handleChangeTechnicals,
          onChangeStockIndexes: handleChangeStockIndexes,
          onClickShowNewsMarker: () => toggleShowNewsMarker(),
        }}
        stockIssueSelectorProps={{
          values: selectedCompares,
          onSelectCompare: handleSelectCompare,
          onDeleteCompare: handleDeleteCompare,
          // onClickSelectCompares: handleClickSelectCompares,
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
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onDelete={handleDelete}
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

export type CompareProps = {
  id?: GroupStockIssueListId;
  compares?: StockIssueCode[];
};

const Container = ({
  id: maybeGroupStockIssueListId,
  compares = [],
}: CompareProps) => {
  const router = useRouter();
  const { group } = useGroupContext();
  const { stockIssue: groupStockIssue } = group;

  const { result: stockIssues } = useStockIssues();
  const {
    fetching: fetchingGroupStockIssueLists,
    result: groupStockIssueLists,
    // error: errorGroupStockIssueLists,
  } = useGroupStockIssueLists(group.id, maybeGroupStockIssueListId);

  const { showModal } = useModal();

  useEffect(() => {
    if (groupStockIssue) return;

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
  }, [group.id, groupStockIssue, router, showModal]);

  if (fetchingGroupStockIssueLists) return <ProgressBox />;

  const groupStockIssueList = maybeGroupStockIssueListId
    ? groupStockIssueLists?.value.at(0)
    : undefined;
  if (maybeGroupStockIssueListId && !groupStockIssueList) {
    // TODO: error handling
    return <Typography>ウォッチリストが取得できませんでした。</Typography>;
  }

  if (!groupStockIssue) return <ProgressBox />;

  const initialValue: EditObject = groupStockIssueList || {
    groupId: group.id,
    name: defaultTitle,
    items: compares
      .filter((v) => v !== groupStockIssue.code)
      .map((v) => stockIssues.find((si) => si.code === v))
      .filter((v): v is StockIssue => Boolean(v))
      .map<CompareStockIssue>((v) => ({
        stockIssue: v,
      })),
  };

  return (
    <Inner
      group={{
        ...group,
        stockIssue: groupStockIssue,
      }}
      initialValue={initialValue}
    />
  );
};

const Compare = (props: CompareProps) => (
  <SignedInUserContext>
    <GroupContext>
      <Row>
        <GroupNav />
        <Container {...props} />
      </Row>
    </GroupContext>
  </SignedInUserContext>
);

export default Compare;
