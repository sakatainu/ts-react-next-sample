import { UpdateGroupFn } from '~/hooks/useGroupsDispatcher';
import { timestampString, uuidString } from '~/types/graphql';

export const executeUpdateGroup = async ({
  id,
  form,
  updater,
}: {
  id: GroupId;
  form: FormData;
  updater: UpdateGroupFn;
}): Promise<void> => {
  const groupType = form.get('groupType')?.toString();
  const groupName = form.get('groupName')?.toString();
  const plan = form.get('plan')?.toString();
  const maxUsers = form.get('maxUsers')?.toString();
  const startAt = form.get('startAt')?.toString();
  const expireAt = form.get('expireAt')?.toString();
  const memo = form.get('memo')?.toString();
  const stockIssueCode = form.get('stockIssueCode')?.toString();
  const settlementMonth = form.get('settlementMonth')?.toString();
  const settlementDay = form.get('settlementDay')?.toString();

  const { error } = await updater({
    id: uuidString(id),
    groupSet: {
      name: groupName,
    },
    groupStockIssueSet: {
      stockIssueCode,
    },
    contractSet: {
      planCode: plan,
      maxUsers: maxUsers ? Number(maxUsers) : undefined,
      startAt: startAt ? timestampString(startAt) : undefined,
      expireAt: expireAt ? timestampString(expireAt) : undefined,
    },
    groupTypeAssignmentSet: {
      groupTypeCode: groupType,
    },
    groupSettlementDateSet: {
      month: settlementMonth ? Number(settlementMonth) : undefined,
      day: settlementDay ? Number(settlementDay) : undefined,
    },
    groupContentsSet: {
      memo,
    },
  });

  if (error) throw error;
};

export default undefined;
