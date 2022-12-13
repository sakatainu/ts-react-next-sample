import { useSelectMembershipsQuery } from '@/generated/graphql';
import { gql } from 'urql';
import { uuidString } from '~/types/graphql';

export const SelectMemberships = gql`
  query selectMemberships($groupId: uuid!) {
    memberships(where: { groupId: { _eq: $groupId } }) {
      userId
      groupInvitation {
        userId
        email
        name
      }
      user {
        id
        email
        name
      }
      ownership {
        userId
      }
    }
  }
`;

const useGroupMembers = (groupId: GroupId) => {
  const [queryResult] = useSelectMembershipsQuery({
    variables: {
      groupId: uuidString(groupId),
    },
  });

  return queryResult;
};

export default useGroupMembers;
