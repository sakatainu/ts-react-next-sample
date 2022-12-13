import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import GroupInfoNav from '~/components/App/GroupInfoNav';
import Container from '~/components/ui/Container';
import EditGroupForm, {
  EditGroupFormDefaultValue,
} from '~/components/ui/EditGroupForm';
import Row from '~/components/ui/Row';
import { GroupRole } from '~/hooks/useGroup';
import { uniqueId } from '~/utils';

export type TemplateProps = {
  userGroupRole: GroupRole;
  value: EditGroupFormDefaultValue;
  onSubmit: React.FormEventHandler;
};

const Template = ({ userGroupRole, value, onSubmit }: TemplateProps) => {
  const formId = useMemo(() => uniqueId(), []);

  return (
    <>
      <Box
        height={48}
        sx={{
          borderBottom: 1,
          backgroundColor: 'background.paper',
          borderColor: 'divider',
        }}
      >
        <Container>
          <Typography p={1} variant="h6" component="h1">
            アカウント情報
          </Typography>
        </Container>
      </Box>
      <Paper variant="elevation" elevation={0} square sx={{ py: 4, pb: 10 }}>
        <Container>
          <Row sx={{ py: 2, gap: 2 }}>
            <GroupInfoNav currentPath="info" />
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ py: 2 }}>
                <EditGroupForm
                  id={formId}
                  editMode="edit"
                  userGroupRole={userGroupRole}
                  defaultValue={value}
                  onSubmit={onSubmit}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Button type="submit" form={formId} variant="contained">
                  更新
                </Button>
              </Box>
            </Box>
          </Row>
        </Container>
      </Paper>
    </>
  );
};

export default Template;
