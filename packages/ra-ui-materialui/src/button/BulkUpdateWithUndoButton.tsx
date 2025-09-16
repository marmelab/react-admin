import * as React from 'react';
import ActionUpdate from '@mui/icons-material/Update';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    useBulkUpdateController,
    type RaRecord,
    type UseBulkUpdateControllerParams,
} from 'ra-core';

import { Button, type ButtonProps } from './Button';

export const BulkUpdateWithUndoButton = (
    inProps: BulkUpdateWithUndoButtonProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        data,
        label = 'ra.action.update',
        icon = defaultIcon,
        onClick,
        ...rest
    } = props;

    const { handleUpdate, isPending } = useBulkUpdateController(rest);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        handleUpdate(data);
        if (typeof onClick === 'function') {
            onClick(e);
        }
    };

    return (
        <StyledButton
            onClick={handleClick}
            label={label}
            disabled={isPending}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionUpdate />;

const sanitizeRestProps = ({
    label,
    resource,
    successMessage,
    ...rest
}: Omit<BulkUpdateWithUndoButtonProps, 'icon' | 'data'>) => rest;

export interface BulkUpdateWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends Omit<ButtonProps, 'onError'>,
        Omit<
            UseBulkUpdateControllerParams<RecordType, MutationOptionsError>,
            'mutationMode'
        > {
    icon?: React.ReactNode;
    data: any;
}

const PREFIX = 'RaBulkUpdateWithUndoButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaBulkUpdateWithUndoButton: 'root';
    }

    interface ComponentsPropsList {
        RaBulkUpdateWithUndoButton: Partial<BulkUpdateWithUndoButtonProps>;
    }

    interface Components {
        RaBulkUpdateWithUndoButton?: {
            defaultProps?: ComponentsPropsList['RaBulkUpdateWithUndoButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaBulkUpdateWithUndoButton'];
        };
    }
}
