import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import { useMemo } from 'react';
import { uniqueId } from '~/utils/index';

// HACK:

export type AlertDialogProps = DialogProps & {
  title: React.ReactNode;
  message: React.ReactNode;
  actions?: React.ReactNode[];
};

const ConfirmDialog = ({
  title,
  message,
  actions,
  ...rest
}: AlertDialogProps) => {
  const uid = useMemo(() => uniqueId(), []);

  return (
    <Dialog
      {...rest}
      aria-labelledby={`alert-dialog-title-${uid}`}
      aria-describedby={`alert-dialog-description-${uid}`}
    >
      <DialogTitle id={`alert-dialog-title-${uid}`}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={`alert-dialog-description-${uid}`}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
