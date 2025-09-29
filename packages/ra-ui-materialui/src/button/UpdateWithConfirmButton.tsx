import * as React from 'react';
import { Fragment, useState } from 'react';
import ActionUpdate from '@mui/icons-material/Update';

import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    useTranslate,
    useResourceContext,
    type RaRecord,
    useRecordContext,
    useGetRecordRepresentation,
    useResourceTranslation,
    useUpdateController,
    UseUpdateControllerParams,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, type ButtonProps } from './Button';
import { humanize, singularize } from 'inflection';

export const UpdateWithConfirmButton = <
    RecordType extends RaRecord = any,
    MutationOptionsError extends Error = Error,
>(
    inProps: UpdateWithConfirmButtonProps<RecordType, MutationOptionsError>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const [isOpen, setOpen] = useState(false);
    const record = useRecordContext<RecordType>(props);

    const {
        confirmTitle: confirmTitleProp,
        confirmContent: confirmContentProp,
        data,
        icon = defaultIcon,
        label: labelProp,
        mutationMode = 'pessimistic',
        onClick,
        titleTranslateOptions = emptyObject,
        contentTranslateOptions = emptyObject,
        ...rest
    } = props;
    const { handleUpdate, isPending } = useUpdateController({
        ...rest,
        mutationMode,
        mutationOptions: {
            ...rest.mutationOptions,
            onSettled(...args) {
                // In pessimistic mode, we wait for the mutation to be completed (either successfully or with an error) before closing
                if (mutationMode === 'pessimistic') {
                    setOpen(false);
                }
                rest.mutationOptions?.onSettled?.(...args);
            },
        },
    });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleDialogClose = (e: React.MouseEvent) => {
        e?.stopPropagation();
        setOpen(false);
    };

    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        // We close the dialog immediately here for optimistic/undoable modes instead of in onSuccess/onError
        // to avoid reimplementing the default side effects
        if (mutationMode !== 'pessimistic') {
            setOpen(false);
        }
        handleUpdate(data);

        if (typeof onClick === 'function') {
            onClick(e);
        }
    };

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
        resourceI18nKey: `resources.${resource}.action.update`,
        baseI18nKey: 'ra.action.update',
        options: {
            name: resourceName,
            recordRepresentation,
        },
        userText: labelProp,
    });
    const confirmTitle = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.message.bulk_update_title`,
        baseI18nKey: 'ra.message.bulk_update_title',
        options: {
            recordRepresentation,
            name: resourceName,
            id: record?.id,
            smart_count: 1,
            ...titleTranslateOptions,
        },
        userText: confirmTitleProp,
    });
    const confirmContent = useResourceTranslation({
        resourceI18nKey: `resources.${resource}.message.bulk_update_content`,
        baseI18nKey: 'ra.message.bulk_update_content',
        options: {
            recordRepresentation,
            name: resourceName,
            id: record?.id,
            smart_count: 1,
            ...contentTranslateOptions,
        },
        userText: confirmContentProp,
    });

    return (
        <Fragment>
            <StyledButton
                onClick={handleClick}
                // avoid double translation
                label={<>{label}</>}
                // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
                aria-label={typeof label === 'string' ? label : undefined}
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </StyledButton>
            <Confirm
                isOpen={isOpen}
                loading={isPending}
                title={<>{confirmTitle}</>}
                content={<>{confirmContent}</>}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const sanitizeRestProps = ({
    label,
    mutationOptions,
    ...rest
}: Omit<
    UpdateWithConfirmButtonProps,
    'resource' | 'selectedIds' | 'icon' | 'data'
>) => rest;

export interface UpdateWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError extends Error = Error,
> extends ButtonProps,
        UseUpdateControllerParams<RecordType, MutationOptionsError> {
    confirmContent?: React.ReactNode;
    confirmTitle?: React.ReactNode;
    icon?: React.ReactNode;
    data: any;
    titleTranslateOptions?: object;
    contentTranslateOptions?: object;
}

const PREFIX = 'RaUpdateWithConfirmButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    color: (theme.vars || theme).palette.primary.main,
    '&:hover': {
        backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.primary.main}, transparent 12%)`,
        // Reset on mouse devices
        '@media (hover: none)': {
            backgroundColor: 'transparent',
        },
    },
}));

const defaultIcon = <ActionUpdate />;
const emptyObject = {};

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaUpdateWithConfirmButton: 'root';
    }

    interface ComponentsPropsList {
        RaUpdateWithConfirmButton: Partial<UpdateWithConfirmButtonProps>;
    }

    interface Components {
        RaUpdateWithConfirmButton?: {
            defaultProps?: ComponentsPropsList['RaUpdateWithConfirmButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaUpdateWithConfirmButton'];
        };
    }
}
