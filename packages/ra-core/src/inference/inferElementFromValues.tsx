import React from 'react';
import inflection from 'inflection';

import getValuesFromRecords from './getValuesFromRecords';
import InferredElement from './InferredElement';

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
} from './assertions';
import { InferredTypeMap } from './types';

const DefaultComponent = () => <span>;</span>;
const defaultType = {
    type: DefaultComponent,
    representation: () => '<DefaultComponent />',
};
const defaultTypes = {
    array: defaultType,
    boolean: defaultType,
    date: defaultType,
    email: defaultType,
    id: defaultType,
    number: defaultType,
    reference: defaultType,
    referenceArray: defaultType,
    richText: defaultType,
    string: defaultType,
    url: defaultType,
};

const hasType = (type, types) => typeof types[type] !== 'undefined';

/**
 * Guesses an element based on an array of values
 *
 * @example
 *     inferElementFromValues(
 *         'address',
 *         ['2 Baker Street', '1 Downing street'],
 *         { number: NumberField, string: StringField }
 *     );
 *     // new InferredElement(<StringField source="address" />)
 *
 * Types are optional: if a type isn't provided, the function falls back
 * to the neareast type.
 *
 * @example
 *     inferElementFromValues(
 *         'content',
 *         ['<h1>Hello</h1>'],
 *         { string: StringField } // no richText type
 *     );
 *     // new InferredElement(<StringField source="content" />)
 *
 * Types can be disabled by passing a falsy value.
 *
 * @example
 *     inferElementFromValues(
 *         'content',
 *         ['<h1>Hello</h1>'],
 *         { string: StringField, richText: false }
 *     );
 *     // null
 *
 * @param {String} name Property name, e.g. 'date_of_birth'
 * @param {[mixed]} values an array of values from which to determine the type, e.g. [12, 34.4, 43]
 * @param {Object} types A set of components indexed by type. The string type is the only required one
 *
 * @return InferredElement
 */
const inferElementFromValues = (
    name,
    values = [],
    types: InferredTypeMap = defaultTypes
) => {
    if (name === 'id' && hasType('id', types)) {
        return new InferredElement(types.id, { source: name });
    }
    if (name.substr(name.length - 3) === '_id' && hasType('reference', types)) {
        const reference = inflection.pluralize(name.substr(0, name.length - 3));
        return (
            types.reference &&
            new InferredElement(
                types.reference,
                {
                    source: name,
                    reference,
                },
                new InferredElement(types.referenceChild)
            )
        );
    }
    if (name.substr(name.length - 2) === 'Id' && hasType('reference', types)) {
        const reference = inflection.pluralize(name.substr(0, name.length - 2));
        return (
            types.reference &&
            new InferredElement(
                types.reference,
                {
                    source: name,
                    reference,
                },
                new InferredElement(types.referenceChild)
            )
        );
    }
    if (
        name.substr(name.length - 4) === '_ids' &&
        hasType('referenceArray', types)
    ) {
        const reference = inflection.pluralize(name.substr(0, name.length - 4));
        return (
            types.referenceArray &&
            new InferredElement(
                types.referenceArray,
                {
                    source: name,
                    reference,
                },
                new InferredElement(types.referenceArrayChild)
            )
        );
    }
    if (
        name.substr(name.length - 3) === 'Ids' &&
        hasType('referenceArray', types)
    ) {
        const reference = inflection.pluralize(name.substr(0, name.length - 3));
        return (
            types.referenceArray &&
            new InferredElement(
                types.referenceArray,
                {
                    source: name,
                    reference,
                },
                new InferredElement(types.referenceArrayChild)
            )
        );
    }
    if (values.length === 0) {
        // FIXME introspect further using name
        return new InferredElement(types.string, { source: name });
    }
    if (valuesAreArray(values)) {
        if (isObject(values[0][0]) && hasType('array', types)) {
            const leafValues = getValuesFromRecords(
                values.reduce((acc, vals) => acc.concat(vals), [])
            );
            // FIXME bad visual representation
            return (
                types.array &&
                new InferredElement(
                    types.array,
                    {
                        source: name,
                    },
                    Object.keys(leafValues).map(leafName =>
                        inferElementFromValues(
                            leafName,
                            leafValues[leafName],
                            types
                        )
                    )
                )
            );
        }
        // FIXME introspect further
        return new InferredElement(types.string, { source: name });
    }
    if (valuesAreBoolean(values) && hasType('boolean', types)) {
        return new InferredElement(types.boolean, { source: name });
    }
    if (valuesAreDate(values) && hasType('date', types)) {
        return new InferredElement(types.date, { source: name });
    }
    if (valuesAreString(values)) {
        if (name === 'email' && hasType('email', types)) {
            return new InferredElement(types.email, { source: name });
        }
        if (name === 'url' && hasType('url', types)) {
            return new InferredElement(types.url, { source: name });
        }
        if (valuesAreDateString(values) && hasType('date', types)) {
            return new InferredElement(types.date, { source: name });
        }
        if (valuesAreHtml(values) && hasType('richText', types)) {
            return new InferredElement(types.richText, { source: name });
        }
        return new InferredElement(types.string, { source: name });
    }
    if (
        (valuesAreInteger(values) || valuesAreNumeric(values)) &&
        hasType('number', types)
    ) {
        return new InferredElement(types.number, { source: name });
    }
    if (valuesAreObject(values)) {
        // we need to go deeper
        // Arbitrarily, choose the first prop of the first object
        const propName = Object.keys(values[0]).shift();
        const leafValues = values.map(v => v[propName]);
        return inferElementFromValues(`${name}.${propName}`, leafValues, types);
    }
    return new InferredElement(types.string, { source: name });
};

export default inferElementFromValues;
