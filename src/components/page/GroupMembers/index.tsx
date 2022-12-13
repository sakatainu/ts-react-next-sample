import { Button } from '@mui/material';
import { useModal } from 'mui-modal-provider';
import { useSnackbar } from 'notistack';
import GroupNav from '~/components/App/GroupNav';
import ConfirmDialog from '~/components/ui/ConfirmDialog';
import ProgressBox from '~/components/ui/ProgressBox';
import UserInvitationDialog from '~/components/ui/UserInvitationDialog';
import GroupContext, { useGroupContext } from '~/contexts/GroupContext';
import SignedInUserContext from '~/contexts/SignedInUserContext';
import useGroupMemberDispatcher from '~/hooks/useGroupMemberDispatcher';
import useGroupMembers from '~/hooks/useGroupMembers';
import { inspectString } from '~/utils/inspect';

import Template, { TemplateProps } from './Template';

const Container = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { showModal } = useModal();

  const { group } = useGroupContext();
  const { fetching, data } = useGroupMembers(group.id);
  const { inviteGroupMember, updateMemberRole, deleteGroupMember } =
    useGroupMemberDispatcher();

  const handleClickInviteMember = () => {
    const modal = showModal(UserInvitationDialog, {
      title: 'ユーザーの招待',
      onSubmit: async (e) => {
        e.preventDefault();
        const form = new FormData(e.target as HTMLFormElement);

        try {
          const email = form.get('email')?.toString();
          const userName = form.get('userName')?.toString();
          const groupRole = form.get('groupRole')?.toString();

          const { error: errorInvite } = await inviteGroupMember({
            groupId: group.id,
            email: inspectString(email),
            name: inspectString(userName),
            role: groupRole as 'owner' | 'member',
          });

          if (errorInvite) throw errorInvite;
          enqueueSnackbar('招待を送信しました。', { variant: 'success' });
        } catch (err) {
          enqueueSnackbar('招待の送信に失敗しました。', { variant: 'error' });
          console.error(err);
        }

        modal.destroy();
      },
    });
  };

  const handleChangeMemberRole: TemplateProps['onChangeMemberRole'] = (
    target,
    e
  ) => {
    const newRoleName = e.target.value === 'owner' ? 'オーナー' : 'メンバー';
    const doUpdateMemberRole = async () => {
      const { error: $error } = await updateMemberRole({
        groupId: group.id,
        newRole: e.target.value as 'owner' | 'member',
        userId: target.userId,
      });

      if ($error) {
        enqueueSnackbar('ロールの変更に失敗しました。', {
          variant: 'error',
        });
        console.error($error);
      } else {
        enqueueSnackbar(`ロールを "${newRoleName}" に変更しました。`, {
          variant: 'success',
        });
      }
    };

    const modal = showModal(ConfirmDialog, {
      title: 'ロール変更',
      message: `ロールを "${newRoleName}" に変更します。よろしいですか？`,
      actions: [
        <Button key="1" onClick={() => modal.destroy()} autoFocus>
          キャンセル
        </Button>,
        <Button
          key="2"
          onClick={() => {
            (async () => {
              await doUpdateMemberRole();
              modal.destroy();
            })();
          }}
          variant="contained"
          color="primary"
        >
          OK
        </Button>,
      ],
    });
  };

  const handleClickDeleteMember: TemplateProps['onClickDeleteMember'] = (
    target
  ) => {
    const targetUserName = target.user?.name || target.groupInvitation?.name;

    const doDeleteMember = async () => {
      const { error: $error } = await deleteGroupMember({
        groupId: group.id,
        userId: target.userId,
      });

      if ($error) {
        enqueueSnackbar('ユーザーの削除に変更に失敗しました。', {
          variant: 'error',
        });
        console.error($error);
      } else {
        enqueueSnackbar(`ユーザーを削除しました。`, {
          variant: 'success',
        });
      }
    };

    const modal = showModal(ConfirmDialog, {
      title: 'ユーザー削除',
      message: `"${group.name}" から "${String(
        targetUserName
      )}" を削除します。よろしいですか？`,
      actions: [
        <Button key="1" onClick={() => modal.destroy()} autoFocus>
          キャンセル
        </Button>,
        <Button
          key="2"
          onClick={() => {
            (async () => {
              await doDeleteMember();
              modal.destroy();
            })();
          }}
          variant="contained"
          color="error"
        >
          OK
        </Button>,
      ],
    });
  };

  if (fetching) return <ProgressBox />;

  return (
    <Template
      groupMembers={data?.memberships || []}
      onClickInviteMember={handleClickInviteMember}
      onChangeMemberRole={handleChangeMemberRole}
      onClickDeleteMember={handleClickDeleteMember}
      onClickReinvite={() => null} // TODO: 再招待
    />
  );
};

const GroupMembers = () => (
  <SignedInUserContext>
    <GroupContext>
      <GroupNav />
      <Container />
    </GroupContext>
  </SignedInUserContext>
);

export default GroupMembers;
