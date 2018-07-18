import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GetApp from '@material-ui/icons/GetApp';
import { crudGetAll } from 'ra-core';
import Papa from 'papaparse/papaparse.min';

import Button from './Button';

const sanitizeRestProps = ({
    basePath,
    config,
    crudGetAll,
    exporter,
    filter,
    maxResults,
    resource,
    sort,
    ...rest
}) => rest;

const downloadCSV = (csv, filename) => {
    const fakeLink = document.createElement('a');
    fakeLink.style.display = 'none';
    document.body.appendChild(fakeLink);

    const blobName = `${filename}.csv`;
    const blob = new Blob([csv], { type: 'text/csv' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Manage IE11+ & Edge
        window.navigator.msSaveOrOpenBlob(blob, blobName);
    } else {
        fakeLink.setAttribute('href', URL.createObjectURL(blob));
        fakeLink.setAttribute('download', blobName);
        fakeLink.click();
    }
};

class ExportButton extends Component {
    handleClick = () => {
        const {
            config,
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
            ({ payload: { data } }) =>
                exporter(data)
                    .then(data => Papa.unparse(data, config))
                    .then(csv => downloadCSV(csv, resource))
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
    config: PropTypes.object,
    crudGetAll: PropTypes.func.isRequired,
    exporter: PropTypes.func.isRequired, // must return a Promise
    filter: PropTypes.object,
    label: PropTypes.string,
    maxResults: PropTypes.number.isRequired,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.object,
};

ExportButton.defaultProps = {
    exporter: x => Promise.resolve(x),
    maxResults: 1000,
};

export default connect(
    null,
    { crudGetAll }
)(ExportButton);
