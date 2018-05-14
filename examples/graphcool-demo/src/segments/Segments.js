import React from 'react';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { translate, ViewTitle } from 'react-admin';

import LinkToRelatedCustomers from './LinkToRelatedCustomers';

export default translate(({ translate }) => (
    <Card>
        <ViewTitle title={translate('resources.segments.name')} />
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
                {[].map(segment => (
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
));
