import * as React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import NumberField from './NumberField';

describe('<NumberField />', () => {
    afterEach(cleanup);

    it('should return null when the record is not set', () => {
        const { container } = render(<NumberField source="foo" />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(
            <NumberField record={{ id: 123 }} source="foo" />
        );
        expect(container.firstChild).toBeNull();
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        foo => {
            const { getByText } = render(
                <NumberField
                    record={{ id: 123, foo }}
                    emptyText="NA"
                    source="foo"
                />
            );
            expect(getByText('NA')).not.toBeNull();
        }
    );

    it('should render a number', () => {
        const { queryByText } = render(
            <NumberField record={{ id: 123, foo: 1 }} source="foo" />
        );
        expect(queryByText('1')).not.toBeNull();
    });

    it('should pass the options prop to Intl.NumberFormat', () => {
        const { queryByText } = render(
            <NumberField
                record={{ id: 123, foo: 1 }}
                source="foo"
                locales="en-US"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        expect(queryByText('1.00')).not.toBeNull();
    });

    it('should use the locales props as an argument to Intl.NumberFormat', () => {
        const { queryByText } = render(
            <NumberField
                record={{ id: 123, foo: 1 }}
                source="foo"
                locales="fr-FR"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        expect(queryByText('1,00')).not.toBeNull();
    });

    it('should use custom className', () => {
        const { container } = render(
            <NumberField
                record={{ id: 123, foo: true }}
                source="foo"
                className="foo"
            />
        );
        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    it('should handle deep fields', () => {
        const { queryByText } = render(
            <NumberField
                record={{ id: 123, foo: { bar: 2 } }}
                source="foo.bar"
            />
        );

        expect(queryByText('2')).not.toBeNull();
    });
});
