import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GetApp from '@material-ui/icons/GetApp';
import { crudGetAll } from 'ra-core';

import Button from './Button';

const sanitizeRestProps = ({
    basePath,
    crudGetAll,
    exporter,
    filter,
    maxResults,
    resource,
    sort,
    ...rest
}) => rest;

class ExportButton extends Component {
    handleClick = () => {
        const {
            crudGetAll,
            resource,
            sort,
            filter,
            maxResults,
            exporter,
        } = this.props;
        crudGetAll(
            resource,
            sort,
            filter,
            maxResults,
            ({ payload: { data } }) => exporter(data).then(console.log(data))
        );
    };

    render() {
        const { label = 'ra.action.export', ...rest } = this.props;

        return (
            <Button
                onClick={this.handleClick}
                label={label}
                {...sanitizeRestProps(rest)}
            >
                <GetApp />
            </Button>
        );
    }
}

ExportButton.propTypes = {
    basePath: PropTypes.string,
    crudGetAll: PropTypes.func.isRequired,
    exporter: PropTypes.func.isRequired, // must return a Promise
    filter: PropTypes.object,
    label: PropTypes.string,
    maxResults: PropTypes.number.isRequired,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.object,
};

ExportButton.defaultProps = {
    exporter: x => new Promise(resolve => resolve(x)),
    maxResults: 1000,
};

export default connect(
    null,
    { crudGetAll }
)(ExportButton);
