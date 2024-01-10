import { useCallback, useEffect, useState } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { useFormState } from 'react-hook-form';
import { useFormGroups } from './useFormGroups';

type FieldState = {
    name: string;
    error?: any;
    isDirty: boolean;
    isTouched: boolean;
    isValid: boolean;
};

type FormGroupState = {
    errors?: object;
    isDirty: boolean;
    isTouched: boolean;
    isValid: boolean;
};

/**
 * Retrieve a specific form group data such as its validation status (valid/invalid) or
 * or whether its inputs have been updated (dirty/pristine)
 *
 * @example
 * import { Edit, SimpleForm, TextInput, FormGroupContextProvider, useFormGroup, minLength } from 'react-admin';
 * import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
 * import ExpandMoreIcon from '@mui/icons-material/ExpandMoreIcon';
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
    const { dirtyFields, touchedFields, errors } = useFormState();
    const formGroups = useFormGroups();
    const [state, setState] = useState<FormGroupState>({
        errors: undefined,
        isDirty: false,
        isTouched: false,
        isValid: true,
    });

    const updateGroupState = useCallback(() => {
        const fields = formGroups.getGroupFields(name);
        const fieldStates = fields
            .map<FieldState>(field => {
                return {
                    name: field,
                    error: get(errors, field, undefined),
                    isDirty: get(dirtyFields, field, false) !== false,
                    isValid: get(errors, field, undefined) == undefined, // eslint-disable-line
                    isTouched: get(touchedFields, field, false) !== false,
                };
            })
            .filter(fieldState => fieldState != undefined); // eslint-disable-line

        const newState = getFormGroupState(fieldStates);
        setState(oldState => {
            if (!isEqual(oldState, newState)) {
                return newState;
            }

            return oldState;
        });
    }, [dirtyFields, errors, touchedFields, formGroups, name]);

    useEffect(
        () => {
            updateGroupState();
        },
        // eslint-disable-next-line
        [
            // eslint-disable-next-line
            JSON.stringify({ dirtyFields, errors, touchedFields }),
            updateGroupState,
        ]
    );

    useEffect(() => {
        // Whenever the group content changes (input are added or removed)
        // we must update its state
        return formGroups.subscribe(name, () => {
            updateGroupState();
        });
    }, [formGroups, name, updateGroupState]);

    return state;
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
                isDirty: acc.isDirty || fieldState.isDirty,
                errors,
                isTouched: acc.isTouched || fieldState.isTouched,
                isValid: acc.isValid && fieldState.isValid,
            };

            return newState;
        },
        {
            isDirty: false,
            errors: undefined,
            isValid: true,
            isTouched: false,
        }
    );
};
