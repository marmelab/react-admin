import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { toggleListItemExpand } from '../actions/listActions';
import { Identifier, ReduxState } from '../types';

/**
 * State-like hook for controlling the expanded state of a list item
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {string|integer} id The record identifier, e.g. 123
 *
 * @returns {Object} Destructure as [expanded, toggleExpanded].
 *
 * @example
 *
 * const [expanded, toggleExpanded] = useExpanded('posts', 123);
 * const expandIcon = expanded ? ExpandLess : ExpandMore;
 * const onExpandClick = () => toggleExpanded();
 */
const useExpanded = (
    resource: string,
    id: Identifier
): [boolean, () => void] => {
    const dispatch = useDispatch();
    const expandedList = useSelector<ReduxState, Identifier[]>(
        (reduxState: ReduxState) =>
            reduxState.admin.resources[resource]
                ? reduxState.admin.resources[resource].list.expanded
                : undefined
    );
    const expanded =
        expandedList === undefined
            ? false
            : expandedList.map(el => el == id).indexOf(true) !== -1; // eslint-disable-line eqeqeq
    const toggleExpanded = useCallback(() => {
        dispatch(toggleListItemExpand(resource, id));
    }, [dispatch, resource, id]);

    return [expanded, toggleExpanded];
};

export default useExpanded;
