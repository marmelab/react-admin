import * as React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    IconButton,
    Checkbox,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import { useTimeout } from 'ra-core';

import Placeholder from '../Placeholder';

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

const DatagridLoading = ({
    classes,
    className,
    expand,
    hasBulkActions,
    nbChildren,
    nbFakeLines = 5,
    size,
}) => {
    const oneSecondHasPassed = useTimeout(1000);

    return oneSecondHasPassed ? (
        <Table className={classnames(classes.table, className)} size={size}>
            <TableHead>
                <TableRow className={classes.row}>
                    {expand && (
                        <TableCell
                            padding="none"
                            className={classes.expandHeader}
                        />
                    )}
                    {hasBulkActions && (
                        <TableCell
                            padding="checkbox"
                            className={classes.expandIconCell}
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
                            className={classes.headerCell}
                            key={key}
                        >
                            <Placeholder />
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {times(nbFakeLines, key1 => (
                    <TableRow key={key1} style={{ opacity: 1 / (key1 + 1) }}>
                        {expand && (
                            <TableCell
                                padding="none"
                                className={classes.expandIconCell}
                            >
                                <IconButton
                                    className={classes.expandIcon}
                                    component="div"
                                    aria-hidden="true"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </TableCell>
                        )}
                        {hasBulkActions && (
                            <TableCell
                                padding="checkbox"
                                className={classes.expandIconCell}
                            >
                                <Checkbox
                                    className="select-all"
                                    color="primary"
                                    checked={false}
                                />
                            </TableCell>
                        )}
                        {times(nbChildren, key2 => (
                            <TableCell className={classes.rowCell} key={key2}>
                                <Placeholder />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ) : null;
};

DatagridLoading.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool,
    nbChildren: PropTypes.number,
    nbFakeLines: PropTypes.number,
    size: PropTypes.oneOf(['small', 'medium']),
};

export default memo(DatagridLoading);
