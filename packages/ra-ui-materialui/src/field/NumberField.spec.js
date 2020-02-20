import React from 'react';
import assert from 'assert';
import { render } from '@testing-library/react';
import { NumberField } from './NumberField';

describe('<NumberField />', () => {
    it('should return null when the record is not set', () => {
        const { container } = render(<NumberField source="foo" />);
        assert.equal(container.firstChild, null);
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(<NumberField record={{}} source="foo" />);
        assert.equal(container.firstChild, null);
    });

    it('should render the emptyText when value is null', () => {
        const { queryByText } = render(
            <NumberField record={{ foo: null }} emptyText="NA" source="foo" />
        );
        assert.notEqual(queryByText('NA'), null);
    });

    it('should render a number', () => {
        const { queryByText } = render(
            <NumberField record={{ foo: 1 }} source="foo" />
        );
        assert.notEqual(queryByText('1'), null);
    });

    it('should pass the options prop to Intl.NumberFormat', () => {
        const { queryByText } = render(
            <NumberField
                record={{ foo: 1 }}
                source="foo"
                locales="en-US"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        assert.notEqual(queryByText('1.00'), null);
    });

    it('should use the locales props as an argument to Intl.NumberFormat', () => {
        const { queryByText } = render(
            <NumberField
                record={{ foo: 1 }}
                source="foo"
                locales="fr-FR"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        assert.notEqual(queryByText('1,00'), null);
    });

    it('should use custom className', () => {
        const { container } = render(
            <NumberField record={{ foo: true }} source="foo" className="foo" />
        );
        assert.ok(container.firstChild.classList.contains('foo'));
    });

    it('should handle deep fields', () => {
        const { queryByText } = render(
            <NumberField record={{ foo: { bar: 2 } }} source="foo.bar" />
        );

        assert.notEqual(queryByText('1'), null);
    });
});
