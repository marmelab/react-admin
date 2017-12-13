import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import NavigationRefresh from 'material-ui-icons/Refresh';
import { withStyles } from 'material-ui/styles';

import translate from '../../i18n/translate';
import { refreshView as refreshViewAction } from '../../actions/uiActions';

const styles = {
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
};

class RefreshButton extends Component {
    static propTypes = {
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
        const { classes = {}, label, translate } = this.props;

        return (
            <Button color="primary" onClick={this.handleClick}>
                <NavigationRefresh className={classes.iconPaddingStyle} />
                {label && translate(label)}
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
