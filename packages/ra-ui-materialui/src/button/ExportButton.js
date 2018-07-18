import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GetApp from '@material-ui/icons/GetApp';
import { crudGetAll } from 'ra-core';
import { unparse as convertToCSV } from 'papaparse/papaparse.min';

import Button from './Button';

const sanitizeRestProps = ({
    basePath,
    crudGetAll,
    dispatch,
    exporter,
    filter,
    maxResults,
    resource,
    sort,
    ...rest
}) => rest;

const downloadCSV = resource => (csv, filename = `${resource}.csv`) => {
    const fakeLink = document.createElement('a');
    fakeLink.style.display = 'none';
    document.body.appendChild(fakeLink);
    const blob = new Blob([csv], { type: 'text/csv' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Manage IE11+ & Edge
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        fakeLink.setAttribute('href', URL.createObjectURL(blob));
        fakeLink.setAttribute('download', filename);
        fakeLink.click();
    }
};

class ExportButton extends Component {
    static propTypes = {
        basePath: PropTypes.string,
        dispatch: PropTypes.func,
        exporter: PropTypes.func,
        filter: PropTypes.object,
        label: PropTypes.string,
        maxResults: PropTypes.number.isRequired,
        resource: PropTypes.string.isRequired,
        sort: PropTypes.object,
    };

    handleClick = () => {
        const {
            dispatch,
            exporter,
            filter,
            maxResults,
            sort,
            resource,
        } = this.props;
        dispatch(
            crudGetAll(
                resource,
                sort,
                filter,
                maxResults,
                ({ payload: { data } }) =>
                    exporter
                        ? exporter(
                              data,
                              convertToCSV,
                              downloadCSV(resource),
                              dispatch
                          )
                        : downloadCSV(resource)(convertToCSV(data))
            )
        );
    };

    render() {
        const { label, ...rest } = this.props;

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

ExportButton.defaultProps = {
    label: 'ra.action.export',
    maxResults: 1000,
};

export default connect()(ExportButton); // inject redux dispatch
