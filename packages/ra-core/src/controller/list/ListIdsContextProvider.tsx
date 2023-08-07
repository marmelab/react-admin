import * as React from 'react';
import { ListIdsContext } from './ListIdsContext';

export const ListIdsContextProvider = ({ children }) => {
    return (
        <ListIdsContext.Provider value={[]}>{children}</ListIdsContext.Provider>
    );
};
