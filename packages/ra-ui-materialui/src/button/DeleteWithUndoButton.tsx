import * as React from 'react';
import { ReactNode, ReactEventHandler } from 'react';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import { UseMutationOptions } from '@tanstack/react-query';
import {
    RaRecord,
    useDeleteWithUndoController,
    DeleteParams,
    useRecordContext,
    useResourceContext,
    RedirectionSideEffect,
    useTranslate,
    useGetResourceLabel,
    useGetRecordRepresentation,
} from 'ra-core';

import { Button, ButtonProps } from './Button';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

export const DeleteWithUndoButton = <RecordType extends RaRecord = any>(
    inProps: DeleteWithUndoButtonProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        label: labelProp,
        className,
        icon = defaultIcon,
        onClick,
        redirect = 'list',
        mutationOptions,
        color = 'error',
        successMessage,
        ...rest
    } = props;

    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            '<DeleteWithUndoButton> components should be used inside a <Resource> component or provided with a resource prop. (The <Resource> component set the resource prop for all its children).'
        );
    }
    const { isPending, handleDelete } = useDeleteWithUndoController({
        record,
        resource,
        redirect,
        onClick,
        mutationOptions,
        successMessage,
    });
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const getRecordRepresentation = useGetRecordRepresentation();
    const recordRepresentationValue = getRecordRepresentation(record);
    const recordRepresentation =
        typeof recordRepresentationValue === 'string'
            ? recordRepresentationValue
            : recordRepresentationValue?.toString();
    const label =
        labelProp ??
        translate(`resources.${resource}.action.delete`, {
            recordRepresentation,
            _: translate(`ra.action.delete`, {
                name: getResourceLabel(resource, 1),
                recordRepresentation,
            }),
        });

    return (
        <StyledButton
            onClick={handleDelete}
            disabled={isPending}
            // avoid double translation
            label={<>{label}</>}
            // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
            aria-label={typeof label === 'string' ? label : undefined}
            className={clsx('ra-delete-button', className)}
            key="button"
            color={color}
            {...rest}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <ActionDelete />;

export interface DeleteWithUndoButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps {
    icon?: ReactNode;
    onClick?: ReactEventHandler<any>;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    successMessage?: string;
}

const PREFIX = 'RaDeleteWithUndoButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<DeleteWithUndoButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
