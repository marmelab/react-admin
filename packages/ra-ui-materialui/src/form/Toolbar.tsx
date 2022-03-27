import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, ReactNode } from 'react';
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
    SaveContextValue,
    useRecordContext,
    useSaveContext,
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
 * const CommentCreate = () => (
 *     <Create>
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
 * @prop {boolean} alwaysEnableSaveButton Force enabling the <SaveButton>. If it's not defined, the `<SaveButton>` will be enabled using `react-hook-form`'s `isValidating` state prop and form context's `saving` prop (disabled if isValidating or saving, enabled otherwise).
 * @prop {ReactElement[]} children Customize the buttons you want to display in the <Toolbar>.
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
        ...rest
    } = props;
    const record = useRecordContext(props);
    const saveContext = useSaveContext();
    const isXs = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    const { isValidating } = useFormState();
    // Use form isValidating and form context saving to enable or disable the save button
    // if alwaysEnableSaveButton is undefined
    const disabled = !valueOrDefault(
        alwaysEnableSaveButton !== false ? alwaysEnableSaveButton : undefined,
        !isValidating && !saveContext?.saving
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
                    <SaveButton disabled={disabled} />
                    {record && typeof record.id !== 'undefined' && (
                        <DeleteButton resource={resource} />
                    )}
                </div>
            ) : (
                children
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
    record?: RecordType;
    resource?: string;
}

Toolbar.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    record: PropTypes.any,
    resource: PropTypes.string,
};

const PREFIX = 'RaToolbar';

export const ToolbarClasses = {
    desktopToolbar: `${PREFIX}-desktopToolbar`,
    mobileToolbar: `${PREFIX}-mobileToolbar`,
    defaultToolbar: `${PREFIX}-defaultToolbar`,
};

const StyledToolbar = styled(MuiToolbar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],

    [`&.${ToolbarClasses.desktopToolbar}`]: {},

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
