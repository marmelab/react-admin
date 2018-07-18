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
                    .then(csv => {
                        const fakeLink = document.createElement('a');
                        document.body.appendChild(fakeLink);

                        const blobName = `${resource}.csv`;

                        if (
                            window.navigator &&
                            window.navigator.msSaveOrOpenBlob
                        ) {
                            // Manage IE11+ & Edge
                            var blob = new Blob([csv], { type: 'text/csv' });
                            window.navigator.msSaveOrOpenBlob(blob, blobName);
                        } else {
                            fakeLink.setAttribute(
                                'href',
                                'data:application/octet-stream;charset=utf-8,' +
                                    encodeURIComponent(csv)
                            );
                            fakeLink.setAttribute('download', blobName);
                            fakeLink.click();
                        }
                    })
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
    exporter: x => new Promise(resolve => resolve(x)),
    maxResults: 1000,
};

export default connect(
    null,
    { crudGetAll }
)(ExportButton);
