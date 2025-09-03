import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import {
    CoreAdminContext,
    Exporter,
    ListBase,
    useBulkExport,
    UseBulkExportOptions,
    useListContext,
} from '..';

export default {
    title: 'ra-core/export/useBulkExport',
};

const data = {
    books: [
        { id: 1, title: 'War and Peace' },
        { id: 2, title: 'The Little Prince' },
        { id: 3, title: "Swann's Way" },
        { id: 4, title: 'A Tale of Two Cities' },
        { id: 5, title: 'The Lord of the Rings' },
        { id: 6, title: 'And Then There Were None' },
        { id: 7, title: 'Dream of the Red Chamber' },
        { id: 8, title: 'The Hobbit' },
        { id: 9, title: 'She: A History of Adventure' },
        { id: 10, title: 'The Lion, the Witch and the Wardrobe' },
        { id: 11, title: 'The Chronicles of Narnia' },
        { id: 12, title: 'Pride and Prejudice' },
        { id: 13, title: 'Ulysses' },
        { id: 14, title: 'The Catcher in the Rye' },
        { id: 15, title: 'The Little Mermaid' },
        { id: 16, title: 'The Secret Garden' },
        { id: 17, title: 'The Wind in the Willows' },
        { id: 18, title: 'The Wizard of Oz' },
        { id: 19, title: 'Madam Bovary' },
        { id: 20, title: 'The Little House' },
        { id: 21, title: 'The Phantom of the Opera' },
        { id: 22, title: 'The Adventures of Tom Sawyer' },
        { id: 23, title: 'The Adventures of Huckleberry Finn' },
        { id: 24, title: 'The Time Machine' },
        { id: 25, title: 'The War of the Worlds' },
    ],
};

const dataProvider = fakeRestProvider(
    data,
    process.env.NODE_ENV !== 'test',
    300
);

export const Basic = ({
    exporter = (data, fetchRelatedRecords, dataProvider, resource) => {
        alert(
            `Exporting ${data.length} items (${data.map(record => record.id).join(', ')}) from ${resource}`
        );
    },
}: {
    exporter?: Exporter;
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ListBase resource="books" perPage={5} exporter={exporter}>
            <ListView />
            <BulkExportButton />
        </ListBase>
    </CoreAdminContext>
);

const ListView = () => {
    const { data, error, isPending, selectedIds, onToggleItem } =
        useListContext();

    if (isPending) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error...</div>;
    }

    return (
        <div>
            <ul>
                {data.map((record: any) => (
                    <li key={record.id}>
                        <label>
                            <input
                                type="checkbox"
                                style={{ marginRight: '8px' }}
                                checked={selectedIds.includes(record.id)}
                                onChange={() => onToggleItem(record.id)}
                            />
                            {record.title}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const HookLevelExporter = ({
    exporter = (data, fetchRelatedRecords, dataProvider, resource) => {
        alert(
            `Exporting ${data.length} items (${data.map(record => record.id).join(', ')}) from ${resource} at the list level`
        );
    },
    hookExporter = (data, fetchRelatedRecords, dataProvider, resource) => {
        alert(
            `Exporting ${data.length} items (${data.map(record => record.id).join(', ')}) from ${resource} at the hook level`
        );
    },
}: {
    exporter?: Exporter;
    hookExporter?: Exporter;
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ListBase resource="books" perPage={5} exporter={exporter}>
            <ListView />
            <BulkExportButton exporter={hookExporter} />
        </ListBase>
    </CoreAdminContext>
);

const BulkExportButton = ({ exporter }: UseBulkExportOptions) => {
    const bulkExport = useBulkExport({ exporter });
    return <button onClick={bulkExport}>Export</button>;
};
