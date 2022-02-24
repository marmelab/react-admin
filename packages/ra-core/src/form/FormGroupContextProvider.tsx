import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import { FormGroupContext } from './FormGroupContext';
import { useFormGroups } from './useFormGroups';

/**
 * This provider allows its input children to register to a specific group.
 * This enables other components in the group to access group properties such as its
 * validation (valid/invalid) or whether its inputs have been updated (dirty/pristine).
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
 * @param props The component props
 * @param {ReactNode} props.children The form group content
 * @param {String} props.name The form group name
 */
export const FormGroupContextProvider = ({
    children,
    name,
}: {
    children: ReactNode;
    name: string;
}) => {
    const formGroups = useFormGroups();

    useEffect(() => {
        if (
            !formGroups ||
            !formGroups.registerGroup ||
            !formGroups.unregisterGroup
        ) {
            console.warn(
                `The FormGroupContextProvider can only be used inside a FormContext such as provided by the SimpleForm and TabbedForm components`
            );
            return;
        }
        formGroups.registerGroup(name);

        return () => {
            formGroups.unregisterGroup(name);
        };
    }, [formGroups, name]);

    return (
        <FormGroupContext.Provider value={name}>
            {children}
        </FormGroupContext.Provider>
    );
};
