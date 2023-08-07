import { useContext } from 'react';
import { ListIdsContext } from './ListIdsContext';

export const useListIdsContext = () => useContext(ListIdsContext);
