import * as React from 'react';
import { Fragment, useState, ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionUpdate from '@mui/icons-material/Update';
import inflection from 'inflection';
import { alpha, styled } from '@mui/material/styles';
import {
    useTranslate,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    CRUD_UPDATE_MANY,
    useResourceContext,
    MutationMode,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';
import { BulkActionProps } from '../types';

export const BulkUpdateWithConfirmButton = (
    props: BulkUpdateWithConfirmButtonProps
) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const translate = useTranslate();
    const unselectAll = useUnselectAll();
    const resource = useResourceContext(props);
    const [isOpen, setOpen] = useState(false);

    const {
        basePath,
        confirmTitle = 'ra.message.bulk_update_title',
        confirmContent = 'ra.message.bulk_update_content',
        data,
        icon = defaultIcon,
        label = 'ra.action.update',
        mutationMode = 'pessimistic',
        onClick,
        selectedIds,
        onSuccess = () => {
            refresh();
            notify('ra.notification.updated', 'info', {
                smart_count: selectedIds.length,
            });
            unselectAll(resource);
        },
        onFailure = error => {
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
        ...rest
    } = props;

    const [updateMany, { loading }] = useUpdateMany(
        resource,
        selectedIds,
        data,
        {
            action: CRUD_UPDATE_MANY,
            onSuccess,
            onFailure,
            mutationMode,
        }
    );

    const handleClick = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleUpdate = e => {
        updateMany();

        if (typeof onClick === 'function') {
            onClick(e);
        }
    };

    return (
        <Fragment>
            <StyledButton
                onClick={handleClick}
                label={label}
                className={BulkUpdateWithConfirmButtonClasses.updateButton}
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
                onConfirm={handleUpdate}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const sanitizeRestProps = ({
    basePath,
    filterValues,
    label,
    onSuccess,
    onFailure,
    ...rest
}: Omit<
    BulkUpdateWithConfirmButtonProps,
    'resource' | 'selectedIds' | 'icon' | 'data'
>) => rest;

export interface BulkUpdateWithConfirmButtonProps
    extends BulkActionProps,
        ButtonProps {
    confirmContent?: React.ReactNode;
    confirmTitle?: string;
    icon?: ReactElement;
    data: any;
    onSuccess?: () => void;
    onFailure?: (error: any) => void;
    mutationMode?: MutationMode;
}

BulkUpdateWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    icon: PropTypes.element,
    data: PropTypes.any.isRequired,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
};

const PREFIX = 'RaBulkUpdateWithConfirmButton';

export const BulkUpdateWithConfirmButtonClasses = {
    updateButton: `${PREFIX}-updateButton`,
};

const StyledButton = styled(Button, { name: PREFIX })(({ theme }) => ({
    [`&.${BulkUpdateWithConfirmButtonClasses.updateButton}`]: {
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

const defaultIcon = <ActionUpdate />;
