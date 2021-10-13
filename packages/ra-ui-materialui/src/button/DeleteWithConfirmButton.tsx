import React, {
    Fragment,
    ReactEventHandler,
    ReactElement,
    SyntheticEvent,
} from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import ActionDelete from '@mui/icons-material/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import {
    getMutationMode,
    MutationMode,
    OnSuccess,
    OnFailure,
    Record,
    RedirectionSideEffect,
    useDeleteWithConfirmController,
    useResourceContext,
    useTranslate,
} from 'ra-core';

import { Confirm } from '../layout';
import { Button, ButtonProps } from './Button';

export const DeleteWithConfirmButton = (
    props: DeleteWithConfirmButtonProps
) => {
    const {
        basePath,
        className,
        confirmTitle = 'ra.message.delete_title',
        confirmContent = 'ra.message.delete_content',
        icon = defaultIcon,
        label = 'ra.action.delete',
        mutationMode,
        onClick,
        record,
        redirect = 'list',
        onSuccess,
        onFailure,
        undoable,
        ...rest
    } = props;
    const translate = useTranslate();

    const resource = useResourceContext(props);
    const mode = getMutationMode(mutationMode, undoable);

    const {
        open,
        loading,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    } = useDeleteWithConfirmController({
        record,
        redirect,
        basePath,
        mutationMode: mutationMode || mode,
        onClick,
        onSuccess,
        onFailure,
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
                loading={loading}
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

interface Props {
    basePath?: string;
    className?: string;
    confirmTitle?: string;
    confirmContent?: React.ReactNode;
    icon?: ReactElement;
    label?: string;
    mutationMode?: MutationMode;
    onClick?: ReactEventHandler<any>;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    // May be injected by Toolbar - sanitized in Button
    handleSubmit?: (event?: SyntheticEvent<HTMLFormElement>) => Promise<Object>;
    handleSubmitWithRedirect?: (redirect?: RedirectionSideEffect) => void;
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    /** @deprecated use mutationMode: undoable instead */
    undoable?: boolean;
}

export type DeleteWithConfirmButtonProps = Props & ButtonProps;

DeleteWithConfirmButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    undoable: PropTypes.bool,
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
