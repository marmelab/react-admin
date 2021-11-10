import * as React from 'react';
import {
    Children,
    isValidElement,
    ReactElement,
    ReactNode,
    HtmlHTMLAttributes,
} from 'react';
import PropTypes from 'prop-types';
import {
    FormWithRedirect,
    FormWithRedirectProps,
    MutationMode,
    Record,
    RedirectionSideEffect,
    OnSuccess,
    OnFailure,
} from 'ra-core';
import get from 'lodash/get';
import { useRouteMatch, useLocation } from 'react-router';

import { ClassesOverride } from '../types';
import { TabbedFormView, useTabbedFormViewStyles } from './TabbedFormView';

/**
 * Form layout where inputs are divided by tab, one input per line.
 *
 * Pass FormTab components as children.
 *
 * @example
 *
 * import * as React from "react";
 * import {
 *     Edit,
 *     TabbedForm,
 *     FormTab,
 *     Datagrid,
 *     TextField,
 *     DateField,
 *     TextInput,
 *     ReferenceManyField,
 *     NumberInput,
 *     DateInput,
 *     BooleanInput,
 *     EditButton
 * } from 'react-admin';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <TabbedForm>
 *             <FormTab label="summary">
 *                 <TextInput disabled label="Id" source="id" />
 *                 <TextInput source="title" validate={required()} />
 *                 <TextInput multiline source="teaser" validate={required()} />
 *             </FormTab>
 *             <FormTab label="body">
 *                 <RichTextInput source="body" validate={required()} addLabel={false} />
 *             </FormTab>
 *             <FormTab label="Miscellaneous">
 *                 <TextInput label="Password (if protected post)" source="password" type="password" />
 *                 <DateInput label="Publication date" source="published_at" />
 *                 <NumberInput source="average_note" validate={[ number(), minValue(0) ]} />
 *                 <BooleanInput label="Allow comments?" source="commentable" defaultValue />
 *                 <TextInput disabled label="Nb views" source="views" />
 *             </FormTab>
 *             <FormTab label="comments">
 *                 <ReferenceManyField reference="comments" target="post_id" addLabel={false}>
 *                     <Datagrid>
 *                         <TextField source="body" />
 *                         <DateField source="created_at" />
 *                         <EditButton />
 *                     </Datagrid>
 *                 </ReferenceManyField>
 *             </FormTab>
 *         </TabbedForm>
 *     </Edit>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {ReactElement[]} FormTab elements
 * @prop {Object} initialValues
 * @prop {Function} validate
 * @prop {boolean} submitOnEnter
 * @prop {string} redirect
 * @prop {ReactElement} toolbar The element displayed at the bottom of the form, containing the SaveButton
 * @prop {string} variant Apply variant to all inputs. Possible values are 'standard', 'outlined', and 'filled' (default)
 * @prop {string} margin Apply variant to all inputs. Possible values are 'none', 'normal', and 'dense' (default)
 * @prop {boolean} sanitizeEmptyValues Whether or not deleted record attributes should be recreated with a `null` value (default: true)
 *
 * @param {Props} props
 */
export const TabbedForm = (props: TabbedFormProps) => {
    const match = useRouteMatch();
    const location = useLocation();
    const formRootPathname = match ? match.url : location.pathname;

    return (
        <FormWithRedirect
            {...props}
            formRootPathname={formRootPathname}
            render={formProps => <TabbedFormView {...formProps} />}
        />
    );
};

TabbedForm.propTypes = {
    children: PropTypes.node,
    initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    // @ts-ignore
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    undoable: PropTypes.bool,
    validate: PropTypes.func,
    sanitizeEmptyValues: PropTypes.bool,
};

export interface TabbedFormProps
    extends Omit<FormWithRedirectProps, 'render'>,
        Omit<
            HtmlHTMLAttributes<HTMLFormElement>,
            'defaultValue' | 'onSubmit' | 'children'
        > {
    basePath?: string;
    children: ReactNode;
    className?: string;
    classes?: ClassesOverride<typeof useTabbedFormViewStyles>;
    initialValues?: any;
    margin?: 'none' | 'normal' | 'dense';
    mutationMode?: MutationMode;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    sanitizeEmptyValues?: boolean;
    save?: (
        data: Partial<Record>,
        redirectTo: RedirectionSideEffect,
        options?: {
            onSuccess?: OnSuccess;
            onFailure?: OnFailure;
        }
    ) => void;
    submitOnEnter?: boolean;
    syncWithLocation?: boolean;
    tabs?: ReactElement;
    toolbar?: ReactElement;
    /** @deprecated use mutationMode: undoable instead */
    undoable?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
    warnWhenUnsavedChanges?: boolean;
}

export const findTabsWithErrors = (children, errors) => {
    console.warn(
        'Deprecated. FormTab now wrap their content inside a FormGroupContextProvider. If you implemented custom forms with tabs, please use the FormGroupContextProvider. See https://marmelab.com/react-admin/CreateEdit.html#grouping-inputs'
    );

    return Children.toArray(children).reduce((acc: any[], child) => {
        if (!isValidElement(child)) {
            return acc;
        }

        const inputs = Children.toArray(child.props.children);

        if (
            inputs.some(
                input =>
                    isValidElement(input) && get(errors, input.props.source)
            )
        ) {
            return [...acc, child.props.label];
        }

        return acc;
    }, []);
};
