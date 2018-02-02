import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';

import { changeListSelection } from '../../actions/listActions';

class BulkActionSelectItem extends React.Component {
    handleToggle = e => {
        const {
            changeListSelection,
            resource,
            ids,
            selectionMode,
        } = this.props;
        changeListSelection(resource, ids, e.target.checked, selectionMode);
    };
    render() {
        const {
            changeListSelection,
            resource,
            ids,
            selectionMode,
            ...props
        } = this.props;
        return (
            <Checkbox
                color="primary"
                onClick={e => e.stopPropagation()}
                onChange={this.handleToggle}
                {...props}
            />
        );
    }
}
BulkActionSelectItem.propTypes = {
    changeListSelection: PropTypes.func.isRequired,
    ids: PropTypes.any.isRequired,
    resource: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    selectionMode: PropTypes.oneOf(['single', 'page', 'bulk']).isRequired,
};

const enhance = compose(
    connect(null, {
        changeListSelection,
    })
);

export default enhance(BulkActionSelectItem);
