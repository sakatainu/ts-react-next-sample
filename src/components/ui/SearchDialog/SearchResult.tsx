import { useContext, useEffect } from 'react';
import { Context } from '~/components/ui/SearchDialog';

const SearchResult = ({ children }: { children: React.ReactNode }) => {
  const { setContent } = useContext(Context);

  useEffect(() => {
    setContent(children);
  }, [setContent, children]);

  return null;
};

export default SearchResult;
