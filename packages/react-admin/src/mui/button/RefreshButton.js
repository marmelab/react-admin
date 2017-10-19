import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import NavigationRefresh from 'material-ui-icons/Refresh';
import translate from '../../i18n/translate';
import { refreshView as refreshViewAction } from '../../actions/uiActions';

class RefreshButton extends Component {
    static propTypes = {
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
        const { label, translate } = this.props;

        return (
            <Button color="primary" onClick={this.handleClick}>
                <NavigationRefresh />
                {label && translate(label)}
            </Button>
        );
    }
}

const enhance = compose(
    connect(null, { refreshView: refreshViewAction }),
    translate
);

export default enhance(RefreshButton);
