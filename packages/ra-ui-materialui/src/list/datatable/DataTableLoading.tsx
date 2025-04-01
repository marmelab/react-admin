import * as React from 'react';
import { ReactNode, FC, memo } from 'react';
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

import { DataTableClasses } from './DataTableRoot';
import { Placeholder } from '../Placeholder';

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

export const DataTableLoading = memo(function DataTableLoading({
    className,
    expand,
    hasBulkActions,
    nbChildren,
    nbFakeLines = 5,
    size,
}: DataTableLoadingProps) {
    const oneSecondHasPassed = useTimeout(1000);
    if (!oneSecondHasPassed) return null;
    return (
        <div className={DataTableClasses.root}>
            <Table
                className={clsx(DataTableClasses.table, className)}
                size={size}
            >
                <TableHead>
                    <TableRow className={DataTableClasses.row}>
                        {expand && (
                            <TableCell
                                padding="none"
                                className={DataTableClasses.expandHeader}
                            />
                        )}
                        {hasBulkActions && (
                            <TableCell
                                padding="checkbox"
                                className={DataTableClasses.expandIconCell}
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
                                className={DataTableClasses.headerCell}
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
                                    className={DataTableClasses.expandIconCell}
                                >
                                    <IconButton
                                        className={DataTableClasses.expandIcon}
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
                                    className={DataTableClasses.expandIconCell}
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
                                    className={DataTableClasses.rowCell}
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
});

export interface DataTableLoadingProps<RecordType extends RaRecord = any> {
    className?: string;
    expand?:
        | ReactNode
        | FC<{
              id: Identifier;
              record: RecordType;
              resource: string;
          }>;
    hasBulkActions?: boolean;
    nbChildren: number;
    nbFakeLines?: number;
    size?: 'small' | 'medium';
}
