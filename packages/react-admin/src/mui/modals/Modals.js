import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import * as actions from './actions';

class Modals extends React.Component {
    render() {
        return this.props.render(this.props);
    }
}

Modals.propTypes = {
    render: PropTypes.func.isRequired,
};

const enhance = compose(connect(null, actions));

export default enhance(Modals);
