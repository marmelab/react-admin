import * as React from 'react';
import { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/GetApp';
import {
    fetchRelatedRecords,
    useDataProvider,
    useNotify,
    useListContext,
    Exporter,
} from 'ra-core';
import { Button, ButtonProps } from './Button';

export const ExportButton = React.forwardRef(function ExportButton(
    props: ExportButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) {
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
        resource,
        sort,
        exporter: exporterFromContext,
        total,
        getData,
    } = useListContext();
    const exporter = customExporter || exporterFromContext;
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const handleClick = useCallback(
        event => {
            const fetchData = getData
                ? getData({ maxResults, meta })
                : dataProvider
                      .getList(resource, {
                          sort,
                          filter: filter
                              ? { ...filterValues, ...filter }
                              : filterValues,
                          pagination: { page: 1, perPage: maxResults },
                          meta,
                      })
                      .then(({ data }) => data);

            Promise.resolve(fetchData)
                .then(
                    data =>
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
            getData,
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
            ref={ref}
            onClick={handleClick}
            label={label}
            disabled={total === 0}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
});

const defaultIcon = <DownloadIcon />;

const sanitizeRestProps = ({
    resource,
    ...rest
}: Omit<ExportButtonProps, 'maxResults' | 'label' | 'exporter' | 'meta'>) =>
    rest;

interface Props {
    exporter?: Exporter;
    icon?: React.ReactNode;
    label?: string;
    maxResults?: number;
    onClick?: (e: Event) => void;
    resource?: string;
    meta?: any;
}

export type ExportButtonProps = Props & ButtonProps;
