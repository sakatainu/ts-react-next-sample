import {
  Chip as MuiChip,
  ChipProps as MuiChipProps,
  ChipTypeMap as MuiChipTypeMap,
  Theme,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SystemStyleObject } from '@mui/system';
import { forwardRef } from 'react';

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    red: true;
  }
}

const chipColors: Record<string, SystemStyleObject<Theme>> = {
  red: {
    backgroundColor: '#f44336', // red[500]
    color: 'white',
    '&:hover, &:focus': {
      backgroundColor: '#f44336DE', // red[500] 87%
    },
  },
  blue: {
    backgroundColor: '#2196f3', // blue[500]
    color: 'white',
    '&:hover, &:focus': {
      backgroundColor: '#2196f3DE', // blue[500] 87%
    },
  },
};

type OverrideProps = {
  color?: 'red' | 'blue' | MuiChipProps['color'];
};

export type ChipTypeMap = MuiChipTypeMap<OverrideProps>;

export type ChipProps = Omit<MuiChipProps, 'color'> & OverrideProps;

const Chip = forwardRef<HTMLDivElement, ChipProps>((props, ref) => {
  const { color = 'default', sx, ...rest } = props;
  const coloredStyle = chipColors[color];

  if (coloredStyle) {
    return (
      <MuiChip
        ref={ref}
        sx={{
          ...coloredStyle,
          ...sx,
        }}
        {...rest}
      />
    );
  }

  return (
    <MuiChip
      ref={ref}
      color={color as MuiChipProps['color']}
      sx={sx}
      {...rest}
    />
  );
});
Chip.displayName = 'Chip';

export default Chip as OverridableComponent<ChipTypeMap>;
