import { render } from '@testing-library/react';
import expect from 'expect';
import * as React from 'react';

import { UrlField } from './UrlField';
import { WrapperField } from './WrapperField';

const url = 'https://en.wikipedia.org/wiki/HAL_9000';

describe('<WrapperField />', () => {
    it('should render its children', () => {
        const record = { id: 123, website: url };
        const { getByText } = render(
            <WrapperField label="wrapper">
                <UrlField record={record} source="website" />
            </WrapperField>
        );
        const link = getByText(url) as HTMLAnchorElement;
        expect(link.tagName).toEqual('A');
        expect(link.href).toEqual(url);
    });
});
