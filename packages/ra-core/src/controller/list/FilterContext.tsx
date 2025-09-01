import * as React from 'react';

export type FilterContextType = React.ReactNode[] | undefined;

/**
 * Make filters accessible to sub components
 */
export const FilterContext = React.createContext<FilterContextType>(undefined);
