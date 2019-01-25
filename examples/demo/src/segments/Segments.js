import React from 'react';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { translate, Title } from 'react-admin';

import LinkToRelatedCustomers from './LinkToRelatedCustomers';
import segments from './data';

const Segments = ({ translate }) => (
    <Card>
        <Title title={translate('resources.segments.name')} />
        <Table>
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
    </Card>
);

export default translate(Segments);
