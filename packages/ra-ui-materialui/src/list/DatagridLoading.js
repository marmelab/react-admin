import React from 'react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const RawPlaceholder = ({ classes }) => (
    <div className={classes.root}>&nbsp;</div>
);

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.grey[300],
        display: 'flex',
    },
});

const Placeholder = withStyles(styles)(RawPlaceholder);

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

export default ({
    classes,
    className,
    expand,
    hasBulkActions,
    nbChildren,
    nbFakeLines = 5,
}) => (
    <Table className={classnames(classes.table, className)}>
        <TableHead>
            <TableRow className={classes.row}>
                {expand && <TableCell className={classes.expandHeader} />}
                {hasBulkActions && (
                    <TableCell
                        padding="none"
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
                        padding="none"
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
                                role="expand"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </TableCell>
                    )}
                    {hasBulkActions && (
                        <TableCell
                            padding="none"
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
                        <TableCell
                            padding="none"
                            className={classes.rowCell}
                            key={key2}
                        >
                            <Placeholder />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
