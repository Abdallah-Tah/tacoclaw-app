import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | TacoClaw`;
    return () => { document.title = 'TacoClaw'; };
  }, [title]);
};