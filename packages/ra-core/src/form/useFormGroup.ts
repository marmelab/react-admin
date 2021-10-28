import { useState, useEffect } from 'react';
import { useFormState } from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import { useFormContext } from './useFormContext';

type FormGroupState = {
    dirty: boolean;
    errors: object;
    invalid: boolean;
    pristine: boolean;
    touched: boolean;
    valid: boolean;
};

/**
 * Retrieve a specific form group data such as its validation status (valid/invalid) or
 * or whether its inputs have been updated (dirty/pristine)
 *
 * @example
 * import { Edit, SimpleForm, TextInput, FormGroupContextProvider, useFormGroup } from 'react-admin';
 * import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
 *
 * const PostEdit = (props) => (
 *     <Edit {...props}>
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
 *         <Typography color={formGroupState.invalid && formGroupState.dirty ? 'error' : 'inherit'}>
 *             {children}
 *         </Typography>
 *     );
 * }
 *
 * @param {string} name The form group name
 * @returns {FormGroupState} The form group state
 */
export const useFormGroup = (name: string): FormGroupState => {
    const { dirtyFields, touchedFields, errors } = useFormState();
    const formContext = useFormContext();
    const [state, setState] = useState<FormGroupState>({
        dirty: false,
        errors: undefined,
        invalid: false,
        pristine: true,
        touched: false,
        valid: true,
    });

    useEffect(() => {
        const fields = formContext.getGroupFields(name);
        const fieldStates = fields
            .map(field => ({
                name: field,
                dirty: !!dirtyFields[field],
                errors: errors[field],
                invalid: !!errors[field],
                pristine: !dirtyFields[field],
                touched: !!touchedFields[field],
                valid: !errors[field],
            }))
            .filter(fieldState => fieldState != undefined); // eslint-disable-line
        const newState = getFormGroupState(fieldStates);

        setState(oldState => {
            if (!isEqual(oldState, newState)) {
                return newState;
            }

            return oldState;
        });
    }, [dirtyFields, errors, touchedFields, formContext, name]);

    return state;
};

type FieldState = {
    name: string;
    dirty: boolean;
    error?: string;
    invalid: boolean;
    pristine: boolean;
    touched: boolean;
    valid: boolean;
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
            let errors = acc.errors || {};

            if (fieldState.error) {
                errors[fieldState.name] = fieldState.error;
            }

            const newState = {
                dirty: acc.dirty || fieldState.dirty,
                errors,
                invalid: acc.invalid || fieldState.invalid,
                pristine: acc.pristine && fieldState.pristine,
                touched: acc.touched || fieldState.touched,
                valid: acc.valid && fieldState.valid,
            };

            return newState;
        },
        {
            dirty: false,
            errors: undefined,
            invalid: false,
            pristine: true,
            valid: true,
            touched: false,
        }
    );
};
