import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import type { SxProps } from '@mui/material';
import { ListItem, ListItemButton, ListItemProps } from '@mui/material';
import {
    Identifier,
    LinkToType,
    RaRecord,
    useEvent,
    useGetPathForRecord,
    useGetPathForRecordCallback,
    useRecordContext,
    useResourceContext,
} from 'ra-core';
import { Link, useNavigate } from 'react-router-dom';
import { RowClickFunction } from '../types';

export const SimpleListItem = <RecordType extends RaRecord = any>(
    props: SimpleListItemProps<RecordType>
) => {
    const { children, linkType, rowClick, rowIndex, rowSx, rowStyle } = props;
    const resource = useResourceContext(props);
    const record = useRecordContext<RecordType>(props);
    const navigate = useNavigate();
    // If we don't have a function to get the path, we can compute the path immediately and set the href
    // on the Link correctly without onClick (better for accessibility)
    const isFunctionLink =
        typeof linkType === 'function' || typeof rowClick === 'function';
    const pathForRecord = useGetPathForRecord({
        link: isFunctionLink ? false : linkType ?? rowClick,
        resource,
    });
    const getPathForRecord = useGetPathForRecordCallback();
    const handleClick = useEvent(async () => {
        // No need to handle non function linkType or rowClick
        if (!isFunctionLink) return;
        if (!record) return;

        let link: LinkToType =
            typeof linkType === 'function'
                ? linkType(record, record.id)
                : typeof rowClick === 'function'
                  ? (record, resource) => rowClick(record.id, resource, record)
                  : false;

        const path = await getPathForRecord({
            record,
            resource,
            link,
        });
        if (path === false || path == null) {
            return;
        }
        navigate(path);
    });

    if (!record) return null;

    if (isFunctionLink) {
        return (
            <ListItem
                disablePadding
                sx={{
                    '.MuiListItem-container': {
                        width: '100%',
                    },
                }}
            >
                <ListItemButton
                    onClick={handleClick}
                    style={rowStyle ? rowStyle(record, rowIndex) : undefined}
                    sx={rowSx?.(record, rowIndex)}
                >
                    {children}
                </ListItemButton>
            </ListItem>
        );
    }

    if (pathForRecord) {
        return (
            <ListItem
                disablePadding
                sx={{
                    '.MuiListItem-container': {
                        width: '100%',
                    },
                }}
            >
                <ListItemButton
                    component={Link}
                    to={pathForRecord}
                    style={rowStyle ? rowStyle(record, rowIndex) : undefined}
                    sx={rowSx?.(record, rowIndex)}
                >
                    {children}
                </ListItemButton>
            </ListItem>
        );
    }

    return (
        <ListItem
            sx={{
                '.MuiListItem-container': {
                    width: '100%',
                },
            }}
        >
            {children}
        </ListItem>
    );
};

export type FunctionToElement<RecordType extends RaRecord = any> = (
    record: RecordType,
    id: Identifier
) => ReactNode;

export type FunctionLinkType = (record: RaRecord, id: Identifier) => string;

export interface SimpleListBaseProps<RecordType extends RaRecord = any> {
    leftAvatar?: FunctionToElement<RecordType>;
    leftIcon?: FunctionToElement<RecordType>;
    primaryText?: FunctionToElement<RecordType> | ReactElement | string;
    /**
     * @deprecated use rowClick instead
     */
    linkType?: string | FunctionLinkType | false;

    /**
     * The action to trigger when the user clicks on a row.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#rowclick
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List>
     *         <Datagrid rowClick="edit">
     *             ...
     *         </Datagrid>                    </ListItem>

     *     </List>
     * );
     */
    rowClick?: string | RowClickFunction | false;
    rightAvatar?: FunctionToElement<RecordType>;
    rightIcon?: FunctionToElement<RecordType>;
    secondaryText?: FunctionToElement<RecordType> | ReactElement | string;
    tertiaryText?: FunctionToElement<RecordType> | ReactElement | string;
    rowSx?: (record: RecordType, index: number) => SxProps;
    rowStyle?: (record: RecordType, index: number) => any;
}

export interface SimpleListItemProps<RecordType extends RaRecord = any>
    extends SimpleListBaseProps<RecordType>,
        Omit<ListItemProps, 'button' | 'component' | 'id'> {
    rowIndex: number;
}
