import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import NavigationRefresh from 'material-ui-icons/Refresh';
import { withStyles } from 'material-ui/styles';

import translate from '../../i18n/translate';
import { refreshView as refreshViewAction } from '../../actions/uiActions';
import Responsive from '../layout/Responsive';

const styles = {
    label: {
        marginLeft: '0.5em',
    },
};

const sanitizeRestProps = ({
    className,
    classes,
    label,
    translate,
    refreshView,
    locale,
    ...rest
}) => rest;

class RefreshButton extends Component {
    static propTypes = {
        className: PropTypes.string,
        classes: PropTypes.object,
        label: PropTypes.string,
        translate: PropTypes.func.isRequired,
        refreshView: PropTypes.func.isRequired,
    };

    static defaultProps = {
        label: 'ra.action.refresh',
    };

    handleClick = event => {
        event.preventDefault();
        this.props.refreshView();
    };

    render() {
        const {
            className,
            classes = {},
            label,
            translate,
            refreshView,
            ...rest
        } = this.props;

        return (
            <Button
                className={className}
                color="primary"
                onClick={this.handleClick}
                {...sanitizeRestProps(rest)}
            >
                <NavigationRefresh />
                <Responsive
                    small={<span />}
                    medium={
                        <span className={classes.label}>
                            {label && translate(label)}
                        </span>
                    }
                />
            </Button>
        );
    }
}

const enhance = compose(
    translate,
    connect(null, { refreshView: refreshViewAction }),
    withStyles(styles)
);

export default enhance(RefreshButton);
