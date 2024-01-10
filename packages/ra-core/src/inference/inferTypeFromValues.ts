import inflection from 'inflection';

import getValuesFromRecords from './getValuesFromRecords';

import {
    isObject,
    valuesAreArray,
    valuesAreBoolean,
    valuesAreDate,
    valuesAreDateString,
    valuesAreHtml,
    valuesAreInteger,
    valuesAreNumeric,
    valuesAreObject,
    valuesAreString,
    valuesAreUrl,
    valuesAreImageUrl,
    valuesAreEmail,
} from './assertions';

export const InferenceTypes = [
    'array',
    'boolean',
    'date',
    'email',
    'id',
    'image',
    'number',
    'reference',
    'referenceChild',
    'referenceArray',
    'referenceArrayChild',
    'richText',
    'string',
    'url',
    'object',
] as const;

export type PossibleInferredElementTypes = typeof InferenceTypes[number];

export interface InferredElementDescription {
    type: PossibleInferredElementTypes;
    props?: any;
    children?: InferredElementDescription | InferredElementDescription[];
}

/**
 * Guesses an element type based on an array of values
 *
 * @example
 *     inferElementFromValues(
 *         'address',
 *         ['2 Baker Street', '1 Downing street'],
 *     );
 *     // { type: 'string', props: { source: 'address' } }
 *
 * @param {string} name Property name, e.g. 'date_of_birth'
 * @param {any[]} values an array of values from which to determine the type, e.g. [12, 34.4, 43]
 */
export const inferTypeFromValues = (
    name,
    values = []
): InferredElementDescription => {
    if (name === 'id') {
        return { type: 'id', props: { source: name } };
    }
    if (name.substr(name.length - 3) === '_id') {
        return {
            type: 'reference',
            props: {
                source: name,
                reference: inflection.pluralize(
                    name.substr(0, name.length - 3)
                ),
            },
            children: { type: 'referenceChild' },
        };
    }
    if (name.substr(name.length - 2) === 'Id') {
        return {
            type: 'reference',
            props: {
                source: name,
                reference: inflection.pluralize(
                    name.substr(0, name.length - 2)
                ),
            },
            children: { type: 'referenceChild' },
        };
    }
    if (name.substr(name.length - 4) === '_ids') {
        return {
            type: 'referenceArray',
            props: {
                source: name,
                reference: inflection.pluralize(
                    name.substr(0, name.length - 4)
                ),
            },
            children: { type: 'referenceArrayChild' },
        };
    }
    if (name.substr(name.length - 3) === 'Ids') {
        return {
            type: 'referenceArray',
            props: {
                source: name,
                reference: inflection.pluralize(
                    name.substr(0, name.length - 3)
                ),
            },
            children: { type: 'referenceArrayChild' },
        };
    }
    if (values.length === 0) {
        if (name === 'email') {
            return { type: 'email', props: { source: name } };
        }
        if (name === 'url') {
            return { type: 'url', props: { source: name } };
        }
        // FIXME introspect further using name
        return { type: 'string', props: { source: name } };
    }
    if (valuesAreArray(values)) {
        if (isObject(values[0][0])) {
            const leafValues = getValuesFromRecords(
                values.reduce((acc, vals) => acc.concat(vals), [])
            );
            // FIXME bad visual representation
            return {
                type: 'array',
                props: { source: name },
                children: Object.keys(leafValues).map(leafName =>
                    inferTypeFromValues(leafName, leafValues[leafName])
                ),
            };
        }
        // FIXME introspect further
        return { type: 'string', props: { source: name } };
    }
    if (valuesAreBoolean(values)) {
        return { type: 'boolean', props: { source: name } };
    }
    if (valuesAreDate(values)) {
        return { type: 'date', props: { source: name } };
    }
    if (valuesAreString(values)) {
        if (name === 'email' || valuesAreEmail(values)) {
            return { type: 'email', props: { source: name } };
        }
        if (name === 'url' || valuesAreUrl(values)) {
            if (valuesAreImageUrl(values)) {
                return { type: 'image', props: { source: name } };
            }
            return { type: 'url', props: { source: name } };
        }
        if (valuesAreDateString(values)) {
            return { type: 'date', props: { source: name } };
        }
        if (valuesAreHtml(values)) {
            return { type: 'richText', props: { source: name } };
        }
        if (valuesAreInteger(values) || valuesAreNumeric(values)) {
            return { type: 'number', props: { source: name } };
        }
        return { type: 'string', props: { source: name } };
    }
    if (valuesAreInteger(values) || valuesAreNumeric(values)) {
        return { type: 'number', props: { source: name } };
    }
    if (valuesAreObject(values)) {
        /// Arbitrarily, choose the first prop of the first object
        const propName = Object.keys(values[0]).shift();
        if (!propName) {
            return { type: 'object', props: { source: name } };
        }
        const leafValues = values.map(v => v[propName]);
        return inferTypeFromValues(`${name}.${propName}`, leafValues);
    }
    return { type: 'string', props: { source: name } };
};
