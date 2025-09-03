import { useContext } from 'react';
import { FilterContext, type FilterContextType } from './FilterContext';

export const useFilterContext = (): FilterContextType => {
    return useContext(FilterContext);
};
