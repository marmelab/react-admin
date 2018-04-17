import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import ThumbUp from '@material-ui/icons/ThumbUp';
import { translate } from 'react-admin';
import compose from 'recompose/compose';
import { reviewApprove as reviewApproveAction } from './reviewActions';

class AcceptButton extends Component {
    handleApprove = () => {
        const { reviewApprove, record } = this.props;
        reviewApprove(record.id, record);
    };

    render() {
        const { record, translate } = this.props;
        return record && record.status === 'pending' ? (
            <Button color="primary" onClick={this.handleApprove}>
                <ThumbUp
                    color="primary"
                    style={{ paddingRight: '0.5em', color: 'green' }}
                />
                {translate('resources.reviews.action.accept')}
            </Button>
        ) : (
            <span />
        );
    }
}

AcceptButton.propTypes = {
    record: PropTypes.object,
    reviewApprove: PropTypes.func,
    translate: PropTypes.func,
};

const enhance = compose(
    translate,
    connect(null, {
        reviewApprove: reviewApproveAction,
    })
);

export default enhance(AcceptButton);
