import { useMemo, useSyncExternalStore } from 'react';
import get from 'lodash/get.js';
import { useFormState } from 'react-hook-form';
import { useFormGroups } from './useFormGroups';

type FieldState = {
    name: string;
    error?: any;
    isDirty: boolean;
    isTouched: boolean;
    isValid: boolean;
    isValidating: boolean;
};

type FormGroupState = {
    errors?: object;
    isDirty: boolean;
    isTouched: boolean;
    isValid: boolean;
    isValidating: boolean;
};

const EMPTY_FORM_GROUP_STATE: FormGroupState = {
    errors: undefined,
    isDirty: false,
    isTouched: false,
    isValid: true,
    isValidating: true,
};

const EMPTY_GROUP_FIELDS: string[] = [];

/**
 * Retrieve a specific form group data such as its validation status (valid/invalid) or
 * or whether its inputs have been updated (dirty/pristine)
 *
 * @example
 * import { Edit, SimpleForm, TextInput, FormGroupContextProvider, useFormGroup, minLength } from 'react-admin';
 * import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
 * import ExpandMoreIcon from '@mui/icons-material/ExpandMoreIcon';
 *
 * const PostEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *             <FormGroupContextProvider name="options">
 *                 <Accordion>
 *                     <AccordionSummary
 *                         expandIcon={<ExpandMoreIcon />}
 *                         aria-controls="options-content"
 *                         id="options-header"
 *                     >
 *                         <AccordionSectionTitle name="options">Options</AccordionSectionTitle>
 *                     </AccordionSummary>
 *                     <AccordionDetails id="options-content" aria-labelledby="options-header">
 *                         <TextInput source="teaser" validate={minLength(20)} />
 *                     </AccordionDetails>
 *                 </Accordion>
 *             </FormGroupContextProvider>
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * const AccordionSectionTitle = ({ children, name }) => {
 *     const formGroupState = useFormGroup(name);
 *     return (
 *         <Typography color={!formGroupState.isValid && formGroupState.isDirty ? 'error' : 'inherit'}>
 *             {children}
 *         </Typography>
 *     );
 * }
 *
 * @param {string} name The form group name
 * @returns {FormGroupState} The form group state
 */
export const useFormGroup = (name: string): FormGroupState => {
    const { dirtyFields, touchedFields, validatingFields, errors } =
        useFormState();

    // dirtyFields, touchedFields, validatingFields and errors are objects with keys being the field names
    // Ex: { title: true }
    // However, they are not correctly serialized when using JSON.stringify
    // To avoid missing updates, we extract the keys and use them as a dependency
    const dirtyFieldsNames = Object.keys(dirtyFields);
    const touchedFieldsNames = Object.keys(touchedFields);
    const validatingFieldsNames = Object.keys(validatingFields);
    const errorsNames = Object.keys(errors);

    const formGroups = useFormGroups();

    const { subscribe, getSnapshot } = useMemo(() => {
        return {
            subscribe: (onStoreChange: () => void) =>
                formGroups?.subscribe(name, onStoreChange) ?? (() => undefined),
            getSnapshot: () => {
                if (!formGroups) {
                    return null;
                }
                const fields = formGroups.getGroupFields(name);
                return fields.length ? fields : EMPTY_GROUP_FIELDS;
            },
        };
    }, [formGroups, name]);
    const fields = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    return useMemo(() => {
        if (!fields) {
            return EMPTY_FORM_GROUP_STATE;
        }
        const fieldStates = fields
            .map<FieldState>(field => {
                return {
                    name: field,
                    error: get(errors, field, undefined),
                    isDirty: get(dirtyFields, field, false) !== false,
                    isValid: get(errors, field, undefined) == null,
                    isValidating:
                        get(validatingFields, field, undefined) == null,
                    isTouched: get(touchedFields, field, false) !== false,
                };
            })
            .filter(fieldState => fieldState != undefined); // eslint-disable-line

        return getFormGroupState(fieldStates);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        fields,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(dirtyFieldsNames),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(errorsNames),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(touchedFieldsNames),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(validatingFieldsNames),
    ]);
};

/**
 * Get the state of a form group
 *
 * @param {FieldState[]} fieldStates A map of field states from react-hook-form where the key is the field name.
 * @returns {FormGroupState} The state of the group.
 */
export const getFormGroupState = (
    fieldStates: FieldState[]
): FormGroupState => {
    return fieldStates.reduce<FormGroupState>(
        (acc, fieldState) => {
            const errors = acc.errors || {};

            if (fieldState.error) {
                errors[fieldState.name] = fieldState.error;
            }

            const newState = {
                isDirty: acc.isDirty || fieldState.isDirty,
                errors,
                isTouched: acc.isTouched || fieldState.isTouched,
                isValid: acc.isValid && fieldState.isValid,
                isValidating: acc.isValidating && fieldState.isValidating,
            };

            return newState;
        },
        {
            isDirty: false,
            errors: undefined,
            isValid: true,
            isTouched: false,
            isValidating: false,
        }
    );
};
