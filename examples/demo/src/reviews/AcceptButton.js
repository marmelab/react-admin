import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import ThumbUp from '@material-ui/icons/ThumbUp';
import { translate } from 'react-admin';
import compose from 'recompose/compose';
import { reviewApprove as reviewApproveAction } from './reviewActions';

class AcceptButton extends Component {
    handleApprove = () => {
        const { reviewApprove, record, comment } = this.props;
        reviewApprove(record.id, { ...record, comment });
    };

    render() {
        const { record, translate } = this.props;
        return record && record.status === 'pending' ? (
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={this.handleApprove}
            >
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
    comment: PropTypes.string,
    reviewApprove: PropTypes.func,
    translate: PropTypes.func,
};

const selector = formValueSelector('record-form');

const enhance = compose(
    translate,
    connect(
        state => ({
            comment: selector(state, 'comment'),
        }),
        {
            reviewApprove: reviewApproveAction,
        }
    )
);

export default enhance(AcceptButton);
