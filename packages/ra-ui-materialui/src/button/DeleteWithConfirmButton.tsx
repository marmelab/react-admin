import React, { Fragment, ReactEventHandler, ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import ActionDelete from '@mui/icons-material/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import { UseMutationOptions } from 'react-query';
import {
    MutationMode,
    RaRecord,
    DeleteParams,
    RedirectionSideEffect,
    useDeleteWithConfirmController,
    useResourceContext,
    useTranslate,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';

export const DeleteWithConfirmButton = <RaRecordType extends RaRecord = any>(
    props: DeleteWithConfirmButtonProps<RaRecordType>
) => {
    const {
        basePath,
        className,
        confirmTitle = 'ra.message.delete_title',
        confirmContent = 'ra.message.delete_content',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode = 'pessimistic',
        onClick,
        record,
        redirect = 'list',
        mutationOptions,
        ...rest
    } = props;
    const translate = useTranslate();

    const resource = useResourceContext(props);

    const {
        open,
        isLoading,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    } = useDeleteWithConfirmController({
        record,
        redirect,
        basePath,
        mutationMode,
        onClick,
        mutationOptions,
        resource,
    });

    return (
        <Fragment>
            <StyledButton
                onClick={handleDialogOpen}
                label={label}
                className={classnames(
                    'ra-delete-button',
                    DeleteWithConfirmButtonClasses.deleteButton,
                    className
                )}
                key="button"
                {...rest}
            >
                {icon}
            </StyledButton>
            <Confirm
                isOpen={open}
                loading={isLoading}
                title={confirmTitle}
                content={confirmContent}
                translateOptions={{
                    name: translate(`resources.${resource}.forcedCaseName`, {
                        smart_count: 1,
                        _: inflection.humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: 1,
                                _: inflection.singularize(resource),
                            }),
                            true
                        ),
                    }),
                    id: record.id,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const defaultIcon = <ActionDelete />;

export interface DeleteWithConfirmButtonProps<
    RaRecordType extends RaRecord = any
> extends Omit<ButtonProps, 'record'> {
    basePath?: string;
    className?: string;
    confirmTitle?: string;
    confirmContent?: React.ReactNode;
    icon?: ReactElement;
    label?: string;
    mutationMode?: MutationMode;
    onClick?: ReactEventHandler<any>;
    record?: RaRecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
    // May be injected by Toolbar - sanitized in Button
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    mutationOptions?: UseMutationOptions<
        RaRecordType,
        unknown,
        DeleteParams<RaRecordType>
    >;
}

DeleteWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};

const PREFIX = 'RaDeleteWithConfirmButton';

export const DeleteWithConfirmButtonClasses = {
    deleteButton: `${PREFIX}-deleteButton`,
};

const StyledButton = styled(Button, { name: PREFIX })(({ theme }) => ({
    [`&.${DeleteWithConfirmButtonClasses.deleteButton}`]: {
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
