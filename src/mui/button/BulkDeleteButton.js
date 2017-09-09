import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import FlatButton from 'material-ui/FlatButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import translate from '../../i18n/translate';

const BulkDeleteButton = ({
    label = 'aor.action.delete',
    translate,
    selection,
}) =>
    <FlatButton
        secondary
        label={label && translate(label)}
        icon={<DeleteIcon />}
        style={{ overflow: 'inherit' }}
        disabled={!selection.length}
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
    connect(mapStateToProps, null),
    translate
);

export default enhance(BulkDeleteButton);
