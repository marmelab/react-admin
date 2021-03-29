import { createContext } from 'react';
import { PaginationPayload, Record, SortPayload } from '../../types';

/**
 * Context which provides access to the useReferenceArrayInput features.
 *
 * @example
 * const ReferenceArrayInput = ({ children }) => {
 *     const controllerProps = useReferenceArrayInputController();
 *     return (
 *         <ReferenceArrayInputContextProvider value={controllerProps}>
 *             {children}
 *         </ReferenceArrayInputContextProvider>
 *     )
 * }
 */
export const ReferenceArrayInputContext = createContext(undefined);

export interface ReferenceArrayInputContextValue {
    choices: Record[];
    error?: any;
    warning?: any;
    loading: boolean;
    loaded: boolean;
    setFilter: (filter: any) => void;
    setPagination: (pagination: PaginationPayload) => void;
    setSort: (sort: SortPayload) => void;
    setSortForList: (sort: string, order?: string) => void;
}
