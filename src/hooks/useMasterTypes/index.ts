import { Languages_Enum, useSelectMasterTypesQuery } from '@/generated/graphql';
import { gql } from 'urql';

export const SelectMasterTypes = gql`
  query selectMasterTypes($lang: languages_enum = ja) {
    groupTypes {
      code
      label: groupTypeTranslations(where: { languageCode: { _eq: $lang } }) {
        text
      }
    }
    planTypes: plans {
      code
      label: planTranslations(where: { languageCode: { _eq: $lang } }) {
        text
      }
    }
  }
`;

const useMasterTypes = (lang: Languages_Enum = Languages_Enum.Ja) => {
  const [queryResult] = useSelectMasterTypesQuery({
    variables: {
      lang,
    },
  });
  return queryResult;
};

export default useMasterTypes;
