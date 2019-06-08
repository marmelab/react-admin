import { useCallback } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { setListSelectedIds, toggleListItem } from '../actions/listActions';
import { Identifier, ReduxState } from '../types';

/**
 * Get the list of selected items for a resource, and callbacks to change the selection
 *
 * @param resource The resource name, e.g. 'posts'
 *
 * @returns {Object} Destructure as [selectedIds, { select, toggle, clearSelection }].
 */
const useSelectItems = (resource: string) => {
    const dispatch = useDispatch();
    const selectedIds = useSelector(
        (reduxState: ReduxState) =>
            reduxState.admin.resources[resource].list.selectedIds,
        [resource]
    );
    const selectionModifiers = {
        select: useCallback(
            (newIds: Identifier[]) => {
                dispatch(setListSelectedIds(resource, newIds));
            },
            [dispatch, resource]
        ),
        toggle: useCallback(
            (id: Identifier) => {
                dispatch(toggleListItem(resource, id));
            },
            [dispatch, resource]
        ),
        clearSelection: useCallback(() => {
            dispatch(setListSelectedIds(resource, []));
        }, [dispatch, resource]),
    };
    return [selectedIds, selectionModifiers];
};

export default useSelectItems;
