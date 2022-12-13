import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
} from '@mui/material';
import React from 'react';
import { useToggle } from 'react-use';
import EditGroupForm, {
  EditGroupFormDefaultValue,
} from '~/components/ui/EditGroupForm';
import { GroupRole } from '~/hooks/useGroup';
import { uniqueId } from '~/utils';

export type EditGroupFormDialogProps = Omit<
  DialogProps,
  'onClose' | 'onSubmit' | 'defaultValue'
> & {
  title?: string;
  userGroupRole?: GroupRole;
  defaultValue?: EditGroupFormDefaultValue;
  onSubmit?: (event: React.FormEvent) => Promise<void>;
  onClose?: (
    event: React.MouseEvent,
    reason: 'cancel' | 'backdropClick' | 'escapeKeyDown'
  ) => void;
};

const EditGroupFormDialog = ({
  title = '企業アカウント作成',
  open,
  userGroupRole,
  defaultValue,
  onClose,
  onSubmit,
}: EditGroupFormDialogProps) => {
  const formId = React.useMemo(() => uniqueId(), []);
  const [submitting, setSubmitting] = useToggle(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    (async () => {
      setSubmitting(true);
      await onSubmit?.(e);
      setSubmitting(false);
    })();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <EditGroupForm
          id={formId}
          editMode="create"
          userGroupRole={userGroupRole}
          defaultValue={defaultValue}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => onClose?.(e, 'cancel')}>キャンセル</Button>
        <LoadingButton
          type="submit"
          form={formId}
          variant="contained"
          loading={submitting}
        >
          作成する
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditGroupFormDialog;
