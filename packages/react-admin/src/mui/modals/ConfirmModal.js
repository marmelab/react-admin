import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import Modal from './Modal';
import Responsive from '../layout/Responsive';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ConfirmDialog extends React.Component {
    handleClose = value => () => {
        this.props.popModal(value);
    };
    handleEntered = () => {
        this.autoFocusItem && this.autoFocusItem.focus();
    };

    render() {
        let {
            translate,
            open,
            title,
            titleArgs,
            message,
            messageArgs,
            actions,
            fullScreen = false,
            allowEscape = true,
            escapeValue = null,
        } = this.props;

        return (
            <Dialog
                open={open}
                transition={Transition}
                fullScreen={fullScreen}
                disableBackdropClick={!allowEscape}
                disableEscapeKeyDown={!allowEscape}
                onEntered={this.handleEntered}
                onClose={this.handleClose(escapeValue)}
            >
                <DialogTitle>{translate(title, titleArgs)}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {translate(message, messageArgs)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {actions.map(
                        (
                            { label, labelArgs, value, autoFocus, ...other },
                            index
                        ) => {
                            return (
                                <Button
                                    key={index}
                                    onClick={this.handleClose(value)}
                                    buttonRef={button =>
                                        button &&
                                        autoFocus &&
                                        (this.autoFocusItem = button)}
                                    {...other}
                                >
                                    {translate(label, labelArgs)}
                                </Button>
                            );
                        }
                    )}
                </DialogActions>
            </Dialog>
        );
    }
}

ConfirmDialog.propTypes = {
    allowEscape: PropTypes.bool,
    title: PropTypes.string.isRequired,
    titleArgs: PropTypes.object,
    message: PropTypes.string.isRequired,
    messageArgs: PropTypes.object,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            labelArgs: PropTypes.object,
            value: PropTypes.any,
        })
    ).isRequired,
    translate: PropTypes.func.isRequired,
    fullScreen: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    escapeValue: PropTypes.any,
    popModal: PropTypes.func,
};

class ConfirmModal extends React.Component {
    render() {
        const { type, ...defaultProps } = this.props;
        return (
            <Modal
                type={type}
                render={({
                    options,
                    translate,
                    open,
                    ...promisingModalsActions
                }) => {
                    return (
                        <Responsive
                            small={
                                <ConfirmDialog
                                    fullScreen
                                    {...defaultProps}
                                    {...options}
                                    {...promisingModalsActions}
                                    translate={translate}
                                    open={open}
                                />
                            }
                            medium={
                                <ConfirmDialog
                                    {...defaultProps}
                                    {...options}
                                    {...promisingModalsActions}
                                    translate={translate}
                                    open={open}
                                />
                            }
                        />
                    );
                }}
            />
        );
    }
}

ConfirmModal.propTypes = {
    allowEscape: PropTypes.bool,
    escapeValue: PropTypes.any,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleArgs: PropTypes.object,
    message: PropTypes.string.isRequired,
    messageArgs: PropTypes.object,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            labelArgs: PropTypes.object,
            value: PropTypes.any,
        })
    ).isRequired,
};

export default ConfirmModal;
