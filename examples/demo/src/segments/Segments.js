import React from 'react';
import Card from 'material-ui/Card';
import Table, {
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from 'material-ui/Table';
import { translate, ViewTitle } from 'react-admin';

import LinkToRelatedCustomers from './LinkToRelatedCustomers';
import segments from './data';

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
));
