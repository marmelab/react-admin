import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MenuList } from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Button from './Button';

const styles = {
    root: {
        display: 'flex',
    },
    popperClose: {
        pointerEvents: 'none',
    },
};

class MenuButton extends React.Component {
    state = {
        open: false,
    };
    handleClick = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const {
            children,
            classes,
            button: ButtonComponent = Button,
            ...rest
        } = this.props;
        const { open } = this.state;

        return (
            <Manager>
                <Target>
                    <ButtonComponent
                        aria-owns={this.state.open ? 'menu-list' : null}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        {...rest}
                    />
                </Target>
                <Popper
                    placement="bottom-start"
                    eventsEnabled={open}
                    className={classNames({ [classes.popperClose]: !open })}
                >
                    <ClickAwayListener onClickAway={this.handleClose}>
                        <Grow
                            in={open}
                            id="menu-list"
                            style={{ transformOrigin: '0 0 0' }}
                        >
                            <Paper>
                                <MenuList role="menu">
                                    {React.Children
                                        .toArray(children)
                                        .map((child, index) =>
                                            React.cloneElement(child, {
                                                key: `menu-item-${index + 1}`,
                                                onClick: this.handleClose,
                                            })
                                        )}
                                </MenuList>
                            </Paper>
                        </Grow>
                    </ClickAwayListener>
                </Popper>
            </Manager>
        );
    }
}

MenuButton.propTypes = {
    classes: PropTypes.object.isRequired,
    button: PropTypes.func,
};

export default withStyles(styles)(MenuButton);
