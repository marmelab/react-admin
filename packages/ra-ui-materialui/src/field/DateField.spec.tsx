import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { RecordContextProvider } from 'ra-core';

import { DateField } from './DateField';

describe('<DateField />', () => {
    it('should return null when the record is not set', () => {
        const { container } = render(<DateField source="foo" />);
        expect(container.firstChild).toBeNull();
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(
            <DateField record={{ id: 123 }} source="foo" />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render a date', () => {
        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: new Date('2017-04-23') }}
                source="foo"
                locales="en-US"
            />
        );

        const date = new Date('2017-04-23').toLocaleDateString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should render a date string', () => {
        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: '2017-04-23' }}
                source="foo"
                locales="en-US"
            />
        );

        const date = new Date('2017-04-23').toLocaleDateString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should use record from RecordContext', () => {
        const { queryByText } = render(
            <RecordContextProvider
                value={{ id: 123, foo: new Date('2017-04-23') }}
            >
                <DateField source="foo" locales="en-US" />
            </RecordContextProvider>
        );

        const date = new Date('2017-04-23').toLocaleDateString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should render a date and time when the showtime prop is passed', () => {
        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: new Date('2017-04-23 23:05') }}
                showTime
                source="foo"
                locales="en-US"
            />
        );

        const date = new Date('2017-04-23 23:05').toLocaleString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should pass the options prop to toLocaleString', () => {
        const date = new Date('2017-04-23');
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: date }}
                source="foo"
                locales="en-US"
                options={options}
            />
        );
        expect(
            queryByText(date.toLocaleDateString('en-US', options))
        ).not.toBeNull();
    });

    it('should use the locales props as an argument to toLocaleString', () => {
        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: new Date('2017-04-23') }}
                source="foo"
                locales="fr-FR"
            />
        );

        const date = new Date('2017-04-23').toLocaleDateString('fr-FR');
        expect(queryByText(date)).not.toBeNull();
    });

    it('should use custom className', () => {
        const { container } = render(
            <DateField
                record={{ id: 123, foo: new Date('01/01/2016') }}
                source="foo"
                locales="en-US"
                className="foo"
            />
        );

        expect(container.children[0].classList.contains('foo')).toBe(true);
    });

    it('should handle deep fields', () => {
        const { queryByText } = render(
            <DateField
                record={{ id: 123, foo: { bar: new Date('01/01/2016') } }}
                source="foo.bar"
                locales="en-US"
            />
        );

        const date = new Date('1/1/2016').toLocaleDateString('en-US');
        expect(queryByText(date)).not.toBeNull();
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        foo => {
            const { queryByText } = render(
                <DateField
                    record={{ id: 123, foo }}
                    source="foo"
                    locales="fr-FR"
                    emptyText="NA"
                />
            );
            expect(queryByText('NA')).not.toBeNull();
        }
    );
});
