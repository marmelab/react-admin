import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import translate from '../../i18n/translate';
import { refreshView as refreshViewAction } from '../../actions/uiActions';

class RefreshButton extends Component {
    static propTypes = {
        label: PropTypes.string,
        translate: PropTypes.func.isRequired,
        refreshView: PropTypes.func.isRequired,
    };

    static defaultProps = {
        label: 'aor.action.refresh',
    };

    handleClick = event => {
        event.preventDefault();
        this.props.refreshView();
    };

    render() {
        const { label, translate } = this.props;

        return (
            <FlatButton
                primary
                label={label && translate(label)}
                onClick={this.handleClick}
                icon={<NavigationRefresh />}
            />
        );
    }
}

const enhance = compose(
    connect(null, { refreshView: refreshViewAction }),
    translate
);

export default enhance(RefreshButton);
