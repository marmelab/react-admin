import { useContext } from 'react';

import { ListContext } from './ListContext';
import { ListControllerResult } from './useListController';
import { RaRecord } from '../../types';

/**
 * Hook to read the list controller props from the ListContext.
 *
 * Used within a <ListContextProvider> (e.g. as a descendent of <List>).
 *
 * @returns {ListControllerResult} list controller props
 *
 * @see useListController for how it is filled
 *
 * @example // custom list view
 *
 * import { useListContext } from 'react-admin';
 *
 * const MyList = () => {
 *     const { data, isPending } = useListContext();
 *     if (isPending) {
 *         return <>Loading...</>;
 *     }
 *     return (
 *         <ul>
 *             {data.map(record => (
 *                 <li key={record.id}>{record.name}</li>
 *             ))}
 *         </ul>
 *     );
 * }
 *
 * @example // custom pagination
 *
 * import { useListContext } from 'react-admin';
 * import { Button, Toolbar } from '@mui/material';
 * import ChevronLeft from '@mui/icons-material/ChevronLeft';
 * import ChevronRight from '@mui/icons-material/ChevronRight';
 *
 * const PrevNextPagination = () => {
 *     const { page, perPage, total, setPage } = useListContext();
 *     const nbPages = Math.ceil(total / perPage) || 1;
 *     return (
 *         nbPages > 1 &&
 *             <Toolbar>
 *                 {page > 1 &&
 *                     <Button color="primary" key="prev" onClick={() => setPage(page - 1)}>
 *                         <ChevronLeft />
 *                         Prev
 *                     </Button>
 *                 }
 *                 {page !== nbPages &&
 *                     <Button color="primary" key="next" onClick={() => setPage(page + 1)}>
 *                         Next
 *                         <ChevronRight />
 *                     </Button>
 *                 }
 *             </Toolbar>
 *     );
 * }
 */
export const useListContext = <
    RecordType extends RaRecord = any,
>(): ListControllerResult<RecordType> => {
    const context = useContext(ListContext);
    if (!context) {
        throw new Error(
            'useListContext must be used inside a ListContextProvider'
        );
    }
    return context;
};
