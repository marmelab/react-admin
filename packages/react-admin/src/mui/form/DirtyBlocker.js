import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../modals/actions';

class DirtyBlocker extends React.Component {
    componentDidMount = () => {
        const { history } = this.props;
        this.unblock = history.block(nextLocation => {
            if (this.props.dirty) {
                this.props
                    .pushModal('confirm_yes_no', {
                        message: 'ra.message.discard_changes',
                    })
                    .then(answer => {
                        if (answer) {
                            this.unblock();
                            history.push(nextLocation);
                        }
                    });
            }

            return !this.props.dirty;
        });
    };

    componentWillUnmount = () => {
        this.unblock();
    };
    render() {
        return null;
    }
}
DirtyBlocker.propTypes = {
    pushModal: PropTypes.func.isRequired,
    dirty: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
};
const enhance = compose(withRouter, connect(null, actions));

export default enhance(DirtyBlocker);
