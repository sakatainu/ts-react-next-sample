import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  SvgIconProps,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import Link from '~/components/ui/Link';
import Row from '~/components/ui/Row';

const defaultSidebarWidth = 80;

export type AppMenuItem = {
  name: string;
  label?: string;
  Icon?: React.ElementType<SvgIconProps>;
  path?: string;
};

export type SubMenuProps = {
  width?: number;
};

export type AppSideMenuProps = {
  selectedMenu?: string;
  appMenu?: AppMenuItem[];
  subMenu?: React.ReactNode;
  subMenuWidth?: number;
  onClickMenu?: (
    menuName: string,
    event: React.MouseEvent<HTMLElement>
  ) => void;
  onClickLogout?: React.MouseEventHandler<HTMLElement>;
};

const AppSideMenu = ({
  selectedMenu: selected,
  appMenu = [],
  subMenu = null,
  subMenuWidth: ownerSubMenuWidth = 0,
  onClickMenu,
}: AppSideMenuProps) => {
  const openSubMenu = Boolean(subMenu);
  const subMenuWidth = openSubMenu ? ownerSubMenuWidth : 0;
  const sidebarWidth = defaultSidebarWidth + subMenuWidth;

  const handleClickMenu =
    (menuName: string): React.MouseEventHandler<HTMLElement> =>
    (e) => {
      onClickMenu?.(menuName, e);
    };

  return (
    <Drawer
      variant="permanent"
      sx={{
        maxWidth: sidebarWidth,
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          maxWidth: sidebarWidth,
          width: sidebarWidth,
          boxSizing: 'content-box',
          backgroundColor: '#f0f8f9',
          color: '#3b3b3b',
        },
      }}
    >
      <Toolbar />
      <Row
        sx={{
          flexGrow: 1,
        }}
      >
        <List
          sx={{
            maxWidth: defaultSidebarWidth,
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 auto',
            gap: 1,
          }}
        >
          {appMenu.map(({ name, path, Icon, label }) => (
            <ListItem
              key={name}
              disablePadding
              sx={{
                position: 'relative',
                ...(selected === name && {
                  backgroundColor: ({ palette }) => palette.action.selected,
                }),
                '::after': {
                  display: selected === name ? 'block' : 'none',
                  content: '""',
                  position: 'absolute',
                  width: 8,
                  height: 1,
                  backgroundColor: ({ palette }) => palette.primary.main,
                },
              }}
            >
              <ListItemButton
                {...(path && {
                  LinkComponent: Link,
                  href: path,
                })}
                sx={{
                  flexDirection: 'column',
                }}
                onClick={handleClickMenu(name)}
              >
                {!!Icon && (
                  <Icon
                    sx={{
                      fontSize: 36,
                    }}
                  />
                )}
                {label && (
                  <Typography
                    variant="caption"
                    fontSize={11}
                    textAlign="center"
                    mt="4px"
                  >
                    {label}
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {subMenu}
      </Row>
    </Drawer>
  );
};

export default AppSideMenu;
