import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Button, ButtonProps, Menu, MenuProps } from '@mui/material';
import { useRef } from 'react';
import { useToggle } from 'react-use';

export type MenuButtonProps = {
  label?: React.ReactNode;
  children?: React.ReactNode;
  buttonProps?: ButtonProps;
  menuProps?: MenuProps;
  onChange?: MenuProps['onChange'];
};

const MenuButton = ({
  label,
  children,
  buttonProps,
  menuProps,
  onChange,
}: MenuButtonProps) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [openMenu, setOpenMenu] = useToggle(false);

  const doOpenMenu = () => {
    setOpenMenu(true);
  };

  const doCloseMenu = () => {
    setOpenMenu(false);
  };

  return (
    <>
      <Button
        ref={anchorRef}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={doOpenMenu}
        {...buttonProps}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        open={openMenu}
        onClose={doCloseMenu}
        onChange={onChange}
        {...menuProps}
      >
        {children}
      </Menu>
    </>
  );
};

export default MenuButton;
