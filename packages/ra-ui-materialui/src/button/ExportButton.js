import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GetApp from '@material-ui/icons/GetApp';
import { crudGetAll, downloadCSV, CRUD_GET_MANY, GET_MANY } from 'ra-core';
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

/**
 * Helper function for calling the data provider with GET_MANY
 * via redux and saga, and getting a Promise in return
 *
 * @example
 *     fetchRelatedRecords(records, 'post_id', 'posts').then(posts =>
 *          posts.map(record => ({
 *              ...record,
 *              post_title: posts[record.post_id].title,
 *          }));
 */
const fetchRelatedRecords = dispatch => (data, field, resource) =>
    new Promise((resolve, reject) => {
        const sanitizedData = data
            .filter(record => record[field])
            .map(record => record[field]);

        // find unique keys
        const ids = [...new Set(sanitizedData)];

        dispatch({
            type: CRUD_GET_MANY,
            payload: { ids },
            meta: {
                resource,
                fetch: GET_MANY,
                onSuccess: {
                    callback: ({ payload: { data } }) => {
                        resolve(
                            data.reduce((acc, post) => {
                                acc[post.id] = post;
                                return acc;
                            }, {})
                        );
                    },
                },
                onFailure: {
                    notification: {
                        body: 'ra.notification.http_error',
                        level: 'warning',
                    },
                    callback: ({ error }) => reject(error),
                },
            },
        });
    });

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
                              fetchRelatedRecords(dispatch),
                              dispatch
                          )
                        : downloadCSV(convertToCSV(data), resource)
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
