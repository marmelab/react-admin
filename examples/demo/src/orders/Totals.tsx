import * as React from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useRecordContext, useTranslate } from 'react-admin';

import { Order } from '../types';

const PREFIX = 'Totals';

const classes = {
    container: `${PREFIX}-container`,
    rightAlignedCell: `${PREFIX}-rightAlignedCell`,
    boldCell: `${PREFIX}-boldCell`,
};

const StyledTable = styled(Table)({
    [`&.${classes.container}`]: { minWidth: '35em' },
    [`& .${classes.rightAlignedCell}`]: { textAlign: 'right' },
    [`& .${classes.boldCell}`]: { fontWeight: 'bold' },
});

const Totals = () => {
    const record = useRecordContext<Order>();
    const translate = useTranslate();

    return (
        <StyledTable className={classes.container}>
            <TableBody>
                <TableRow>
                    <TableCell>
                        {translate('resources.commands.fields.basket.sum')}
                    </TableCell>
                    <TableCell className={classes.rightAlignedCell}>
                        {record?.total_ex_taxes.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate('resources.commands.fields.basket.delivery')}
                    </TableCell>
                    <TableCell className={classes.rightAlignedCell}>
                        {record?.delivery_fees.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate('resources.commands.fields.basket.taxes')} (
                        {record?.tax_rate.toLocaleString(undefined, {
                            style: 'percent',
                        })}
                        )
                    </TableCell>
                    <TableCell className={classes.rightAlignedCell}>
                        {record?.taxes.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.boldCell}>
                        {translate('resources.commands.fields.basket.total')}
                    </TableCell>
                    <TableCell
                        className={clsx(
                            classes.boldCell,
                            classes.rightAlignedCell
                        )}
                    >
                        {record?.total.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCell>
                </TableRow>
            </TableBody>
        </StyledTable>
    );
};

export default Totals;
