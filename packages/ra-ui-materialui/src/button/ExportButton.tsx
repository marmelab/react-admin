import React, { useCallback, useContext, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/GetApp';
import {
    fetchRelatedRecords,
    useDataProvider,
    useNotify,
    Sort,
    DataProvider,
    ExporterContext,
} from 'ra-core';
import Button, { ButtonProps } from './Button';

const ExportButton: FunctionComponent<ExportButtonProps> = ({
    sort,
    filter = defaultFilter,
    maxResults = 1000,
    resource,
    onClick,
    label = 'ra.action.export',
    icon = defaultIcon,
    ...rest
}) => {
    const exporter = useContext(ExporterContext);
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

const defaultIcon = <DownloadIcon />;
const defaultFilter = {};

const sanitizeRestProps = ({
    basePath,
    exporter,
    ...rest
}: Omit<
    ExportButtonProps,
    'sort' | 'filter' | 'maxResults' | 'resource' | 'label'
>) => rest;

interface Props {
    basePath?: string;
    exporter?: (
        data: any,
        fetchRelatedRecords: (
            data: any,
            field: string,
            resource: string
        ) => Promise<any>,
        dataProvider: DataProvider
    ) => Promise<void>;
    filter?: any;
    icon?: JSX.Element;
    label?: string;
    maxResults?: number;
    onClick?: (e: Event) => void;
    resource?: string;
    sort?: Sort;
}

export type ExportButtonProps = Props & ButtonProps;

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
