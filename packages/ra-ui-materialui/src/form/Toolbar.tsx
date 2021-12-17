import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, isValidElement, ReactElement, FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
    Toolbar as MuiToolbar,
    ToolbarProps as MuiToolbarProps,
    useMediaQuery,
    Theme,
} from '@mui/material';
import classnames from 'classnames';
import { Record, RedirectionSideEffect, MutationMode } from 'ra-core';
import { FormRenderProps } from 'react-final-form';

import { SaveButton, DeleteButton } from '../button';

/**
 * The Toolbar displayed at the bottom of forms.
 *
 * @example Always enable the <SaveButton />
 *
 * import * as React from 'react';
 * import {
 *     Create,
 *     DateInput,
 *     TextInput,
 *     SimpleForm,
 *     Toolbar,
 *     required,
 * } from 'react-admin';
 *
 * const now = new Date();
 * const defaultSort = { field: 'title', order: 'ASC' };
 *
 * const CommentCreate = props => (
 *     <Create {...props}>
 *         <SimpleForm redirect={false} toolbar={<Toolbar alwaysEnableSaveButton={true} />}>
 *             <TextInput
 *                 source="author.name"
 *                 fullWidth
 *             />
 *             <DateInput source="created_at" defaultValue={now} />
 *             <TextInput source="body" fullWidth={true} multiline={true} />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by the <SimpleForm>)
 * @prop {boolean} alwaysEnableSaveButton Force enabling the <SaveButton>. If it's not defined, the <SaveButton> will be enabled using the `pristine` and `validating` props (disabled if pristine or validating, enabled otherwise).
 * @prop {ReactElement[]} children Customize the buttons you want to display in the <Toolbar>.
 * @prop {string} width Apply to the mobile or desktop classes depending on its value. Pass `xs` to display the mobile version.
 *
 */
export const Toolbar = <RecordType extends Partial<Record> = Partial<Record>>(
    props: ToolbarProps<RecordType>
) => {
    const {
        alwaysEnableSaveButton,
        basePath,
        children,
        className,
        handleSubmit,
        handleSubmitWithRedirect,
        invalid,
        pristine,
        record,
        redirect,
        resource,
        saving,
        submitOnEnter = true,
        mutationMode,
        validating,
        ...rest
    } = props;

    const isXs = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

    // Use form pristine and validating to enable or disable the save button
    // if alwaysEnableSaveButton is undefined
    const disabled = !valueOrDefault(
        alwaysEnableSaveButton,
        !pristine && !validating
    );

    return (
        <StyledToolbar
            className={classnames(
                ToolbarClasses.toolbar,
                {
                    [ToolbarClasses.mobileToolbar]: isXs,
                    [ToolbarClasses.desktopToolbar]: !isXs,
                },
                className
            )}
            role="toolbar"
            {...rest}
        >
            {Children.count(children) === 0 ? (
                <div className={ToolbarClasses.defaultToolbar}>
                    <SaveButton
                        handleSubmitWithRedirect={
                            handleSubmitWithRedirect || handleSubmit
                        }
                        disabled={disabled}
                        invalid={invalid}
                        redirect={redirect}
                        saving={saving || validating}
                        submitOnEnter={submitOnEnter}
                    />
                    {record && typeof record.id !== 'undefined' && (
                        <DeleteButton
                            basePath={basePath}
                            // @ts-ignore
                            record={record}
                            resource={resource}
                            mutationMode={mutationMode}
                        />
                    )}
                </div>
            ) : (
                Children.map(children, (button: ReactElement) =>
                    button && isValidElement<any>(button)
                        ? React.cloneElement(button, {
                              basePath: valueOrDefault(
                                  button.props.basePath,
                                  basePath
                              ),
                              handleSubmit: valueOrDefault(
                                  button.props.handleSubmit,
                                  handleSubmit
                              ),
                              handleSubmitWithRedirect: valueOrDefault(
                                  button.props.handleSubmitWithRedirect,
                                  handleSubmitWithRedirect
                              ),
                              onSave: button.props.onSave,
                              invalid,
                              pristine,
                              record: valueOrDefault(
                                  button.props.record,
                                  record
                              ),
                              resource: valueOrDefault(
                                  button.props.resource,
                                  resource
                              ),
                              saving,
                              submitOnEnter: valueOrDefault(
                                  button.props.submitOnEnter,
                                  submitOnEnter
                              ),
                              mutationMode: valueOrDefault(
                                  button.props.mutationMode,
                                  mutationMode
                              ),
                          })
                        : null
                )
            )}
        </StyledToolbar>
    );
};

export interface ToolbarProps<RecordType extends Partial<Record> = Record>
    extends Omit<MuiToolbarProps, 'classes'> {
    children?: ReactNode;
    alwaysEnableSaveButton?: boolean;
    className?: string;
    handleSubmitWithRedirect?: (redirect?: RedirectionSideEffect) => void;
    handleSubmit?: FormRenderProps['handleSubmit'];
    invalid?: boolean;
    mutationMode?: MutationMode;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    redirect?: RedirectionSideEffect;
    basePath?: string;
    record?: RecordType;
    resource?: string;
    validating?: boolean;
}

Toolbar.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    handleSubmit: PropTypes.func,
    handleSubmitWithRedirect: PropTypes.func,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    validating: PropTypes.bool,
};

const PREFIX = 'RaToolbar';

export const ToolbarClasses = {
    toolbar: `${PREFIX}-toolbar`,
    desktopToolbar: `${PREFIX}-desktopToolbar`,
    mobileToolbar: `${PREFIX}-mobileToolbar`,
    defaultToolbar: `${PREFIX}-defaultToolbar`,
    spacer: `${PREFIX}-spacer`,
};

const StyledToolbar = styled(MuiToolbar, { name: PREFIX })(({ theme }) => ({
    [`&.${ToolbarClasses.toolbar}`]: {
        backgroundColor:
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
    },

    [`&.${ToolbarClasses.desktopToolbar}`]: {
        marginTop: theme.spacing(2),
    },

    [`&.${ToolbarClasses.mobileToolbar}`]: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0,
        zIndex: 2,
    },

    [`& .${ToolbarClasses.defaultToolbar}`]: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;
