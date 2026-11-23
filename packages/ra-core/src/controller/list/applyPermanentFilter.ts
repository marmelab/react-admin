import isPlainObject from 'lodash/isPlainObject.js';
import { flattenObject } from '../../dataProvider/fetch';
import { FilterPayload } from '../../types';

/**
 * Merge the user filter values with the permanent filter.
 *
 * The permanent filter keys come last, so that they win even in data providers
 * that map several keys to the same parameter (e.g. 'author.id' and { author: { id } }).
 *
 * The filter values using a bracket notation for a field of the permanent filter
 * (e.g. 'published[]', 'published[0]x' or '[published]' for 'published') are ignored.
 */
export const applyPermanentFilter = (
    filterValues: FilterPayload | null | undefined,
    permanentFilter: FilterPayload | null | undefined
): FilterPayload => {
    const permanentKeys = Object.keys(permanentFilter ?? {});
    const permanentFields = Object.keys(
        flattenObject(permanentFilter ?? {})
    ).map(removeBrackets);
    return {
        ...omitBracketNotations(
            Object.fromEntries(
                Object.entries(filterValues ?? {}).filter(
                    ([key]) => !permanentKeys.includes(key)
                )
            ),
            permanentFields
        ),
        ...permanentFilter,
    };
};

const omitBracketNotations = (
    filterValues: FilterPayload,
    fields: string[],
    path: string[] = []
): FilterPayload =>
    Object.fromEntries(
        Object.entries(filterValues)
            .filter(([key]) => {
                const name = [...path, key].join('.');
                const field = removeBrackets(name);
                return field === name || !fields.includes(field);
            })
            .map(([key, value]) => [
                key,
                isPlainObject(value)
                    ? omitBracketNotations(value, fields, [...path, key])
                    : value,
            ])
    );

// Read the key as qs does: the text outside the bracket groups is ignored, the first
// group is the field when nothing precedes it, and array indexes target the field itself.
// So 'foo[]', 'foo[0]x', '[foo]x' and 'foo[] ' all read as 'foo', and 'foo[bar]' as 'foo.bar'
const removeBrackets = (key: string) => {
    const groups = key.match(/\[[^[\]]*\]/g);
    if (!groups) return key;
    const parent = key.slice(0, key.indexOf(groups[0]));
    const [field, ...children] = [
        parent,
        ...groups.map(group => group.slice(1, -1)),
    ].filter((segment, index) => index > 0 || segment !== '');
    return [field, ...children.filter(child => !/^\d*$/.test(child))].join('.');
};
