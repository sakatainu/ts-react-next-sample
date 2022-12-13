import { Button } from '@mui/material';
import { useModal } from 'mui-modal-provider';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import ConfirmDialog from '~/components/ui/ConfirmDialog';
import UserInvitationDialog from '~/components/ui/UserInvitationDialog';
import StaffContext from '~/contexts/StaffContext';
import useStaffs from '~/hooks/useStaffs';
import useStaffsDispatcher from '~/hooks/useStaffsDispatcher';
import { inspectString } from '~/utils/inspect';
import Template, { TemplateProps } from './Template';
import { InvitingStaff, Staff } from './type';

const Container = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { showModal } = useModal();

  const { fetching, error, result } = useStaffs();
  const { insertDispatcher, deleteStaff } = useStaffsDispatcher();

  const staffsValue = useMemo<TemplateProps['staffsProps']['value']>(() => {
    if (!result) return [];

    const { invited, staff } = result;

    const invitedList = invited.map<InvitingStaff>((v) => ({
      ...v,
      status: 'invited',
    }));

    const staffList = staff.map<Staff>((v) => ({
      ...v,
      status: 'active',
    }));

    return invitedList.concat(staffList);
  }, [result]);

  useEffect(() => {
    if (!error) return;
    enqueueSnackbar('スタッフ一覧の取得に失敗しました。', { variant: 'error' });
  }, [enqueueSnackbar, error]);

  const handleClickInviteStaff = () => {
    const modal = showModal(UserInvitationDialog, {
      title: 'スタッフの招待',
      disabledRoleField: true,
      onSubmit: async (e) => {
        e.preventDefault();
        const form = new FormData(e.target as HTMLFormElement);

        try {
          const email = form.get('email')?.toString();
          const userName = form.get('userName')?.toString();
          const { error: errorInvite } = await insertDispatcher({
            email: inspectString(email),
            name: inspectString(userName),
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

  const handleClickDeleteStaff = (targetUser: User) => {
    const doDeleteStaff = () => {
      (async () => {
        await deleteStaff(targetUser.id);
      })();
    };

    const modal = showModal(ConfirmDialog, {
      title: 'スタッフの削除',
      message: 'スタッフを削除します。よろしいですか？',
      actions: [
        <Button key="1" onClick={() => modal.destroy()} autoFocus>
          キャンセル
        </Button>,
        <Button
          key="2"
          onClick={() => {
            doDeleteStaff();
            modal.destroy();
          }}
          variant="contained"
          color="error"
        >
          削除
        </Button>,
      ],
    });
  };

  return (
    <Template
      staffsProps={{
        value: staffsValue,
        loading: fetching,
      }}
      onClickInviteStaff={handleClickInviteStaff}
      onClickDeleteStaff={handleClickDeleteStaff}
    />
  );
};

const Staffs = () => (
  <StaffContext>
    <Container />
  </StaffContext>
);

export default Staffs;
