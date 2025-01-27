import * as React from 'react';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    useTranslate,
    Title,
    useDefaultTitle,
    useGetResourceLabel,
} from 'react-admin';

import LinkToRelatedCustomers from './LinkToRelatedCustomers';
import segments from './data';

const Segments = () => {
    const appTitle = useDefaultTitle();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const pageTitle = translate(`ra.page.list`, {
        name: getResourceLabel('segments', 2),
    });

    return (
        <>
            <title>{`${appTitle} - ${pageTitle}`}</title>
            <Card sx={{ mt: 2 }}>
                <Title title={pageTitle} />
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
                                    <LinkToRelatedCustomers
                                        segment={segment.id}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
};

export default Segments;
