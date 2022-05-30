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
 *     SaveButton,
 *     required,
 * } from 'react-admin';
 *
 * const now = new Date();
 * const defaultSort = { field: 'title', order: 'ASC' };
 *
 * const MyToolbar = props => (
 *     <Toolbar {...props} >
 *         <SaveButton alwaysEnable />
 *     </Toolbar>
 * );
 *
 * const CommentCreate = () => (
 *     <Create>
 *         <SimpleForm redirect={false} toolbar={<MyToolbar />}>
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
 * @prop {ReactElement[]} children Customize the buttons you want to display in the <Toolbar>.
 *
 */
export const Toolbar = (props: ToolbarProps) => {
    const { children, className, resource, ...rest } = props;

    const isXs = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

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
                    <SaveButton />
                    <DeleteButton resource={resource} />
                </div>
            ) : (
                children
            )}
        </StyledToolbar>
    );
};

export interface ToolbarProps extends Omit<MuiToolbarProps, 'classes'> {
    children?: ReactNode;
    className?: string;
    resource?: string;
}

Toolbar.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,

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
