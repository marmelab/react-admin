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
 * Extracts, aggregates and deduplicates the ids of related records
 *
 * @example
 *     const books = [
 *         { id: 1, author_id: 123, title: 'Pride and Prejudice' },
 *         { id: 2, author_id: 123, title: 'Sense and Sensibility' },
 *         { id: 3, author_id: 456, title: 'War and Peace' },
 *     ];
 *     getRelatedIds(books, 'author_id'); => [123, 456]
 *
 * @example
 *     const books = [
 *         { id: 1, tag_ids: [1, 2], title: 'Pride and Prejudice' },
 *         { id: 2, tag_ids: [2, 3], title: 'Sense and Sensibility' },
 *         { id: 3, tag_ids: [4], title: 'War and Peace' },
 *     ];
 *     getRelatedIds(records, 'tag_ids'); => [1, 2, 3, 4]
 *
 * @param {Object[]} records An array of records
 * @param {string} field the identifier of the record field to use
 */
export const getRelatedIds = (records, field) =>
    Array.from(
        new Set(
            records
                .filter(record => record[field] != null)
                .map(record => record[field])
                .reduce((ids, value) => ids.concat(value), [])
        )
    );

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
        dispatch({
            type: CRUD_GET_MANY,
            payload: { ids: getRelatedIds(data, field) },
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
        icon: PropTypes.element,
    };

    static defaultProps = {
      label: 'ra.action.export',
      maxResults: 1000,
      icon: <GetApp />,
    };

    handleClick = () => {
        const {
            dispatch,
            exporter,
            filter,
            maxResults,
            sort,
            resource,
            onClick,
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

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    render() {
        const { label, icon, ...rest } = this.props;

        return (
            <Button
                onClick={this.handleClick}
                label={label}
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </Button>
        );
    }
}

export default connect()(ExportButton); // inject redux dispatch
