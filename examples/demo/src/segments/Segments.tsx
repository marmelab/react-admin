import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslate, Title } from 'react-admin';

import LinkToRelatedCustomers from './LinkToRelatedCustomers';
import segments from './data';

const PREFIX = 'Segments';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledCard = styled(Card)({
    [`&.${classes.root}`]: {
        marginTop: 16,
    },
});

const Segments = () => {
    const translate = useTranslate();

    return (
        <StyledCard className={classes.root}>
            <Title
                title={translate('resources.segments.name', { smart_count: 2 })}
            />
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {translate('resources.segments.fields.name')}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {segments.map(segment => (
                        <TableRow key={segment.id}>
                            <TableCell>{translate(segment.name)}</TableCell>
                            <TableCell>
                                <LinkToRelatedCustomers segment={segment.id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </StyledCard>
    );
};

export default Segments;
