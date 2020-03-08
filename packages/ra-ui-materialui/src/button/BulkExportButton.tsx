import React, { useCallback, useContext, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@material-ui/icons/GetApp';
import {
    fetchRelatedRecords,
    useDataProvider,
    useNotify,
    DataProvider,
    Identifier,
    ExporterContext,
} from 'ra-core';

import Button, { ButtonProps } from './Button';

const BulkExportButton: FunctionComponent<BulkExportButtonProps> = ({
    resource,
    selectedIds,
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
            exporter &&
                dataProvider
                    .getMany(resource, { ids: selectedIds })
                    .then(({ data }) =>
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
        [dataProvider, exporter, notify, onClick, resource, selectedIds]
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

const sanitizeRestProps = ({
    basePath,
    filterValues,
    ...rest
}: Omit<
    BulkExportButtonProps,
    'exporter' | 'selectedIds' | 'resource' | 'label'
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
    filterValues?: any;
    icon?: JSX.Element;
    label?: string;
    onClick?: (e: Event) => void;
    selectedIds: Identifier[];
    resource?: string;
}

export type BulkExportButtonProps = Props & ButtonProps;

BulkExportButton.propTypes = {
    basePath: PropTypes.string,
    exporter: PropTypes.func,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    icon: PropTypes.element,
};

export default BulkExportButton;
