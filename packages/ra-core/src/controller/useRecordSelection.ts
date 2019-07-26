import { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
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
        shallowEqual
    );
    const selectionModifiers = {
        select: useCallback(
            (newIds: Identifier[]) => {
                dispatch(setListSelectedIds(resource, newIds));
            },
            [resource] // eslint-disable-line react-hooks/exhaustive-deps
        ),
        toggle: useCallback(
            (id: Identifier) => {
                dispatch(toggleListItem(resource, id));
            },
            [resource] // eslint-disable-line react-hooks/exhaustive-deps
        ),
        clearSelection: useCallback(() => {
            dispatch(setListSelectedIds(resource, []));
        }, [resource]), // eslint-disable-line react-hooks/exhaustive-deps
    };
    return [selectedIds, selectionModifiers];
};

export default useSelectItems;
