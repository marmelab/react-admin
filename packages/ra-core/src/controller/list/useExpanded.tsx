import { useCallback } from 'react';

import { useStore } from '../../store';
import { Identifier } from '../../types';

/**
 * State-like hook for controlling the expanded state of a list item
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {string|integer} id The record identifier, e.g. 123
 * @param {boolean} single Forces only one id to be expanded at a time
 * @returns {Object} Destructure as [expanded, toggleExpanded].
 *
 * @example
 *
 * const [expanded, toggleExpanded] = useExpanded('posts', 123);
 * const expandIcon = expanded ? ExpandLess : ExpandMore;
 * const onExpandClick = () => toggleExpanded();
 */
export const useExpanded = (
    resource: string,
    id: Identifier,
    single: boolean = false
): [boolean, () => void] => {
    const [expandedIds, setExpandedIds] = useStore<Identifier[]>(
        `${resource}.datagrid.expanded`,
        []
    );
    const expanded = Array.isArray(expandedIds)
        ? // eslint-disable-next-line eqeqeq
          expandedIds.map(el => el == id).indexOf(true) !== -1
        : false;

    const toggleExpanded = useCallback(() => {
        setExpandedIds(ids => {
            if (!Array.isArray(ids)) {
                return [id];
            }
            const index = ids.findIndex(el => el == id); // eslint-disable-line eqeqeq
            return index > -1
                ? single
                    ? []
                    : [...ids.slice(0, index), ...ids.slice(index + 1)]
                : single
                  ? [id]
                  : [...ids, id];
        });
    }, [setExpandedIds, id, single]);

    return [expanded, toggleExpanded];
};

/**
 * State-like hook for controlling the expanded state of many list items
 * expanded state is true when at least one item from ids is expanded.
 *
 * @param {string} resource The resource name, e.g. 'posts'
 * @param {Identifier[]} ids A list of record identifiers
 * @returns {Object} Destructure as [expanded, toggleExpanded].
 *
 * @example
 *
 * const [expanded, toggleExpanded] = useExpandAll('posts', [123, 124, 125]);
 * const expandIcon = expanded ? ExpandLess : ExpandMore;
 * const onExpandClick = () => toggleExpanded();
 */
export const useExpandAll = (
    resource: string,
    ids: Identifier[]
): [boolean, () => void] => {
    const [expandedIds, setExpandedIds] = useStore<Identifier[]>(
        `${resource}.datagrid.expanded`,
        []
    );

    const isExpanded = Array.isArray(expandedIds)
        ? // eslint-disable-next-line eqeqeq
          expandedIds.some(id => ids.some(id2 => id2 == id))
        : false;

    const toggleExpandedAll = useCallback(() => {
        const unaffectedExpandedIds = expandedIds.filter(
            // eslint-disable-next-line eqeqeq
            expanded_id => !ids.some(id => id == expanded_id)
        );
        setExpandedIds(
            isExpanded
                ? unaffectedExpandedIds
                : unaffectedExpandedIds.concat(ids)
        );
    }, [expandedIds, setExpandedIds, isExpanded, ids]);

    return [isExpanded, toggleExpandedAll];
};
