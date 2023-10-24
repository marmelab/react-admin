import * as React from 'react';
import { Fragment, ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionDelete from '@mui/icons-material/Delete';
import inflection from 'inflection';
import { alpha, styled } from '@mui/material/styles';
import {
    MutationMode,
    useDeleteMany,
    useListContext,
    useNotify,
    useRefresh,
    useResourceContext,
    useTranslate,
    useSafeSetState,
    RaRecord,
    DeleteManyParams,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';
import { BulkActionProps } from '../types';
import { UseMutationOptions } from 'react-query';

export const BulkDeleteWithConfirmButton = (
    props: BulkDeleteWithConfirmButtonProps
) => {
    const {
        confirmTitle = 'ra.message.bulk_delete_title',
        confirmContent = 'ra.message.bulk_delete_content',
        confirmColor = 'primary',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode = 'pessimistic',
        mutationOptions = {},
        onClick,
        ...rest
    } = props;
    const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;
    const { selectedIds, onUnselectItems } = useListContext(props);
    const [isOpen, setOpen] = useSafeSetState(false);
    const notify = useNotify();
    const resource = useResourceContext(props);
    const refresh = useRefresh();
    const translate = useTranslate();
    const [deleteMany, { isLoading }] = useDeleteMany(
        resource,
        { ids: selectedIds, meta: mutationMeta },
        {
            onSuccess: () => {
                refresh();
                notify('ra.notification.deleted', {
                    type: 'info',
                    messageArgs: { smart_count: selectedIds.length },
                    undoable: mutationMode === 'undoable',
                });
                onUnselectItems();
                setOpen(false);
            },
            onError: (error: Error) => {
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                    ? error.message
                                    : undefined,
                        },
                    }
                );
                setOpen(false);
            },
            mutationMode,
            ...otherMutationOptions,
        }
    );

    const handleClick = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleDelete = e => {
        deleteMany();

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
                loading={isLoading}
                title={confirmTitle}
                content={confirmContent}
                confirmColor={confirmColor}
                translateOptions={{
                    smart_count: selectedIds.length,
                    name: translate(`resources.${resource}.forcedCaseName`, {
                        smart_count: selectedIds.length,
                        _: inflection.humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: selectedIds.length,
                                _: inflection.inflect(
                                    resource,
                                    selectedIds.length
                                ),
                            }),
                            true
                        ),
                    }),
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const sanitizeRestProps = ({
    classes,
    filterValues,
    label,
    selectedIds,
    ...rest
}: Omit<
    BulkDeleteWithConfirmButtonProps,
    'resource' | 'icon' | 'mutationMode'
>) => rest;

export interface BulkDeleteWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> extends BulkActionProps,
        ButtonProps {
    confirmContent?: React.ReactNode;
    confirmTitle?: React.ReactNode;
    confirmColor?: 'primary' | 'warning';
    icon?: ReactElement;
    mutationMode: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteManyParams<RecordType>
    > & { meta?: any };
}

const PREFIX = 'RaBulkDeleteWithConfirmButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    color: theme.palette.error.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.error.main, 0.12),
        // Reset on mouse devices
        '@media (hover: none)': {
            backgroundColor: 'transparent',
        },
    },
}));

const defaultIcon = <ActionDelete />;

BulkDeleteWithConfirmButton.propTypes = {
    confirmTitle: PropTypes.node,
    confirmContent: PropTypes.node,
    confirmColor: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
};
