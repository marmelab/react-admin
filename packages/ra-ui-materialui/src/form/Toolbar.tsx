import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, isValidElement, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
    Toolbar as MuiToolbar,
    ToolbarProps as MuiToolbarProps,
    useMediaQuery,
    Theme,
} from '@mui/material';
import clsx from 'clsx';
import {
    RaRecord,
    MutationMode,
    SaveContextValue,
    useRecordContext,
} from 'ra-core';
import { useFormState } from 'react-hook-form';

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
export const Toolbar = <
    RecordType extends Partial<RaRecord> = Partial<RaRecord>
>(
    props: ToolbarProps<RecordType>
) => {
    const {
        alwaysEnableSaveButton,
        children,
        className,
        resource,
        saving,
        submitOnEnter = true,
        mutationMode,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const isXs = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    const { isValidating } = useFormState();
    // Use form pristine and validating to enable or disable the save button
    // if alwaysEnableSaveButton is undefined
    const disabled = !valueOrDefault(
        alwaysEnableSaveButton,
        !isValidating && !saving
    );

    return (
        <StyledToolbar
            className={clsx(
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
                        disabled={disabled}
                        submitOnEnter={submitOnEnter}
                    />
                    {record && typeof record.id !== 'undefined' && (
                        <DeleteButton
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
                              record: valueOrDefault(
                                  button.props.record,
                                  record
                              ),
                              resource: valueOrDefault(
                                  button.props.resource,
                                  resource
                              ),
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

export interface ToolbarProps<RecordType extends Partial<RaRecord> = any>
    extends Omit<MuiToolbarProps, 'classes'>,
        Partial<SaveContextValue> {
    children?: ReactNode;
    alwaysEnableSaveButton?: boolean;
    className?: string;
    mutationMode?: MutationMode;
    submitOnEnter?: boolean;
    record?: RecordType;
    resource?: string;
}

Toolbar.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    record: PropTypes.any,
    resource: PropTypes.string,
    submitOnEnter: PropTypes.bool,
};

const PREFIX = 'RaToolbar';

export const ToolbarClasses = {
    desktopToolbar: `${PREFIX}-desktopToolbar`,
    mobileToolbar: `${PREFIX}-mobileToolbar`,
    defaultToolbar: `${PREFIX}-defaultToolbar`,
    spacer: `${PREFIX}-spacer`,
};

const StyledToolbar = styled(MuiToolbar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],

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
