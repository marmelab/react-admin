import * as React from 'react';
import { useCallback } from 'react';
import DownloadIcon from '@mui/icons-material/GetApp';
import {
    useBulkExport,
    useResourceContext,
    UseBulkExportOptions,
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
    const bulkExport = useBulkExport({
        exporter: customExporter,
        resource,
        meta,
    });
    const handleClick = useCallback(
        event => {
            bulkExport();

            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [bulkExport, onClick]
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

export interface BulkExportButtonProps
    extends ButtonProps,
        UseBulkExportOptions {
    icon?: React.ReactNode;
    resource?: string;
    meta?: any;
}

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
