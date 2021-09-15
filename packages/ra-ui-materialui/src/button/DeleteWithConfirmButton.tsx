import React, {
    Fragment,
    ReactEventHandler,
    ReactElement,
    SyntheticEvent,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
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

import Confirm from '../layout/Confirm';
import Button, { ButtonProps } from './Button';

export const DeleteWithConfirmButton = (
    props: DeleteWithConfirmButtonProps
) => {
    const {
        basePath,
        classes: classesOverride,
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
    const classes = useStyles(props);
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
            <Button
                onClick={handleDialogOpen}
                label={label}
                className={classnames(
                    'ra-delete-button',
                    classes.deleteButton,
                    className
                )}
                key="button"
                {...rest}
            >
                {icon}
            </Button>
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

const useStyles = makeStyles(
    theme => ({
        deleteButton: {
            color: theme.palette.error.main,
            '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.12),
                // Reset on mouse devices
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
        },
    }),
    { name: 'RaDeleteWithConfirmButton' }
);

interface Props {
    basePath?: string;
    classes?: object;
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
    classes: PropTypes.object,
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
