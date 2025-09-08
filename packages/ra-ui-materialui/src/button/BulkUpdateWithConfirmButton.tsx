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
    });

    const handleClick = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleConfirm = e => {
        setOpen(false);
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
> extends ButtonProps,
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
