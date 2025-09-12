import * as React from 'react';
import ActionDelete from '@mui/icons-material/Delete';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    type RaRecord,
    useBulkDeleteController,
    UseBulkDeleteControllerParams,
} from 'ra-core';

import { Button, type ButtonProps } from './Button';

export const BulkDeleteWithUndoButton = (
    inProps: BulkDeleteWithUndoButtonProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        label = 'ra.action.delete',
        icon = defaultIcon,
        onClick,
        ...rest
    } = props;
    const { handleDelete, isPending } = useBulkDeleteController(rest);

    const handleClick = e => {
        handleDelete();
        if (typeof onClick === 'function') {
            onClick(e);
        }
    };

    return (
        <StyledButton
            onClick={handleClick}
            label={label}
            disabled={isPending}
            color="error"
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionDelete />;

const sanitizeRestProps = ({
    classes,
    label,
    resource,
    successMessage,
    ...rest
}: Omit<BulkDeleteWithUndoButtonProps, 'icon' | 'mutationMode'>) => rest;

export interface BulkDeleteWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps,
        Omit<
            UseBulkDeleteControllerParams<RecordType, MutationOptionsError>,
            'mutationMode'
        > {
    icon?: React.ReactNode;
}

const PREFIX = 'RaBulkDeleteWithUndoButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaBulkDeleteWithUndoButton: 'root';
    }

    interface ComponentsPropsList {
        RaBulkDeleteWithUndoButton: Partial<BulkDeleteWithUndoButtonProps>;
    }

    interface Components {
        RaBulkDeleteWithUndoButton?: {
            defaultProps?: ComponentsPropsList['RaBulkDeleteWithUndoButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaBulkDeleteWithUndoButton'];
        };
    }
}
