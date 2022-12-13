import dayjs from 'dayjs';
import { useModal } from 'mui-modal-provider';
import { useSnackbar } from 'notistack';
import { executeCreateGroup } from '~/components/page/Groups/handlers';
import EditGroupFormDialog from '~/components/ui/EditGroupFormDialog';
import ProgressBox from '~/components/ui/ProgressBox';
import SignedInUserContext from '~/contexts/SignedInUserContext';
import useGroups from '~/hooks/useGroups';
import useGroupsDispatcher from '~/hooks/useGroupsDispatcher';
import Template from './Template';

const Container = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { showModal } = useModal();

  const { fetching, result } = useGroups({});
  const { createGroup } = useGroupsDispatcher();

  const handleClickCreateGroup = () => {
    const createdAt = dayjs().startOf('D');
    const expireAt = createdAt.add(30, 'day').endOf('D');

    const modal = showModal(EditGroupFormDialog, {
      title: '企業アカウント作成',
      userGroupRole: 'staff',
      defaultValue: {
        contract: {
          maxUsers: 3,
          startAt: createdAt.toISOString(),
          expireAt: expireAt.toISOString(),
        },
      },
      onSubmit: async (formEvent) => {
        formEvent.preventDefault();

        try {
          await executeCreateGroup({
            form: new FormData(formEvent.target as HTMLFormElement),
            creator: createGroup,
          });
          enqueueSnackbar('企業アカウントを作成しました。', {
            variant: 'success',
          });
        } catch (e) {
          enqueueSnackbar('企業アカウントの作成に失敗しました。', {
            variant: 'error',
          });
          console.error(e);
        }

        modal.destroy();
      },
    });
  };

  if (fetching) return <ProgressBox />;
  return (
    <Template
      groups={result?.groups || []}
      onClickCreateGroup={handleClickCreateGroup}
    />
  );
};

const Groups = () => (
  <SignedInUserContext>
    <Container />
  </SignedInUserContext>
);

export default Groups;
