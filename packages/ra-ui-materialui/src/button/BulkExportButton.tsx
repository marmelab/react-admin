import * as React from 'react';
import { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/GetApp';
import {
    fetchRelatedRecords,
    useDataProvider,
    useNotify,
    Exporter,
    useListContext,
    useResourceContext,
} from 'ra-core';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

import { Button, ButtonProps } from './Button';

/**
 * Export the selected rows
 *
 * To be used inside the <Datagrid bulkActionButtons> prop.
 *
 * @example // basic usage
 * import { BulkDeleteButton, BulkExportButton, List, Datagrid } from 'react-admin';
 *
 * const PostBulkActionButtons = () => (
 *     <>
 *         <BulkExportButton />
 *         <BulkDeleteButton />
 *     </>
 * );
 *
 * export const PostList = () => (
 *     <List>
 *        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
 *          ...
 *       </Datagrid>
 *     </List>
 * );
 */
export const BulkExportButton = (inProps: BulkExportButtonProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        onClick,
        label = 'ra.action.export',
        icon = defaultIcon,
        exporter: customExporter,
        meta,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const { exporter: exporterFromContext, selectedIds } = useListContext();
    const exporter = customExporter || exporterFromContext;
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const handleClick = useCallback(
        event => {
            if (exporter && resource) {
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
            }
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [dataProvider, exporter, notify, onClick, resource, selectedIds, meta]
    );

    return (
        <StyledButton
            onClick={handleClick}
            label={label}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </StyledButton>
    );
};

const defaultIcon = <DownloadIcon />;

const sanitizeRestProps = ({
    resource,
    ...rest
}: Omit<BulkExportButtonProps, 'exporter' | 'label' | 'meta'>) => rest;

interface Props {
    exporter?: Exporter;
    icon?: React.ReactNode;
    label?: string;
    onClick?: (e: Event) => void;
    resource?: string;
    meta?: any;
}

export type BulkExportButtonProps = Props & ButtonProps;

const PREFIX = 'RaBulkExportButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<BulkExportButtonProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
