import { useState, useEffect } from 'react';
import { useForm } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import { useFormContext } from './useFormContext';
import { FieldState } from 'final-form';

type FormGroupState = {
    errors: object;
    valid: boolean;
    invalid: boolean;
    pristine: boolean;
    dirty: boolean;
};

/**
 * Retrieve a specific form group data such as its validation status (valid/invalid) or
 * or whether its inputs have been updated (dirty/pristine)
 *
 * @example
 * import { Edit, SimpleForm, TextInput, FormGroupContextProvider, useFormGroup } from 'react-admin';
 * import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
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
 * @param {string] name The form group name
 * @returns {FormGroupState} The form group state
 */
export const useFormGroup = (name: string): FormGroupState => {
    const form = useForm();
    const formContext = useFormContext();
    const [state, setState] = useState<FormGroupState>({
        errors: undefined,
        valid: true,
        invalid: false,
        pristine: true,
        dirty: false,
    });

    useEffect(() => {
        const unsubscribe = form.subscribe(
            () => {
                const fields = formContext.getGroupFields(name);
                const fieldStates = fields.map(form.getFieldState);
                const newState = getFormGroupState(fieldStates);

                setState(oldState => {
                    if (!isEqual(oldState, newState)) {
                        return newState;
                    }

                    return oldState;
                });
            },
            {
                errors: true,
                invalid: true,
                dirty: true,
                pristine: true,
                valid: true,
            }
        );
        return unsubscribe;
    }, [form, formContext, name]);

    return state;
};

/**
 * Get the state of a form group
 *
 * @param {FieldStates} fieldStates A map of field states from final-form where the key is the field name.
 * @returns {FormGroupState} The state of the group.
 */
export const getFormGroupState = (
    fieldStates: FieldState<any>[]
): FormGroupState =>
    fieldStates.reduce(
        (acc, fieldState) => {
            let errors = acc.errors || {};

            if (fieldState.error) {
                errors[fieldState.name] = fieldState.error;
            }

            const newState = {
                errors,
                valid: acc.valid && fieldState.valid,
                invalid: acc.invalid || fieldState.invalid,
                pristine: acc.pristine && fieldState.pristine,
                dirty: acc.dirty || fieldState.dirty,
            };

            return newState;
        },
        {
            errors: undefined,
            valid: true,
            invalid: false,
            pristine: true,
            dirty: false,
        }
    );
