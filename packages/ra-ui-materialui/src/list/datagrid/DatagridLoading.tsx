import * as React from 'react';
import { ReactElement, FC, memo } from 'react';
import {
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    IconButton,
    Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import { useTimeout, Identifier, RaRecord } from 'ra-core';

import { DatagridClasses } from './useDatagridStyles';
import { Placeholder } from '../Placeholder';

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

const DatagridLoading = ({
    className,
    expand,
    hasBulkActions,
    nbChildren,
    nbFakeLines = 5,
    size,
}: DatagridLoadingProps) => {
    const oneSecondHasPassed = useTimeout(1000);
    if (!oneSecondHasPassed) return null;
    return (
        <div className={DatagridClasses.root}>
            <Table
                className={clsx(DatagridClasses.table, className)}
                size={size}
            >
                <TableHead>
                    <TableRow className={DatagridClasses.row}>
                        {expand && (
                            <TableCell
                                padding="none"
                                className={DatagridClasses.expandHeader}
                            />
                        )}
                        {hasBulkActions && (
                            <TableCell
                                padding="checkbox"
                                className={DatagridClasses.expandIconCell}
                            >
                                <Checkbox
                                    className="select-all"
                                    color="primary"
                                    checked={false}
                                />
                            </TableCell>
                        )}
                        {times(nbChildren, key => (
                            <TableCell
                                variant="head"
                                className={DatagridClasses.headerCell}
                                key={key}
                            >
                                <Placeholder />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {times(nbFakeLines, key1 => (
                        <TableRow
                            key={key1}
                            style={{ opacity: 1 / (key1 + 1) }}
                        >
                            {expand && (
                                <TableCell
                                    padding="none"
                                    className={DatagridClasses.expandIconCell}
                                >
                                    <IconButton
                                        className={DatagridClasses.expandIcon}
                                        component="div"
                                        aria-hidden="true"
                                        size="large"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </TableCell>
                            )}
                            {hasBulkActions && (
                                <TableCell
                                    padding="checkbox"
                                    className={DatagridClasses.expandIconCell}
                                >
                                    <Checkbox
                                        className="select-all"
                                        color="primary"
                                        checked={false}
                                    />
                                </TableCell>
                            )}
                            {times(nbChildren, key2 => (
                                <TableCell
                                    className={DatagridClasses.rowCell}
                                    key={key2}
                                >
                                    <Placeholder />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export interface DatagridLoadingProps {
    className?: string;
    expand?:
        | ReactElement
        | FC<{
              id: Identifier;
              record: RaRecord;
              resource: string;
          }>;
    hasBulkActions?: boolean;
    nbChildren: number;
    nbFakeLines?: number;
    size?: 'small' | 'medium';
}

export default memo(DatagridLoading);
