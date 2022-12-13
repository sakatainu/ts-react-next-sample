import {
  ArrowDropDown as ArrowDropDownIcon,
  SaveAs as SaveAsIcon,
  SaveOutlined as SaveOutlinedIcon,
} from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { useRef } from 'react';
import { useToggle } from 'react-use';

export type SaveMenuButtonProps = {
  onClickSave?: React.MouseEventHandler<HTMLElement>;
  onClickSaveAs?: React.MouseEventHandler<HTMLElement>;
};

const SaveMenuButton = ({
  onClickSave,
  onClickSaveAs,
}: SaveMenuButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [openSaveMenu, setOpenSaveMenu] = useToggle(false);

  const handleOpenSaveMenu = () => {
    setOpenSaveMenu(true);
  };

  const handleCloseSaveMenu = () => {
    setOpenSaveMenu(false);
  };

  return (
    <>
      <ButtonGroup
        ref={buttonRef}
        variant="contained"
        disableElevation
        sx={{
          '& .MuiButtonGroup-grouped': {
            minWidth: 32,
          },
          '& .MuiButtonGroup-grouped:not(:last-of-type)': {
            borderColor: ({ palette }) => palette.divider,
          },
        }}
      >
        <Button startIcon={<SaveOutlinedIcon />} onClick={onClickSave}>
          保存
        </Button>
        <Button
          sx={{
            px: 0,
          }}
          aria-controls={openSaveMenu ? 'save-menu-button' : undefined}
          aria-expanded={openSaveMenu ? 'true' : undefined}
          aria-haspopup="menu"
          onClick={handleOpenSaveMenu}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={openSaveMenu}
        anchorEl={buttonRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseSaveMenu}>
                <MenuList id="save-menu-button" autoFocusItem>
                  <MenuItem onClick={onClickSaveAs}>
                    <ListItemIcon>
                      <SaveAsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>名前を付けて保存</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default SaveMenuButton;
