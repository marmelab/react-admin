import * as React from 'react';
import { ReactNode, ReactEventHandler } from 'react';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import {
    RaRecord,
    useDeleteController,
    useRecordContext,
    useResourceContext,
    useTranslate,
    useGetRecordRepresentation,
    useResourceTranslation,
    UseDeleteControllerParams,
} from 'ra-core';
import { humanize, singularize } from 'inflection';

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
    const { isPending, handleDelete } = useDeleteController({
        record,
        resource,
        redirect,
        mutationMode: 'undoable',
        mutationOptions,
        successMessage,
    });
    const handleClick: ReactEventHandler<any> = event => {
        event.stopPropagation();
        handleDelete();
        if (onClick) {
            onClick(event);
        }
    };

    const translate = useTranslate();
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    let recordRepresentation = getRecordRepresentation(record);
    const resourceName = translate(`resources.${resource}.forcedCaseName`, {
        smart_count: 1,
        _: humanize(
            translate(`resources.${resource}.name`, {
                smart_count: 1,
                _: resource ? singularize(resource) : undefined,
            }),
            true
        ),
    });
    // We don't support React elements for this
    if (React.isValidElement(recordRepresentation)) {
        recordRepresentation = `#${record?.id}`;
    }
    const label = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.action.delete`,
        baseI18nKey: 'ra.action.delete',
        options: {
            name: resourceName,
            recordRepresentation,
        },
        userText: labelProp,
    });

    return (
        <StyledButton
            onClick={handleClick}
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
> extends ButtonProps,
        UseDeleteControllerParams<RecordType, MutationOptionsError> {
    icon?: ReactNode;
    onClick?: ReactEventHandler<any>;
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
