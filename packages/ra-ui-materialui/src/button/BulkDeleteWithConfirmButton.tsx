import * as React from 'react';
import { Fragment, useState } from 'react';
import ActionDelete from '@mui/icons-material/Delete';

import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    useResourceContext,
    useTranslate,
    type RaRecord,
    UseBulkDeleteControllerParams,
    useBulkDeleteController,
    useListContext,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, type ButtonProps } from './Button';
import { humanize, inflect } from 'inflection';

export const BulkDeleteWithConfirmButton = (
    inProps: BulkDeleteWithConfirmButtonProps
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        confirmTitle = 'ra.message.bulk_delete_title',
        confirmContent = 'ra.message.bulk_delete_content',
        confirmColor = 'primary',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode = 'pessimistic',
        onClick,
        ...rest
    } = props;
    const { selectedIds } = useListContext();
    const { handleDelete, isPending } = useBulkDeleteController({
        mutationMode,
        ...rest,
    });

    const [isOpen, setOpen] = useState(false);
    const resource = useResourceContext(props);
    const translate = useTranslate();

    const handleClick = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleConfirm = e => {
        setOpen(false);
        handleDelete();

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
                confirmColor={confirmColor}
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
    classes,
    label,
    resource,
    successMessage,
    ...rest
}: Omit<BulkDeleteWithConfirmButtonProps, 'icon' | 'mutationMode'>) => rest;

export interface BulkDeleteWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> extends ButtonProps,
        UseBulkDeleteControllerParams<RecordType, MutationOptionsError> {
    confirmContent?: React.ReactNode;
    confirmTitle?: React.ReactNode;
    confirmColor?: 'primary' | 'warning';
    icon?: React.ReactNode;
}

const PREFIX = 'RaBulkDeleteWithConfirmButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

const defaultIcon = <ActionDelete />;

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaBulkDeleteWithConfirmButton: 'root';
    }

    interface ComponentsPropsList {
        RaBulkDeleteWithConfirmButton: Partial<BulkDeleteWithConfirmButtonProps>;
    }

    interface Components {
        RaBulkDeleteWithConfirmButton?: {
            defaultProps?: ComponentsPropsList['RaBulkDeleteWithConfirmButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaBulkDeleteWithConfirmButton'];
        };
    }
}
