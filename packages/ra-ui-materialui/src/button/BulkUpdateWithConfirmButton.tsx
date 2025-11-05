import * as React from 'react';
import { Fragment, useState } from 'react';
import ActionUpdate from '@mui/icons-material/Update';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    useListContext,
    useTranslate,
    useResourceContext,
    type RaRecord,
    useBulkUpdateController,
    UseBulkUpdateControllerParams,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, type ButtonProps } from './Button';
import { humanize, inflect } from 'inflection';

export const BulkUpdateWithConfirmButton = (
    inProps: BulkUpdateWithConfirmButtonProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const [isOpen, setOpen] = useState(false);
    const { selectedIds } = useListContext();

    const {
        confirmTitle = 'ra.message.bulk_update_title',
        confirmContent = 'ra.message.bulk_update_content',
        data,
        icon = defaultIcon,
        label = 'ra.action.update',
        mutationMode = 'pessimistic',
        onClick,
        ...rest
    } = props;
    const { handleUpdate, isPending } = useBulkUpdateController({
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
        e.stopPropagation();
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

    return (
        <Fragment>
            <StyledButton
                onClick={handleClick}
                label={label}
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </StyledButton>
            <Confirm
                isOpen={isOpen}
                loading={isPending}
                title={confirmTitle}
                content={confirmContent}
                titleTranslateOptions={{
                    smart_count: selectedIds.length,
                    name: translate(`resources.${resource}.forcedCaseName`, {
                        smart_count: selectedIds.length,
                        _: humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: selectedIds.length,
                                _: resource
                                    ? inflect(resource, selectedIds.length)
                                    : undefined,
                            }),
                            true
                        ),
                    }),
                }}
                contentTranslateOptions={{
                    smart_count: selectedIds.length,
                    name: translate(`resources.${resource}.forcedCaseName`, {
                        smart_count: selectedIds.length,
                        _: humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: selectedIds.length,
                                _: resource
                                    ? inflect(resource, selectedIds.length)
                                    : undefined,
                            }),
                            true
                        ),
                    }),
                }}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const sanitizeRestProps = ({
    label,
    resource,
    successMessage,
    ...rest
}: Omit<BulkUpdateWithConfirmButtonProps, 'icon' | 'data'>) => rest;

export interface BulkUpdateWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends Omit<ButtonProps, 'onError'>,
        UseBulkUpdateControllerParams<RecordType, MutationOptionsError> {
    confirmContent?: React.ReactNode;
    confirmTitle?: React.ReactNode;
    icon?: React.ReactNode;
    data: any;
}

const PREFIX = 'RaBulkUpdateWithConfirmButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

const defaultIcon = <ActionUpdate />;

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaBulkUpdateWithConfirmButton: 'root';
    }

    interface ComponentsPropsList {
        RaBulkUpdateWithConfirmButton: Partial<BulkUpdateWithConfirmButtonProps>;
    }

    interface Components {
        RaBulkUpdateWithConfirmButton?: {
            defaultProps?: ComponentsPropsList['RaBulkUpdateWithConfirmButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaBulkUpdateWithConfirmButton'];
        };
    }
}
