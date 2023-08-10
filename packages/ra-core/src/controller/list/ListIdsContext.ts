import { createContext } from 'react';

export type ListIdsContextType = {
    ids: any[];
    total: number;
};

export const ListIdsContext = createContext<ListIdsContextType>({
    ids: [],
    total: 0,
});
