import { useCallback } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { setListSelectedIds, toggleListItem } from '../actions/listActions';
import { Identifier, ReduxState } from '../types';

/**
 * Get and update the list of selected items for a resource
 *
 * @param resource The resource name, e.g. 'posts'
 *
 * @returns {Object} Destructure as { selectedIds, select, toggle, clearSelection }.
 */
const useSelectItems = (resource: string) => {
    const dispatch = useDispatch();

    const selectedIds = useSelector(
        (reduxState: ReduxState) =>
            reduxState.admin.resources[resource].list.selectedIds,
        [resource]
    );

    const select = useCallback(
        (newIds: Identifier[]) => {
            dispatch(setListSelectedIds(resource, newIds));
        },
        [resource]
    );
    const toggle = useCallback(
        (id: Identifier) => {
            dispatch(toggleListItem(resource, id));
        },
        [resource]
    );
    const clearSelection = useCallback(() => {
        dispatch(setListSelectedIds(resource, []));
    }, [resource]);

    return { selectedIds, select, toggle, clearSelection };
};

export default useSelectItems;
