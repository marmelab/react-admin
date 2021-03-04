import * as React from 'react';
import expect from 'expect';
import { render, getNodeText } from '@testing-library/react';
import { RecordContextProvider } from 'ra-core';

import TextField from './TextField';

describe('<TextField />', () => {
    it('should display record specific value as plain text', () => {
        const record = {
            id: 123,
            title: "I'm sorry, Dave. I'm afraid I can't do that.",
        };
        const { queryByText } = render(
            <TextField record={record} source="title" />
        );
        expect(
            queryByText("I'm sorry, Dave. I'm afraid I can't do that.")
        ).not.toBeNull();
    });
    it('should use record from RecordContext', () => {
        const record = {
            id: 123,
            title: "I'm sorry, Dave. I'm afraid I can't do that.",
        };
        const { queryByText } = render(
            <RecordContextProvider value={record}>
                <TextField source="title" />
            </RecordContextProvider>
        );
        expect(
            queryByText("I'm sorry, Dave. I'm afraid I can't do that.")
        ).not.toBeNull();
    });

    it.each([null, undefined])(
        'should display emptyText prop if provided for %s value',
        value => {
            const record = { id: 123, title: value };
            render(
                <TextField
                    emptyText="Sorry, there's nothing here"
                    record={record}
                    source="title"
                />
            );
            expect("Sorry, there's nothing here").not.toBeNull();
        }
    );

    it.each([null, undefined])(
        'should display nothing for %s value without emptyText prop',
        value => {
            const record = { id: 123, title: value };
            const { container } = render(
                <TextField record={record} source="title" />
            );
            expect(getNodeText(container)).toStrictEqual('');
        }
    );

    it('should handle deep fields', () => {
        const record = {
            id: 123,
            foo: { title: "I'm sorry, Dave. I'm afraid I can't do that." },
        };
        const { queryByText } = render(
            <TextField record={record} source="foo.title" />
        );
        expect(
            queryByText("I'm sorry, Dave. I'm afraid I can't do that.")
        ).not.toBeNull();
    });

    it('should render the emptyText when value is null', () => {
        const record = { id: 123, title: null };
        const { queryByText } = render(
            <TextField record={record} source="title" emptyText="NA" />
        );
        expect(queryByText('NA')).not.toBeNull();
    });
});
