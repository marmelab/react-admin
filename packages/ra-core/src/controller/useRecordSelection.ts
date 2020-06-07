import { useCallback } from 'react';
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
const useSelectItems = (
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
