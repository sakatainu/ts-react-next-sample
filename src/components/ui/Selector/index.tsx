import { AddCircleOutlineRounded as AddCircleOutlineRoundedIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  ChipProps,
  IconButton,
  Tooltip,
  TooltipProps,
} from '@mui/material';
import { forwardRef, MouseEvent, ReactNode } from 'react';
import Row from '~/components/ui/Row';

const Container = ({ children }: { children?: ReactNode }) => (
  <Row alignItems="center" spacing={1} minHeight={40}>
    {children}
  </Row>
);

const MaybeTooltip = ({ title, children, ...rest }: TooltipProps) => {
  if (!title) return <>{children}</>;

  return (
    <Tooltip title={title} {...rest}>
      {children}
    </Tooltip>
  );
};

export type SelectorValue = ChipProps & {
  id: string;
  tooltip?: string;
};

export type SelectorProps = {
  value?: SelectorValue[];
  placeholder?: ReactNode;
  onClickAdd?: () => void;
  onClickItemDelete?: (index: number, event: MouseEvent) => void;
};

const Selector = forwardRef<unknown, SelectorProps>((props: SelectorProps) => {
  const {
    value = [],
    placeholder = null,
    onClickAdd,
    onClickItemDelete,
  } = props;

  if (!value.length) {
    return <Container>{placeholder}</Container>;
  }

  const handleClickItemDelete = (index: number) => (event: MouseEvent) => {
    onClickItemDelete?.(index, event);
  };

  return (
    <Container>
      {value.map(({ tooltip, ...restProps }, i) => (
        <MaybeTooltip key={restProps.id} title={tooltip}>
          <Chip
            variant="outlined"
            onDelete={onClickItemDelete && handleClickItemDelete(i)}
            {...restProps}
          />
        </MaybeTooltip>
      ))}
      <Box display="flex" alignItems="center" justifyContent="center">
        <IconButton onClick={onClickAdd}>
          <AddCircleOutlineRoundedIcon />
        </IconButton>
      </Box>
    </Container>
  );
});
Selector.displayName = 'Selector';

export default Selector;
