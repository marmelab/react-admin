import React, { useCallback, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/GetApp';
import { ButtonProps } from '@material-ui/core/Button';
import {
    downloadCSV,
    useDataProvider,
    useNotify,
    Sort,
    DataProvider,
} from 'ra-core';
import jsonExport from 'jsonexport/dist';

import Button from './Button';

const sanitizeRestProps = ({ basePath, ...rest }: any) => rest;

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
const fetchRelatedRecords = dataProvider => (data, field, resource) =>
    dataProvider
        .getMany(resource, { ids: getRelatedIds(data, field) })
        .then(({ data }) =>
            data.reduce((acc, post) => {
                acc[post.id] = post;
                return acc;
            }, {})
        );

const DefaultIcon = <DownloadIcon />;
const defaultFilter = {};

interface Props {
    exporter?: (
        data: any,
        fetchRelatedRecords: (
            data: any,
            field: string,
            resource: string
        ) => Promise<any>,
        dataProvider: DataProvider
    ) => Promise<void>;
    sort: Sort;
    filter?: any;
    maxResults: number;
    resource: string;
    onClick?: (e: Event) => void;
    label: string;
    icon?: JSX.Element;
    basePath: string;
}

const ExportButton: FunctionComponent<Props & ButtonProps> = ({
    exporter,
    sort,
    filter = defaultFilter,
    maxResults = 1000,
    resource,
    onClick,
    label = 'ra.action.export',
    icon = DefaultIcon,
    ...rest
}) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const handleClick = useCallback(
        event => {
            dataProvider
                .getList(resource, {
                    sort,
                    filter,
                    pagination: { page: 1, perPage: maxResults },
                })
                .then(({ data }) =>
                    exporter
                        ? exporter(
                              data,
                              fetchRelatedRecords(dataProvider),
                              dataProvider
                          )
                        : jsonExport(data, (err, csv) =>
                              downloadCSV(csv, resource)
                          )
                )
                .catch(error => {
                    console.error(error);
                    notify('ra.notification.http_error', 'warning');
                });
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [
            dataProvider,
            exporter,
            filter,
            maxResults,
            notify,
            onClick,
            resource,
            sort,
        ]
    );

    return (
        <Button
            onClick={handleClick}
            label={label}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
};

ExportButton.propTypes = {
    basePath: PropTypes.string,
    exporter: PropTypes.func,
    filter: PropTypes.object,
    label: PropTypes.string,
    maxResults: PropTypes.number,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    icon: PropTypes.element,
};

export default ExportButton;
