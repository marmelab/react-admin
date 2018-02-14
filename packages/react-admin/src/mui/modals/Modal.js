import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import shouldUpdate from 'recompose/shouldUpdate';

import * as promisingModalsActions from './actions';
import translate from '../../i18n/translate';

class Modal extends React.Component {
    render() {
        const {
            type,
            showType,
            showProps,
            render,
            translate,
            ...connectedPromisingModalsActions
        } = this.props;

        return render({
            ...connectedPromisingModalsActions,
            open: type === showType,
            options: showProps,
            translate,
        });
    }
}
Modal.propTypes = {
    type: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
    showType: PropTypes.string,
    showProps: PropTypes.object,
    translate: PropTypes.func.isRequired,
};
const mapState = state => ({
    showType: state.admin.modals.types[0],
    showProps: state.admin.modals.props[0],
});

const enhance = compose(
    connect(mapState, promisingModalsActions),
    shouldUpdate((props, nextProps) => props.showType !== nextProps.showType),
    translate
);

export default enhance(Modal);
