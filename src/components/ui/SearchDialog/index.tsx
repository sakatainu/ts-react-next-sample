import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  InputAdornment,
  InputBase,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import Row from '~/components/ui/Row';

export const Context = React.createContext<{
  setContent: (content: React.ReactNode) => void;
}>({
  setContent: () => null,
});

export type SearchDialogProps = Omit<DialogProps, 'onClose'> & {
  title?: string;
  query?: string;
  queryPlaceholder?: string;
  children?: React.ReactNode;
  onChangeQuery?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onClose?: (
    event: React.MouseEvent,
    reason: 'closeClick' | 'backdropClick' | 'escapeKeyDown'
  ) => void;
};

const SearchDialog = ({
  title = '検索',
  query = '',
  queryPlaceholder,
  children,
  onChangeQuery,
  onClose,
  ...rest
}: SearchDialogProps) => {
  const [content, setContent] = useState<React.ReactNode>(null);

  const contextValue = useMemo(() => ({ setContent }), [setContent]);

  return (
    <Context.Provider value={contextValue}>
      <Dialog {...rest} onClose={onClose}>
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
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 0,
            height: 800,
            minWidth: 400,
            width: 600,
          }}
        >
          <Box
            sx={{
              borderWidth: '1px 0 1px 0',
              borderStyle: 'solid',
              borderColor: ({ palette }) => palette.divider,
            }}
          >
            <InputBase
              sx={{
                px: 3,
                py: 1,
              }}
              fullWidth
              type="search"
              placeholder={queryPlaceholder}
              value={query}
              onChange={onChangeQuery}
              autoFocus
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </Box>
          <Box
            sx={{
              px: 3,
              py: 2,
              flexGrow: 1,
              overflowY: 'auto',
            }}
          >
            {content}
          </Box>
        </DialogContent>
        {children}
      </Dialog>
    </Context.Provider>
  );
};

export default SearchDialog;
