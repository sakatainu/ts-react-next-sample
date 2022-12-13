import { useSnackbar } from 'notistack';
import GroupNav from '~/components/App/GroupNav';
import ProgressBox from '~/components/ui/ProgressBox';
import GroupContext, { useGroupContext } from '~/contexts/GroupContext';
import SignedInUserContext from '~/contexts/SignedInUserContext';
import useGroupDetail from '~/hooks/useGroupDetail';
import useGroupsDispatcher from '~/hooks/useGroupsDispatcher';
import { executeUpdateGroup } from './handlers';
import Template from './Template';

const Container = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { group, userGroupRole } = useGroupContext();
  const { fetching, error, data: groupDetail } = useGroupDetail(group.id);
  const { updateGroup } = useGroupsDispatcher();

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    (async () => {
      try {
        const form = new FormData(e.target as HTMLFormElement);
        await executeUpdateGroup({ id: group.id, form, updater: updateGroup });
        enqueueSnackbar('更新しました。', {
          variant: 'success',
        });
      } catch ($error) {
        enqueueSnackbar(
          '更新に失敗しました。時間をおいて再度お試しください。',
          {
            variant: 'error',
          }
        );
        console.error($error);
      }
    })();
  };

  if (fetching) return <ProgressBox />;
  if (error || !groupDetail?.groups_by_pk)
    throw error || new Error('Failed to get groupDetail');
  return (
    <Template
      userGroupRole={userGroupRole}
      value={groupDetail.groups_by_pk}
      onSubmit={handleSubmit}
    />
  );
};

const GroupInfo = () => (
  <SignedInUserContext>
    <GroupContext>
      <GroupNav />
      <Container />
    </GroupContext>
  </SignedInUserContext>
);

export default GroupInfo;
