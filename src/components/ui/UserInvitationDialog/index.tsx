import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  FormControl,
  TextField,
} from '@mui/material';
import React, { useMemo } from 'react';
import { useToggle } from 'react-use';
import GroupRoleSelector from '~/components/ui/GroupRoleSelector';
import { uniqueId } from '~/utils';

export type UserInvitationDialogProps = Omit<
  DialogProps,
  'onClose' | 'onSubmit'
> & {
  title?: string;
  disabledRoleField?: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onClose?: (
    event: React.MouseEvent,
    reason: 'cancel' | 'backdropClick' | 'escapeKeyDown'
  ) => void;
};

const UserInvitationDialog = ({
  title = '招待',
  open,
  disabledRoleField = false,
  onClose,
  onSubmit,
  ...rest
}: UserInvitationDialogProps) => {
  const formId = useMemo(() => uniqueId(), []);
  const [submitting, setSubmitting] = useToggle(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    (async () => {
      setSubmitting(true);
      await onSubmit?.(e);
      setSubmitting(false);
    })();
  };

  const handleClickCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose?.(e, 'cancel');
  };

  return (
    <Dialog {...rest} open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <FormControl
          component="form"
          fullWidth
          id={formId}
          sx={{ display: 'flex', gap: 3 }}
          variant="outlined"
          onSubmit={handleSubmit}
        >
          <TextField
            autoFocus
            name="email"
            type="email"
            label="Eメールアドレス"
            autoComplete="off"
            required
          />
          <TextField
            name="userName"
            type="name"
            label="氏名"
            autoComplete="off"
            required
          />
          {!disabledRoleField && <GroupRoleSelector name="groupRole" />}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickCancel}>キャンセル</Button>
        <LoadingButton
          type="submit"
          form={formId}
          variant="contained"
          loading={submitting}
        >
          招待する
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UserInvitationDialog;
