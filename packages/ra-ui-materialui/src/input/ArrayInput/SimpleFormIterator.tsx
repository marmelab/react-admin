import * as React from 'react';
import type { ReactNode } from 'react';
import {
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material';
import clsx from 'clsx';
import {
    type RaRecord,
    useWrappedSource,
    SimpleFormIteratorBase,
    type SimpleFormIteratorBaseProps,
    type SimpleFormIteratorDisableRemoveFunction,
    RecordContextProvider,
    useArrayInput,
    useRecordContext,
    useEvent,
    useGetArrayInputNewItemDefaults,
} from 'ra-core';
import get from 'lodash/get.js';

import {
    SimpleFormIteratorClasses,
    SimpleFormIteratorPrefix as PREFIX,
} from './useSimpleFormIteratorStyles';
import {
    type SimpleFormIteratorGetItemLabelFunc,
    SimpleFormIteratorItem,
} from './SimpleFormIteratorItem';
import { AddItemButton as DefaultAddItemButton } from './AddItemButton';
import { SimpleFormIteratorClearButton } from './SimpleFormIteratorClearButton';

export const SimpleFormIterator = (inProps: SimpleFormIteratorProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        addButton = <DefaultAddItemButton />,
        removeButton,
        reOrderButtons,
        children,
        className,
        disabled,
        disableAdd = false,
        disableClear,
        disableRemove = false,
        disableReordering,
        inline,
        getItemLabel = false,
        fullWidth,
        sx,
    } = props;

    const finalSource = useWrappedSource('');
    if (!finalSource) {
        throw new Error(
            'SimpleFormIterator can only be called within an iterator input like ArrayInput'
        );
    }
    const { fields } = useArrayInput(props);
    const record = useRecordContext(props);
    const records = get(record, finalSource);
    const getArrayInputNewItemDefaults =
        useGetArrayInputNewItemDefaults(fields);

    const getItemDefaults = useEvent((item: any = undefined) => {
        if (item != null) return item;
        return getArrayInputNewItemDefaults(children);
    });

    return (
        <SimpleFormIteratorBase getItemDefaults={getItemDefaults} {...props}>
            <Root
                className={clsx(
                    className,
                    fullWidth && 'fullwidth',
                    disabled && 'disabled'
                )}
                sx={sx}
            >
                <ul className={SimpleFormIteratorClasses.list}>
                    {fields.map((member, index) => (
                        <RecordContextProvider
                            key={member.id}
                            value={(records && records[index]) || {}}
                        >
                            <SimpleFormIteratorItem
                                index={index}
                                fields={fields}
                                resource={props.resource}
                                disabled={disabled}
                                disableRemove={disableRemove}
                                disableReordering={disableReordering}
                                getItemLabel={getItemLabel}
                                removeButton={removeButton}
                                reOrderButtons={reOrderButtons}
                                inline={inline}
                            >
                                {children}
                            </SimpleFormIteratorItem>
                        </RecordContextProvider>
                    ))}
                </ul>
                {!disabled &&
                    !(disableAdd && (disableClear || disableRemove)) && (
                        <div className={SimpleFormIteratorClasses.buttons}>
                            {!disableAdd && (
                                <div className={SimpleFormIteratorClasses.add}>
                                    {addButton}
                                </div>
                            )}
                            <div className={SimpleFormIteratorClasses.clear}>
                                <SimpleFormIteratorClearButton
                                    disableClear={disableClear}
                                    disableRemove={disableRemove}
                                />
                            </div>
                        </div>
                    )}
            </Root>
        </SimpleFormIteratorBase>
    );
};

export interface SimpleFormIteratorProps
    extends Omit<SimpleFormIteratorBaseProps, 'children' | 'inputs'> {
    addButton?: ReactNode;
    children?: ReactNode;
    className?: string;
    readOnly?: boolean;
    disabled?: boolean;
    disableAdd?: boolean;
    disableClear?: boolean;
    disableRemove?: boolean | SimpleFormIteratorDisableRemoveFunction;
    disableReordering?: boolean;
    fullWidth?: boolean;
    getItemLabel?: boolean | SimpleFormIteratorGetItemLabelFunc;
    inline?: boolean;
    meta?: {
        // the type defined in FieldArrayRenderProps says error is boolean, which is wrong.
        error?: any;
        submitFailed?: boolean;
    };
    record?: RaRecord;
    removeButton?: ReactNode;
    reOrderButtons?: ReactNode;
    resource?: string;
    source?: string;
    sx?: SxProps<Theme>;
}

/*
@deprecated Use SimpleFormIteratorDisableRemoveFunction instead
*/
export type DisableRemoveFunction = SimpleFormIteratorDisableRemoveFunction;

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    '& > ul': {
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
    },
    '& > ul > li:last-child': {
        // hide the last separator
        borderBottom: 'none',
    },
    [`& .${SimpleFormIteratorClasses.line}`]: {
        display: 'flex',
        listStyleType: 'none',
        borderBottom: `solid 1px ${(theme.vars || theme).palette.divider}`,
        [theme.breakpoints.down('sm')]: { display: 'block' },
    },
    [`& .${SimpleFormIteratorClasses.index}`]: {
        display: 'flex',
        alignItems: 'top',
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
        [theme.breakpoints.down('md')]: { display: 'none' },
    },
    [`& .${SimpleFormIteratorClasses.form}`]: {
        minWidth: 0,
    },
    [`&.fullwidth > ul > li > .${SimpleFormIteratorClasses.form}`]: {
        flex: 2,
    },
    [`& .${SimpleFormIteratorClasses.inline}`]: {
        flexDirection: 'row',
        columnGap: '1em',
    },
    [`& .${SimpleFormIteratorClasses.action}`]: {
        marginTop: theme.spacing(0.5),
        visibility: 'hidden',
        '@media(hover:none)': {
            visibility: 'visible',
        },
    },
    [`& .${SimpleFormIteratorClasses.buttons}`]: {
        display: 'flex',
    },
    [`& .${SimpleFormIteratorClasses.add}`]: {
        borderBottom: 'none',
    },
    [`& .${SimpleFormIteratorClasses.clear}`]: {
        borderBottom: 'none',
    },
    [`& .${SimpleFormIteratorClasses.line}:hover > .${SimpleFormIteratorClasses.action}`]:
        {
            visibility: 'visible',
        },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSimpleFormIterator:
            | 'root'
            | 'action'
            | 'add'
            | 'clear'
            | 'form'
            | 'index'
            | 'inline'
            | 'line'
            | 'list'
            | 'buttons';
    }

    interface ComponentsPropsList {
        RaSimpleFormIterator: Partial<SimpleFormIteratorProps>;
    }

    interface Components {
        RaSimpleFormIterator?: {
            defaultProps?: ComponentsPropsList['RaSimpleFormIterator'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSimpleFormIterator'];
        };
    }
}
