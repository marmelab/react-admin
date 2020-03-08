import React from 'react';
import assert from 'assert';
import { render, cleanup } from '@testing-library/react';
import TextField from './TextField';

describe('<TextField />', () => {
    afterEach(cleanup);

    it('should display record specific value as plain text', () => {
        const record = {
            title: "I'm sorry, Dave. I'm afraid I can't do that.",
        };
        const { queryByText } = render(
            <TextField record={record} source="title" />
        );
        assert.notEqual(
            queryByText("I'm sorry, Dave. I'm afraid I can't do that."),
            null
        );
    });

    it('should handle deep fields', () => {
        const record = {
            foo: { title: "I'm sorry, Dave. I'm afraid I can't do that." },
        };
        const { queryByText } = render(
            <TextField record={record} source="foo.title" />
        );
        assert.notEqual(
            queryByText("I'm sorry, Dave. I'm afraid I can't do that."),
            null
        );
    });

    it('should render the emptyText when value is null', () => {
        const record = { title: null };
        const { queryByText } = render(
            <TextField record={record} source="title" emptyText="NA" />
        );
        assert.notEqual(queryByText('NA'), null);
    });
});
