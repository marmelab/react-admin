import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import FlatButton from 'material-ui/FlatButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import translate from '../../i18n/translate';
import { crudDelete } from '../../actions/dataActions';
import { unsetResourcesSelection } from '../../actions/bulkActions';

const BulkDeleteButton = ({
    label = 'aor.action.delete',
    translate,
    selection,
    onDelete,
}) => (
    <FlatButton
        secondary
        label={label && translate(label)}
        icon={<DeleteIcon />}
        style={{ overflow: 'inherit' }}
        disabled={!selection.length}
        onClick={onDelete}
    />
);

BulkDeleteButton.propTypes = {
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selection: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => {
    const resourceState = state.admin.resources[props.resource];
    return {
        selection: resourceState.list.selection,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onDelete(resource, selection) {
            selection.map(resourceId =>
                dispatch(crudDelete(resource, resourceId))
            );
            dispatch(unsetResourcesSelection(resource));
        },
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { selection } = stateProps;
    const { resource } = ownProps;
    return Object.assign({}, ownProps, stateProps, {
        onDelete: dispatchProps.onDelete.bind(null, resource, selection),
    });
};

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps, mergeProps),
    translate
);

export default enhance(BulkDeleteButton);
