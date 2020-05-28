import * as React from 'react';
import { useCallback, useContext, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/GetApp';
import {
    fetchRelatedRecords,
    useDataProvider,
    useNotify,
    Sort,
    ExporterContext,
    Exporter,
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
    exporter: customExporter,
    ...rest
}) => {
    const exporterFromContext = useContext(ExporterContext);
    const exporter = customExporter || exporterFromContext;
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
    ...rest
}: Omit<
    ExportButtonProps,
    'sort' | 'filter' | 'maxResults' | 'resource' | 'label' | 'exporter'
>) => rest;

interface Props {
    basePath?: string;
    exporter?: Exporter;
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
