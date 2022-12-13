import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import ProgressBox from '~/components/ui/ProgressBox';
import SignedInUserContext, {
  useSignedInUserContext,
} from '~/contexts/SignedInUserContext';
import useGroups from '~/hooks/useGroups';
import useGroupsDispatcher from '~/hooks/useGroupsDispatcher';
import { uuidString } from '~/types/graphql';
import Template, { TemplateProps } from './Template';

const Inner = () => {
  const router = useRouter();
  const { user } = useSignedInUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const { fetching, result } = useGroups({
    memberships: { userId: { _eq: uuidString(user.id) } },
  });

  const skipSelect =
    result?.groups.length === 1 && result?.invited.length === 0;

  const { acceptGroupInvitation } = useGroupsDispatcher();

  useEffect(() => {
    if (fetching || !result) return;

    if (skipSelect) {
      (async () => {
        await router.replace(`/home/groups/${result.groups[0].id}/analytics`);
      })();
    }
  }, [fetching, result, router, skipSelect]);

  const handleAcceptInvite: TemplateProps['onClickAcceptInvite'] = (
    invited
  ) => {
    (async () => {
      const { error } = await acceptGroupInvitation(user, invited.id);
      if (error) {
        enqueueSnackbar(
          '招待の承認に失敗しました。時間をおいて再度お試しください。',
          { variant: 'error' }
        );
        return;
      }

      await router.push(`/home/groups/${invited.id}/analytics`);
    })();
  };

  if (fetching || skipSelect) return <ProgressBox />;

  return (
    <Template
      value={{
        invited: result?.invited || [],
        groups: result?.groups || [],
      }}
      onClickAcceptInvite={handleAcceptInvite}
    />
  );
};

const SelectAccount = () => (
  <SignedInUserContext>
    <Inner />
  </SignedInUserContext>
);

export default SelectAccount;
