import { FieldValues } from 'react-hook-form';
import isObject from 'lodash/isObject';
import merge from 'lodash/merge';
import reduce from 'lodash/reduce';
import { ValidationErrorMessageWithArgs } from './validate';

// Flattening an object into path keys:
// https://github.com/lodash/lodash/issues/2240#issuecomment-418820848
export const flattenErrors = (obj, path: string[] = []) =>
    !isObject(obj)
        ? { [path.join('.')]: obj }
        : reduce(
              obj,
              (cum, next, key) => {
                  if (
                      (obj[key] as ValidationErrorMessageWithArgs).message !=
                          null &&
                      (obj[key] as ValidationErrorMessageWithArgs).args != null
                  ) {
                      return merge(cum, { [key]: obj[key] });
                  }
                  return merge(cum, flattenErrors(next, [...path, key]));
              },
              {}
          );
/**
 * Convert a simple validation function that returns an object matching the form shape with errors
 * to a validation resolver compatible with react-hook-form.
 *
 * @example
 * const validate = (values: any) => {
 *     if (values.username == null || values.username.trim() === '') {
 *         return { username: 'Required' };
 *     }
 * }
 *
 * const validationResolver = getSimpleValidationResolver(validate);
 *
 * const UserForm = () => (
 *     <Form
 *         defaultValues={{ username: 'John' }}
 *         validationResolver={validationResolver}
 *     >
 *         <TextField source="username" />
 *     </Form>
 * );
 */
export const getSimpleValidationResolver = (validate: ValidateForm) => async (
    data: FieldValues
) => {
    const errors = await validate(data);

    if (!errors || Object.getOwnPropertyNames(errors).length === 0) {
        return { values: data, errors: {} };
    }
    const flattenedErrors = flattenErrors(errors);

    return {
        values: {},
        errors: Object.keys(flattenedErrors).reduce(
            (acc, field) => ({
                ...acc,
                [field]: {
                    type: 'manual',
                    message: flattenedErrors[field],
                },
            }),
            {} as FieldValues
        ),
    };
};

export type ValidateForm = (
    data: FieldValues
) => FieldValues | Promise<FieldValues>;
