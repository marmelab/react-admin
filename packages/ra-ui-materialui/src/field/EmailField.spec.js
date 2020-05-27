import React from 'react';
import assert from 'assert';
import { render, cleanup } from '@testing-library/react';
import EmailField from './EmailField';

const email = 'foo@bar.com';

describe('<EmailField />', () => {
    afterEach(cleanup);

    it('should render as an email link', () => {
        const record = { foo: email };
        const { getByText } = render(
            <EmailField record={record} source="foo" />
        );
        const link = getByText(email);
        expect(link.tagName).toEqual('A');
        expect(link.href).toEqual(`mailto:${email}`);
    });

    it('should handle deep fields', () => {
        const record = { foo: { bar: email } };
        const { getByText } = render(
            <EmailField record={record} source="foo.bar" />
        );
        const link = getByText(email);
        expect(link.href).toEqual(`mailto:${email}`);
    });

    it('should use custom className', () => {
        const { container } = render(
            <EmailField record={{ email }} source="email" className="foo" />
        );
        assert.ok(container.firstChild.classList.contains('foo'));
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        foo => {
            const { getByText } = render(
                <EmailField record={{ foo }} source="foo" emptyText="NA" />
            );
            expect(getByText('NA')).not.toEqual(null);
        }
    );

    it('should return null when the record has no value for the source and no emptyText', () => {
        const { container } = render(<EmailField record={{}} source="foo" />);
        assert.equal(container.firstChild, null);
    });
});
