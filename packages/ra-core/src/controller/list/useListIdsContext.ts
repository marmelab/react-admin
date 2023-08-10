import { useContext } from 'react';
import { ListIdsContext, ListIdsContextType } from './ListIdsContext';

export const useListIdsContext = (): ListIdsContextType =>
    useContext(ListIdsContext);
