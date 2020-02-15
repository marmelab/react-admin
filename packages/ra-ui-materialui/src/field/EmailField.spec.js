import React from 'react';
import assert from 'assert';
import { render } from '@testing-library/react';
import EmailField from './EmailField';

describe('<EmailField />', () => {
    it('should render as an email link', () => {
        const record = { foo: 'foo@bar.com' };
        const { container } = render(
            <EmailField record={record} source="foo" />
        );
        assert.equal(
            container.innerHTML,
            '<a href="mailto:foo@bar.com">foo@bar.com</a>'
        );
    });

    it('should handle deep fields', () => {
        const record = { foo: { bar: 'foo@bar.com' } };
        const { container } = render(
            <EmailField record={record} source="foo.bar" />
        );
        assert.equal(
            container.innerHTML,
            '<a href="mailto:foo@bar.com">foo@bar.com</a>'
        );
    });

    it('should display an email (mailto) link', () => {
        const record = { email: 'hal@kubrickcorp.com' };
        const { container } = render(
            <EmailField record={record} source="email" />
        );
        assert.equal(
            container.innerHTML,
            '<a href="mailto:hal@kubrickcorp.com">hal@kubrickcorp.com</a>'
        );
    });

    it('should use custom className', () => {
        const { container } = render(
            <EmailField
                record={{ email: true }}
                source="email"
                className="foo"
            />
        );
        assert.ok(container.firstChild.classList.contains('foo'));
    });

    it('should render the emptyText when value is null', () => {
        const { queryByText } = render(
            <EmailField record={{ foo: null }} source="foo" emptyText="NA" />
        );
        assert.notEqual(queryByText('NA'), null);
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(<EmailField record={{}} source="foo" />);
        assert.equal(container.firstChild, null);
    });
});
