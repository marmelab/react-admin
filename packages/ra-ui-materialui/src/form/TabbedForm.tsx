import * as React from 'react';
import {
    Children,
    isValidElement,
    FC,
    ReactElement,
    ReactNode,
    HtmlHTMLAttributes,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Route, useRouteMatch, useLocation } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {
    escapePath,
    FormWithRedirect,
    FormWithRedirectProps,
    Record,
    RedirectionSideEffect,
} from 'ra-core';
import { FormRenderProps } from 'react-final-form';
import get from 'lodash/get';

import Toolbar from './Toolbar';
import TabbedFormTabs, { getTabFullPath } from './TabbedFormTabs';
import { ClassesOverride } from '../types';

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
 * @param {Prop} props
 */
const TabbedForm: FC<TabbedFormProps> = props => (
    <FormWithRedirect
        {...props}
        render={formProps => <TabbedFormView {...formProps} />}
    />
);

TabbedForm.propTypes = {
    children: PropTypes.node,
    initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
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
    initialValues?: any;
    margin?: 'none' | 'normal' | 'dense';
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    sanitizeEmptyValues?: boolean;
    save?: (
        data: Partial<Record>,
        redirectTo: RedirectionSideEffect,
        options?: {
            onSuccess?: (data?: any) => void;
            onFailure?: (error: any) => void;
        }
    ) => void;
    submitOnEnter?: boolean;
    tabs?: ReactElement;
    toolbar?: ReactElement;
    undoable?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
    warnWhenUnsavedChanges?: boolean;
}

const useStyles = makeStyles(
    theme => ({
        errorTabButton: { color: theme.palette.error.main },
        content: {
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }),
    { name: 'RaTabbedForm' }
);

export const TabbedFormView: FC<TabbedFormViewProps> = props => {
    const {
        basePath,
        children,
        className,
        classes: classesOverride,
        form,
        handleSubmit,
        handleSubmitWithRedirect,
        invalid,
        pristine,
        record,
        redirect: defaultRedirect,
        resource,
        saving,
        submitOnEnter,
        tabs,
        toolbar,
        undoable,
        variant,
        margin,
        ...rest
    } = props;
    const tabsWithErrors = findTabsWithErrors(children, form.getState().errors);
    const classes = useStyles(props);
    const match = useRouteMatch();
    const location = useLocation();

    const url = match ? match.url : location.pathname;
    return (
        <form
            className={classnames('tabbed-form', className)}
            {...sanitizeRestProps(rest)}
        >
            {React.cloneElement(
                tabs,
                {
                    classes,
                    url,
                    tabsWithErrors,
                },
                children
            )}
            <Divider />
            <div className={classes.content}>
                {/* All tabs are rendered (not only the one in focus), to allow validation
                on tabs not in focus. The tabs receive a `hidden` property, which they'll
                use to hide the tab using CSS if it's not the one in focus.
                See https://github.com/marmelab/react-admin/issues/1866 */}
                {Children.map(
                    children,
                    (tab: ReactElement, index) =>
                        tab && (
                            <Route
                                exact
                                path={escapePath(
                                    getTabFullPath(tab, index, url)
                                )}
                            >
                                {routeProps =>
                                    isValidElement<any>(tab)
                                        ? React.cloneElement(tab, {
                                              intent: 'content',
                                              resource,
                                              record,
                                              basePath,
                                              hidden: !routeProps.match,
                                              variant:
                                                  tab.props.variant || variant,
                                              margin:
                                                  tab.props.margin || margin,
                                          })
                                        : null
                                }
                            </Route>
                        )
                )}
            </div>
            {toolbar &&
                React.cloneElement(toolbar, {
                    basePath,
                    className: 'toolbar',
                    handleSubmitWithRedirect,
                    handleSubmit,
                    invalid,
                    pristine,
                    record,
                    redirect: defaultRedirect,
                    resource,
                    saving,
                    submitOnEnter,
                    undoable,
                })}
        </form>
    );
};

TabbedFormView.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    classes: PropTypes.object,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // @deprecated
    initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by react-final-form
    invalid: PropTypes.bool,
    location: PropTypes.object,
    match: PropTypes.object,
    pristine: PropTypes.bool,
    // @ts-ignore
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    tabs: PropTypes.element.isRequired,
    tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
    toolbar: PropTypes.element,
    translate: PropTypes.func,
    undoable: PropTypes.bool,
    validate: PropTypes.func,
    value: PropTypes.number,
    version: PropTypes.number,
};

TabbedFormView.defaultProps = {
    submitOnEnter: true,
    tabs: <TabbedFormTabs />,
    toolbar: <Toolbar />,
};

export interface TabbedFormViewProps extends FormRenderProps {
    basePath?: string;
    classes?: ClassesOverride<typeof useStyles>;
    className?: string;
    margin?: 'none' | 'normal' | 'dense';
    handleSubmitWithRedirect?: (redirectTo: RedirectionSideEffect) => void;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    save?: () => void;
    saving?: boolean;
    tabs?: ReactElement;
    toolbar?: ReactElement;
    undoable?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
    submitOnEnter?: boolean;
    __versions?: any; // react-final-form internal prop, missing in their type
}

const sanitizeRestProps = ({
    active,
    dirty,
    dirtyFields,
    dirtyFieldsSinceLastSubmit,
    dirtySinceLastSubmit,
    error,
    errors,
    hasSubmitErrors,
    hasValidationErrors,
    initialValues,
    modified = null,
    modifiedSinceLastSubmit,
    save = null,
    submitError,
    submitErrors,
    submitFailed,
    submitSucceeded,
    submitting,
    touched = null,
    valid,
    validating,
    values,
    visited = null,
    __versions = null,
    ...props
}) => props;

export const findTabsWithErrors = (children, errors) => {
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

export default TabbedForm;
