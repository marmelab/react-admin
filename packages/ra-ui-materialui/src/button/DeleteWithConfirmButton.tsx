import React, { Fragment, ReactEventHandler, ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import inflection from 'inflection';
import { UseMutationOptions } from 'react-query';
import {
    MutationMode,
    RaRecord,
    DeleteParams,
    useDeleteWithConfirmController,
    useRecordContext,
    useResourceContext,
    useTranslate,
    RedirectionSideEffect,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';

export const DeleteWithConfirmButton = <RecordType extends RaRecord = any>(
    props: DeleteWithConfirmButtonProps<RecordType>
) => {
    const {
        className,
        confirmTitle = 'ra.message.delete_title',
        confirmContent = 'ra.message.delete_content',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode = 'pessimistic',
        onClick,
        redirect = 'list',
        translateOptions = {},
        mutationOptions,
        color = 'error',
        ...rest
    } = props;
    const translate = useTranslate();
    const record = useRecordContext(props);
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
        mutationMode,
        onClick,
        mutationOptions,
        resource,
    });

    return (
        <Fragment>
            <Button
                onClick={handleDialogOpen}
                label={label}
                className={clsx('ra-delete-button', className)}
                key="button"
                color={color}
                {...rest}
            >
                {icon}
            </Button>
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
                    ...translateOptions,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

const defaultIcon = <ActionDelete />;

export interface DeleteWithConfirmButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> extends ButtonProps {
    confirmTitle?: React.ReactNode;
    confirmContent?: React.ReactNode;
    icon?: ReactElement;
    mutationMode?: MutationMode;
    onClick?: ReactEventHandler<any>;
    // May be injected by Toolbar - sanitized in Button
    translateOptions?: object;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    record?: RecordType;
    redirect?: RedirectionSideEffect;
    resource?: string;
}

DeleteWithConfirmButton.propTypes = {
    className: PropTypes.string,
    confirmTitle: PropTypes.node,
    confirmContent: PropTypes.node,
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
    translateOptions: PropTypes.object,
};
