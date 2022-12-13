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
  TextField,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import Row from '~/components/ui/Row';

export type SaveDialogProps = Omit<DialogProps, 'onClose' | 'onSubmit'> & {
  title?: string;
  initialState?: {
    title?: string;
  };
  onSubmit?: React.FormEventHandler<HTMLElement>;
  onClose?: (
    event: React.MouseEvent,
    reason: 'closeClick' | 'cancel' | 'backdropClick' | 'escapeKeyDown'
  ) => void;
};

const SaveDialog = ({
  title = '名前を付けて保存',
  initialState = {},
  onClose,
  onSubmit,
  ...rest
}: SaveDialogProps) => {
  const [saveName, setSaveName] = useState(initialState.title || '');
  const saveNameRef = useRef<HTMLInputElement>(null);

  const handleChangeSaveName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveName(e.currentTarget.value);
  };

  const handleBlurSaveName = () => {
    setSaveName((prev) => prev.trim());
  };

  return (
    <Dialog
      {...rest}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 360,
        },
      }}
    >
      <Box component="form" onSubmit={onSubmit}>
        <Row px={3} py={1}>
          <DialogTitle
            sx={{
              p: 1,
              flexGrow: 1,
            }}
            variant="h5"
          >
            {title}
          </DialogTitle>
          <IconButton
            aria-label="close"
            sx={{
              color: ({ palette }) => palette.grey[500],
            }}
            onClick={(e) => onClose?.(e, 'closeClick')}
          >
            <CloseIcon />
          </IconButton>
        </Row>
        <DialogContent>
          <TextField
            name="saveName"
            autoFocus
            fullWidth
            value={saveName}
            required
            inputRef={saveNameRef}
            inputProps={{ autoComplete: 'off' }}
            helperText={saveNameRef.current?.validationMessage}
            onChange={handleChangeSaveName}
            onBlur={handleBlurSaveName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => onClose?.(e, 'cancel')}>キャンセル</Button>
          <Button type="submit" variant="contained">
            保存
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default SaveDialog;
