import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@mui/icons-material/GetApp';
import {
    fetchRelatedRecords,
    useDataProvider,
    useNotify,
    Identifier,
    Exporter,
    useListContext,
} from 'ra-core';

import { Button, ButtonProps } from './Button';

/**
 * Export the selected rows
 *
 * To be used inside the <List bulkActionButtons> prop.
 *
 * @example // basic usage
 * import * as React from 'react';
 * import { Fragment } from 'react';
 * import { BulkDeleteButton, BulkExportButton } from 'react-admin';
 *
 * const PostBulkActionButtons = () => (
 *     <Fragment>
 *         <BulkExportButton />
 *         <BulkDeleteButton />
 *     </Fragment>
 * );
 *
 * export const PostList = () => (
 *     <List bulkActionButtons={<PostBulkActionButtons />}>
 *         ...
 *     </List>
 * );
 */
export const BulkExportButton = (props: BulkExportButtonProps) => {
    const {
        onClick,
        label = 'ra.action.export',
        icon = defaultIcon,
        exporter: customExporter,
        meta,
        ...rest
    } = props;
    const {
        exporter: exporterFromContext,
        resource,
        selectedIds,
    } = useListContext(props);
    const exporter = customExporter || exporterFromContext;
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const handleClick = useCallback(
        event => {
            exporter &&
                dataProvider
                    .getMany(resource, { ids: selectedIds, meta })
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
                        notify('ra.notification.http_error', {
                            type: 'error',
                        });
                    });
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [dataProvider, exporter, notify, onClick, resource, selectedIds, meta]
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
    filterValues,
    selectedIds,
    resource,
    ...rest
}: Omit<BulkExportButtonProps, 'exporter' | 'label' | 'meta'>) => rest;

interface Props {
    exporter?: Exporter;
    filterValues?: any;
    icon?: JSX.Element;
    label?: string;
    onClick?: (e: Event) => void;
    selectedIds?: Identifier[];
    resource?: string;
    meta?: any;
}

export type BulkExportButtonProps = Props & ButtonProps;

BulkExportButton.propTypes = {
    exporter: PropTypes.func,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    icon: PropTypes.element,
    meta: PropTypes.any,
};
