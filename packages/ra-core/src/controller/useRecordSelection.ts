import { useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { setListSelectedIds, toggleListItem } from '../actions/listActions';
import { Identifier, ReduxState } from '../types';

const defaultRecords = [];

/**
 * Get the list of selected items for a resource, and callbacks to change the selection
 *
 * @param resource The resource name, e.g. 'posts'
 *
 * @returns {Object} Destructure as [selectedIds, { select, toggle, clearSelection }].
 */
const useRecordSelection = (
    resource: string
): [
    Identifier[],
    {
        select: (newIds: Identifier[]) => void;
        toggle: (id: Identifier) => void;
        clearSelection: () => void;
    }
] => {
    const dispatch = useDispatch();
    const selectedIds = useSelector<ReduxState, Identifier[]>(
        (reduxState: ReduxState) =>
            reduxState.admin.resources[resource]
                ? reduxState.admin.resources[resource].list.selectedIds
                : defaultRecords,
        shallowEqual
    );
    const selectionModifiers = useMemo(
        () => ({
            select: (newIds: Identifier[]) => {
                dispatch(setListSelectedIds(resource, newIds));
            },
            toggle: (id: Identifier) => {
                dispatch(toggleListItem(resource, id));
            },
            clearSelection: () => {
                dispatch(setListSelectedIds(resource, []));
            },
        }),
        [dispatch, resource]
    );

    return [selectedIds, selectionModifiers];
};

export default useRecordSelection;
