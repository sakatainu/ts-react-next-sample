import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { uniqueId } from '~/utils';
import InputForm, { FormFieldValue, InputFormProps } from './formFields';

export type CloseEventHandler = (
  event: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLElement>,
  reason: 'backdropClick' | 'escapeKeyDown' | 'cancel' | 'submit'
) => void;

export type SubmitEventHandler = (
  reason: 'create' | 'update' | 'delete',
  value: FormFieldValue,
  event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
) => Promise<void>;

export type UserGroupEventFormDialogProps = Omit<
  DialogProps,
  'onClose' | 'onSubmit'
> & {
  initialState?: Partial<FormFieldValue>;
  onClose?: CloseEventHandler;
  onSubmit?: SubmitEventHandler;
};

const UserGroupEventFormDialog = ({
  open,
  initialState,
  onClose,
  onSubmit,
  ...rest
}: UserGroupEventFormDialogProps) => {
  const groupEventId = initialState?.id;
  const isUpdate = !!groupEventId;

  const formId = useMemo(() => uniqueId(), []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose?.(e, 'cancel');
  };

  const handleOnSubmit: InputFormProps['onSubmit'] = (reason, value, e) => {
    (async () => {
      setIsSubmitting(true);
      await onSubmit?.(reason, value, e);
      setIsSubmitting(false);
    })();
  };

  const handleOnClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    (async () => {
      if (!initialState?.id) return;

      setIsSubmitting(true);
      await onSubmit?.('delete', initialState as FormFieldValue, e);
      setIsSubmitting(false);
    })();
  };

  return (
    <Dialog {...rest} open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Stack direction="row">
        <DialogTitle sx={{ flexGrow: 1 }}>
          {isUpdate ? 'イベント修正' : '新規イベント'}
        </DialogTitle>
        <Box px={1} m="auto">
          <IconButton
            aria-label="close"
            sx={{
              color: ({ palette }) => palette.grey[500],
            }}
            onClick={handleOnCancel}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Stack>
      <DialogContent>
        <InputForm
          id={formId}
          onSubmit={handleOnSubmit}
          initialState={initialState}
        />
      </DialogContent>

      <DialogActions>
        <Box flexGrow={1} display={isUpdate ? 'block' : 'none'}>
          <Button
            color="warning"
            variant="contained"
            onClick={handleOnClickDelete}
          >
            削除
          </Button>
        </Box>

        <Button onClick={handleOnCancel}>キャンセル</Button>
        <Button
          name="change"
          type="submit"
          form={formId}
          variant="contained"
          disabled={isSubmitting}
        >
          {isUpdate ? '更新' : '登録'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserGroupEventFormDialog;
