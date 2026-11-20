import get from 'lodash/get.js';
import has from 'lodash/has.js';
import set from 'lodash/set.js';
import unset from 'lodash/unset.js';

/**
 * Ignore the values from the location that have no input in the form
 *
 * Each of these values is replaced by its initial value, or removed if it has none.
 *
 * @param values The form values, modified in place
 * @param valuesFromLocation The values applied from the location
 * @param initialValues The form values before the location values were applied
 * @param inputNames The names of the inputs of the form
 *
 * @example
 * ignoreValuesWithoutInput(
 *     { id: 1, name: 'Jane', role: 'admin' }, // form values
 *     { name: 'Jane', role: 'admin' }, // values from the location
 *     { id: 1, name: 'John', role: 'user' }, // initial values
 *     ['name'] // input names
 * ); // { id: 1, name: 'Jane', role: 'user' }
 */
export const ignoreValuesWithoutInput = (
    values: any,
    valuesFromLocation: any,
    initialValues: any,
    inputNames: string[]
) => {
    if (valuesFromLocation == null) {
        return values;
    }
    const inputPaths = inputNames.map(name => name.split('.'));
    const ignore = (valuesToCheck: any, parentPath: string[]) => {
        Object.keys(valuesToCheck).forEach(key => {
            const path = [...parentPath, key];
            if (inputPaths.some(inputPath => startsWith(path, inputPath))) {
                return;
            }
            if (
                valuesToCheck[key] != null &&
                typeof valuesToCheck[key] === 'object' &&
                inputPaths.some(inputPath => startsWith(inputPath, path))
            ) {
                // some inputs cover parts of this value
                ignore(valuesToCheck[key], path);
                return;
            }
            if (has(initialValues, path)) {
                set(values, path, get(initialValues, path));
            } else {
                unset(values, path);
            }
        });
    };
    ignore(valuesFromLocation, []);
    return values;
};

const startsWith = (path: string[], prefix: string[]) =>
    prefix.length <= path.length &&
    prefix.every((key, index) => key === path[index]);
