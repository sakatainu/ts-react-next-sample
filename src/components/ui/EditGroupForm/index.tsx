import { Maybe } from '@/generated/graphql';
import {
  Box,
  Divider,
  FormControl,
  FormControlProps,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import DatePicker from '~/components/ui/DatePicker';
import GroupTypeSelector from '~/components/ui/GroupTypeSelector';
import PlanTypeSelector from '~/components/ui/PlanTypeSelector';
import { AllowGroupFn, useGroupAuthUtils } from '~/hooks/authUtils';
import { GroupRole } from '~/hooks/useGroup';
import permission from './permission';

export type EditGroupFormDefaultValue = {
  name?: Maybe<string>;
  groupTypeAssignment?: Maybe<{
    groupType?: Maybe<{
      code?: string;
    }>;
  }>;
  contract?: Maybe<{
    plan?: Maybe<{
      code?: string;
    }>;
    maxUsers?: number;
    startAt?: string;
    expireAt?: string;
  }>;
  groupStockIssue?: Maybe<{
    stockIssue?: Maybe<{
      code: string;
    }>;
  }>;
  groupSettlementDate?: Maybe<{
    month: number;
    day: number;
  }>;
  groupContent?: Maybe<{
    memo: string;
  }>;
};

export type EditMode = 'create' | 'edit';

export type EditGroupFormProps = Omit<
  FormControlProps<'form'>,
  'defaultValue'
> & {
  editMode: EditMode;
  userGroupRole?: GroupRole;
  defaultValue?: EditGroupFormDefaultValue | null;
};

const EditGroupForm = ({
  editMode,
  userGroupRole,
  defaultValue,
  ...formProps
}: EditGroupFormProps) => {
  const { allow: allowGroup, GroupPermission } =
    useGroupAuthUtils(userGroupRole);

  const allow = useCallback<AllowGroupFn>(
    (args) => {
      if (editMode === 'create') return true;
      return allowGroup(args);
    },
    [allowGroup, editMode]
  );

  return (
    <FormControl
      component="form"
      fullWidth
      sx={{ display: 'flex', gap: 4 }}
      variant="filled"
      {...formProps}
    >
      <Box>
        <Typography component="h2" variant="h5" mb={1}>
          アカウント情報
        </Typography>
        <Divider />
      </Box>
      <GroupPermission allows={permission.groupName.visible}>
        <TextField
          name="groupName"
          type="name"
          label="アカウント名"
          autoFocus
          required
          autoComplete="off"
          defaultValue={defaultValue?.name}
          InputProps={{
            readOnly: !allow(permission.groupName.edit),
          }}
        />
      </GroupPermission>
      <GroupPermission allows={permission.groupType.visible}>
        <GroupTypeSelector
          name="groupType"
          required
          defaultValue={defaultValue?.groupTypeAssignment?.groupType?.code}
          readOnly={!allow(permission.groupType.edit)}
        />
      </GroupPermission>
      <Box>
        <Typography component="h2" variant="h5" mb={1}>
          契約情報
        </Typography>
        <Divider />
      </Box>
      <GroupPermission allows={permission.plan.visible}>
        <PlanTypeSelector
          name="plan"
          required
          defaultValue={defaultValue?.contract?.plan?.code}
          readOnly={!allow(permission.plan.edit)}
        />
      </GroupPermission>

      <GroupPermission allows={permission.maxUsers.visible}>
        <TextField
          name="maxUsers"
          type="number"
          label="ユーザー数（上限）"
          placeholder="ユーザー数（上限）"
          required
          defaultValue={defaultValue?.contract?.maxUsers}
          InputProps={{
            readOnly: !allow(permission.maxUsers.edit),
          }}
        />
      </GroupPermission>
      <GroupPermission allows={permission.startAt.visible}>
        <DatePicker
          label="利用開始日 *"
          InputProps={{
            name: 'startAt',
            required: true,
          }}
          readOnly={!allow(permission.startAt.edit)}
          defaultValue={defaultValue?.contract?.startAt}
        />
      </GroupPermission>
      <GroupPermission allows={permission.expireAt.visible}>
        <DatePicker
          label="利用停止日 *"
          InputProps={{
            name: 'expireAt',
            required: true,
          }}
          readOnly={!allow(permission.expireAt.edit)}
          defaultValue={defaultValue?.contract?.expireAt}
        />
      </GroupPermission>
      <Box>
        <Typography component="h2" variant="h5" mb={1}>
          銘柄情報
        </Typography>
        <Divider />
      </Box>
      <GroupPermission allows={permission.stockIssueCode.visible}>
        <TextField
          name="stockIssueCode"
          label="銘柄コード"
          required
          defaultValue={defaultValue?.groupStockIssue?.stockIssue?.code}
          InputProps={{
            readOnly: !allow(permission.stockIssueCode.edit),
          }}
        />
      </GroupPermission>
      <GroupPermission allows={permission.settlement.visible}>
        <Box>
          <Typography variant="body2" mb={2}>
            決算日
          </Typography>
          <FormControl
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 2,
              '& .MuiTextField-root': {
                flexGrow: 1,
              },
            }}
            fullWidth
          >
            <TextField
              name="settlementMonth"
              type="number"
              label="月"
              required
              inputProps={{
                min: 1,
                max: 12,
                readOnly: !allow(permission.settlement.edit),
              }}
              defaultValue={defaultValue?.groupSettlementDate?.month}
            />
            <TextField
              name="settlementDay"
              type="number"
              label="日"
              required
              inputProps={{
                min: 1,
                max: 31,
                readOnly: !allow(permission.settlement.edit),
              }}
              defaultValue={defaultValue?.groupSettlementDate?.day}
            />
          </FormControl>
        </Box>
      </GroupPermission>
      <GroupPermission allows={permission.memo.visible}>
        <Box>
          <Typography component="h2" variant="h5" mb={1}>
            その他
          </Typography>
          <Divider />
        </Box>
        <TextField
          name="memo"
          label="備考"
          multiline
          rows="4"
          defaultValue={defaultValue?.groupContent?.memo}
          inputProps={{
            readOnly: !allow(permission.memo.edit),
          }}
        />
      </GroupPermission>
    </FormControl>
  );
};

export default EditGroupForm;
