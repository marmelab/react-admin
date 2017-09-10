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
    resource,
    selection,
    crudDelete,
    afterDelete,
}) =>
    <FlatButton
        secondary
        label={label && translate(label)}
        icon={<DeleteIcon />}
        style={{ overflow: 'inherit' }}
        disabled={!selection.length}
        onClick={() => {
          selection.map(resourceId => crudDelete(resource, resourceId));
          afterDelete(resource);
        }}
    />;

BulkDeleteButton.propTypes = {
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};


const mapStateToProps = (state, props) => {
  const resourceState = state.admin.resources[props.resource];
  return {
    selection: resourceState.list.selection,
  };
}

const enhance = compose(
    connect(mapStateToProps, { crudDelete, afterDelete: unsetResourcesSelection }),
    translate
);

export default enhance(BulkDeleteButton);
