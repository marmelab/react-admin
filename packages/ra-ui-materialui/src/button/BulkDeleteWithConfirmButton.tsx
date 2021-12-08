import * as React from 'react';
import { Fragment, useState, ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionDelete from '@mui/icons-material/Delete';
import inflection from 'inflection';
import { alpha, styled } from '@mui/material/styles';
import {
    CRUD_DELETE_MANY,
    MutationMode,
    useDeleteMany,
    useListContext,
    useNotify,
    useRefresh,
    useResourceContext,
    useTranslate,
    useUnselectAll,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';
import { BulkActionProps } from '../types';

export const BulkDeleteWithConfirmButton = (
    props: BulkDeleteWithConfirmButtonProps
) => {
    const {
        basePath,
        confirmTitle = 'ra.message.bulk_delete_title',
        confirmContent = 'ra.message.bulk_delete_content',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode = 'pessimistic',
        onClick,
        ...rest
    } = props;
    const { selectedIds } = useListContext(props);
    const [isOpen, setOpen] = useState(false);
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const refresh = useRefresh();
    const translate = useTranslate();
    const resource = useResourceContext(props);
    const [deleteMany, { loading }] = useDeleteMany(resource, selectedIds, {
        action: CRUD_DELETE_MANY,
        onSuccess: () => {
            refresh();
            notify('ra.notification.deleted', 'info', {
                smart_count: selectedIds.length,
            });
            unselectAll(resource);
        },
        onFailure: error => {
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                'warning',
                {
                    _:
                        typeof error === 'string'
                            ? error
                            : error && error.message
                            ? error.message
                            : undefined,
                }
            );
            setOpen(false);
        },
        mutationMode,
    });

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
                className={BulkDeleteWithConfirmButtonClasses.deleteButton}
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </StyledButton>
            <Confirm
                isOpen={isOpen}
                loading={loading}
                title={confirmTitle}
                content={confirmContent}
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
    basePath,
    classes,
    filterValues,
    label,
    ...rest
}: Omit<
    BulkDeleteWithConfirmButtonProps,
    'resource' | 'selectedIds' | 'icon' | 'mutationMode'
>) => rest;

export interface BulkDeleteWithConfirmButtonProps
    extends BulkActionProps,
        ButtonProps {
    confirmContent?: React.ReactNode;
    confirmTitle?: string;
    icon?: ReactElement;
    mutationMode: MutationMode;
}

const PREFIX = 'RaBulkDeleteWithConfirmButton';

export const BulkDeleteWithConfirmButtonClasses = {
    deleteButton: `${PREFIX}-deleteButton`,
};

const StyledButton = styled(Button, { name: PREFIX })(({ theme }) => ({
    [`&.${BulkDeleteWithConfirmButtonClasses.deleteButton}`]: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.12),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));

const defaultIcon = <ActionDelete />;

BulkDeleteWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
};
