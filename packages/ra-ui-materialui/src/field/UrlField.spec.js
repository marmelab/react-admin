import React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import UrlField from './UrlField';

const url = 'https://en.wikipedia.org/wiki/HAL_9000';

describe('<UrlField />', () => {
    afterEach(cleanup);

    it('should render a link', () => {
        const record = { website: url };
        const { getByText } = render(
            <UrlField record={record} source="website" />
        );
        const link = getByText(url);
        expect(link.tagName).toEqual('A');
        expect(link.href).toEqual(url);
    });

    it('should handle deep fields', () => {
        const record = {
            foo: { website: url },
        };
        const { getByText } = render(
            <UrlField record={record} source="foo.website" />
        );
        const link = getByText(url);
        expect(link.href).toEqual(url);
    });

    it('should render the emptyText when value is null', () => {
        const { getByText } = render(
            <UrlField
                record={{ url: null }}
                className="foo"
                source="url"
                emptyText="NA"
            />
        );
        expect(getByText('NA')).not.toEqual(null);
    });
});
