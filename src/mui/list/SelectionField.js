import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';

class SelectionField extends Component {
    constructor(props) {
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
    }
    handleCheck(event, isInputChecked) {
        const { onSelectionChange, resource, id } = this.props;
        onSelectionChange(resource, id, isInputChecked);
    }
    render() {
        return <Checkbox onCheck={this.handleCheck} />;
    }
}

SelectionField.propTypes = {
    onSelectionChange: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    id: PropTypes.any,
};

export default SelectionField;
