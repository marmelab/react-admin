import React, {
    cloneElement,
    Children,
    isValidElement,
    useState,
    useCallback,
    useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';

import Button from '../button/Button';
import BulkDeleteAction from './BulkDeleteAction';

const useStyles = makeStyles(theme => ({
    bulkActionsButton: {
        opacity: 1,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        '&.fade-enter': {
            opacity: 0,
        },
        '&.fade-enter-done': {
            opacity: 1,
        },
        '&.fade-exit': {
            opacity: 0,
        },
        '&.fade-exit-done': {
            opacity: 0,
        },
    },
    icon: {
        marginRight: theme.spacing(1),
    },
}));

const timeoutDurations = {
    enter: 0,
    exit: 300,
};

const sanitizeRestProps = ({
    basePath,
    filterValues,
    resource,
    onUnselectItems,
    ...rest
}) => rest;

/**
 * @deprecated pass a Fragment with button children as bulkActionButtons props instead
 */
const BulkActions = ({
    basePath,
    children,
    className,
    filterValues,
    label,
    resource,
    selectedIds,
    translate,
    ...rest
}) => {
    const [isOpen, setOpen] = useState(false);
    const [activeAction, setActiveAction] = useState(null);
    const [anchorElement, setAnchorElement] = useState(null);
    const styles = useStyles({});
    const translate = useTranslate();

    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(
                '<BulkActions> is deprecated. Use the bulkActionButtons prop instead.'
            );
        }
    });

    const storeButtonRef = useCallback(node => {
        setAnchorElement(node);
    });

    const handleClick = useCallback(() => {
        setOpen(true);
    });

    const handleClose = useCallback(() => {
        setOpen(false);
    });

    const handleLaunchAction = useCallback(action => {
        setActiveAction(action);
        setOpen(false);
    });

    const handleExitAction = useCallback(() => {
        setActiveAction(null);
    });

    return (
        <CSSTransition
            in={selectedIds.length > 0}
            timeout={timeoutDurations}
            mountOnEnter
            unmountOnExit
            classNames="fade"
        >
            <div className={styles.bulkActionsButton}>
                <Button
                    buttonRef={storeButtonRef}
                    className={classnames('bulk-actions-button', className)}
                    alignIcon="left"
                    aria-owns={isOpen ? 'bulk-actions-menu' : null}
                    aria-haspopup="true"
                    onClick={handleClick}
                    {...sanitizeRestProps(rest)}
                    label={translate(label, {
                        _: label,
                        smart_count: selectedIds.length,
                    })}
                >
                    <FilterNoneIcon className={styles.icon} />
                </Button>
                <Menu
                    id="bulk-actions-menu"
                    anchorEl={anchorElement}
                    onClose={handleClose}
                    open={isOpen}
                >
                    {Children.map(children, (child, index) =>
                        isValidElement(child) ? (
                            <MenuItem
                                key={index}
                                className={classnames(
                                    'bulk-actions-menu-item',
                                    child.props.className
                                )}
                                onClick={() => handleLaunchAction(index)}
                                {...sanitizeRestProps(rest)}
                            >
                                {translate(child.props.label)}
                            </MenuItem>
                        ) : null
                    )}
                </Menu>
                {Children.map(children, (child, index) =>
                    isValidElement(child) && activeAction === index
                        ? cloneElement(child, {
                              basePath,
                              filterValues,
                              onExit: handleExitAction,
                              resource,
                              selectedIds,
                          })
                        : null
                )}
            </div>
        </CSSTransition>
    );
};

BulkActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    filterValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    translate: PropTypes.func.isRequired,
};

BulkActions.defaultProps = {
    children: <BulkDeleteAction />,
    label: 'ra.action.bulk_actions',
    selectedIds: [],
};

export default BulkActions;
