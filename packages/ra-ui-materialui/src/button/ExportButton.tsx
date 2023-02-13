import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@mui/icons-material/GetApp';
import {
    fetchRelatedRecords,
    useDataProvider,
    useNotify,
    useListContext,
    SortPayload,
    Exporter,
    FilterPayload,
    useResourceContext,
} from 'ra-core';
import { Button, ButtonProps } from './Button';

export const ExportButton = (props: ExportButtonProps) => {
    const {
        maxResults = 1000,
        onClick,
        label = 'ra.action.export',
        icon = defaultIcon,
        exporter: customExporter,
        meta,
        ...rest
    } = props;
    const {
        filter,
        filterValues,
        sort,
        exporter: exporterFromContext,
        total,
    } = useListContext(props);
    const resource = useResourceContext(props);
    const exporter = customExporter || exporterFromContext;
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const handleClick = useCallback(
        event => {
            dataProvider
                .getList(resource, {
                    sort,
                    filter: filter
                        ? { ...filterValues, ...filter }
                        : filterValues,
                    pagination: { page: 1, perPage: maxResults },
                    meta,
                })
                .then(
                    ({ data }) =>
                        exporter &&
                        exporter(
                            data,
                            fetchRelatedRecords(dataProvider),
                            dataProvider,
                            resource
                        )
                )
                .catch(error => {
                    console.error(error);
                    notify('ra.notification.http_error', { type: 'error' });
                });
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [
            dataProvider,
            exporter,
            filter,
            filterValues,
            maxResults,
            notify,
            onClick,
            resource,
            sort,
            meta,
        ]
    );

    return (
        <Button
            onClick={handleClick}
            label={label}
            disabled={total === 0}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <DownloadIcon />;

const sanitizeRestProps = ({
    filterValues,
    resource,
    ...rest
}: Omit<
    ExportButtonProps,
    'sort' | 'maxResults' | 'label' | 'exporter' | 'meta'
>) => rest;

interface Props {
    exporter?: Exporter;
    filterValues?: FilterPayload;
    icon?: JSX.Element;
    label?: string;
    maxResults?: number;
    onClick?: (e: Event) => void;
    resource?: string;
    sort?: SortPayload;
    meta?: any;
}

export type ExportButtonProps = Props & ButtonProps;

ExportButton.propTypes = {
    exporter: PropTypes.func,
    filterValues: PropTypes.object,
    label: PropTypes.string,
    maxResults: PropTypes.number,
    resource: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    icon: PropTypes.element,
    meta: PropTypes.any,
};
