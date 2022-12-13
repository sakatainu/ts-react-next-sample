import { CreateGroupFn } from '~/hooks/useGroupsDispatcher';
import { timestampString } from '~/types/graphql';
import { inspectString } from '~/utils/inspect';

export const executeCreateGroup = async ({
  form,
  creator,
}: {
  form: FormData;
  creator: CreateGroupFn;
}): Promise<void> => {
  const groupType = inspectString(form.get('groupType')?.toString());
  const groupName = inspectString(form.get('groupName')?.toString());
  const plan = inspectString(form.get('plan')?.toString());
  const maxUsers = inspectString(form.get('maxUsers')?.toString());
  const startAt = inspectString(form.get('startAt')?.toString());
  const expireAt = inspectString(form.get('expireAt')?.toString());
  const memo = inspectString(form.get('memo')?.toString());
  const stockIssueCode = inspectString(form.get('stockIssueCode')?.toString());
  const settlementMonth = inspectString(
    form.get('settlementMonth')?.toString()
  );
  const settlementDay = inspectString(form.get('settlementDay')?.toString());

  const { error } = await creator({
    name: groupName,
    _contracts: {
      data: [
        {
          planCode: plan,
          startAt: timestampString(startAt),
          expireAt: timestampString(expireAt),
          maxUsers: Number(maxUsers),
        },
      ],
    },
    _groupContents: {
      data: [{ memo }],
    },
    _groupStockIssues: {
      data: [
        {
          stockIssueCode,
        },
      ],
    },
    _groupSettlementDates: {
      data: [
        {
          month: Number(settlementMonth),
          day: Number(settlementDay),
        },
      ],
    },
    _groupTypeAssignments: {
      data: [
        {
          groupTypeCode: groupType,
        },
      ],
    },
  });

  if (error) throw error;
};

export default undefined;
