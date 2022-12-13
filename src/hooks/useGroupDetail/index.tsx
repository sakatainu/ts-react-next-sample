import { useSelectGroupDetailByIdQuery } from '@/generated/graphql';
import { gql } from 'urql';
import { useSignedInUserContext } from '~/contexts/SignedInUserContext';
import { uuidString } from '~/types/graphql';

export const SelectGroupDetailById = gql`
  query selectGroupDetailById($id: uuid!, $isStaff: Boolean = false) {
    groups_by_pk(id: $id) {
      userNum: memberships_aggregate {
        aggregate {
          count
        }
      }
      id
      name
      contract {
        plan {
          code
        }
        startAt
        expireAt
        maxUsers
      }
      groupStockIssue {
        stockIssue {
          code
          name
        }
      }
      groupSettlementDate {
        month
        day
      }
      groupTypeAssignment {
        groupType {
          code
        }
      }
      groupInvitations {
        email
      }
      groupContent @include(if: $isStaff) {
        memo
      }
    }
  }
`;

const useGroupDetail = (groupId: GroupId) => {
  const { user } = useSignedInUserContext();

  const [queryResult] = useSelectGroupDetailByIdQuery({
    variables: { id: uuidString(groupId), isStaff: user.role === 'staff' },
  });
  return queryResult;
};

export default useGroupDetail;
