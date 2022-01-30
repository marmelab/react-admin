import { useCallback } from 'react';

import { useStore } from '../store';
import { Identifier } from '../types';

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
    const [expandedIds, setExpandedIds] = useStore<Identifier[]>(
        `${resource}.datagrid.expanded.`,
        []
    );
    const expanded = Array.isArray(expandedIds)
        ? // eslint-disable-next-line eqeqeq
          expandedIds.map(el => el == id).indexOf(true) !== -1
        : false;

    const toggleExpanded = useCallback(() => {
        if (!Array.isArray(expandedIds)) {
            setExpandedIds([id]);
            return;
        }
        const index = expandedIds.findIndex(el => el == id); // eslint-disable-line eqeqeq
        setExpandedIds(
            index > -1
                ? [
                      ...expandedIds.slice(0, index),
                      ...expandedIds.slice(index + 1),
                  ]
                : [...expandedIds, id]
        );
    }, [setExpandedIds, expandedIds, id]);

    return [expanded, toggleExpanded];
};

export default useExpanded;
