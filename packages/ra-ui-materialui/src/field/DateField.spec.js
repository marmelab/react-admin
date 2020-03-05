import React from 'react';
import assert from 'assert';
import { render, cleanup } from '@testing-library/react';
import { DateField } from './DateField';

describe('<DateField />', () => {
    afterEach(cleanup);

    it('should return null when the record is not set', () => {
        const { container } = render(<DateField source="foo" />);
        assert.equal(container.firstChild, null);
    });

    it('should return null when the record has no value for the source', () => {
        const { container } = render(<DateField record={{}} source="foo" />);
        assert.equal(container.firstChild, null);
    });

    it('should render a date', () => {
        const { queryByText } = render(
            <DateField
                record={{ foo: new Date('2017-04-23') }}
                source="foo"
                locales="en-US"
            />
        );

        const date = new Date('2017-04-23').toLocaleDateString('en-US');
        assert.notEqual(queryByText(date), null);
    });

    it('should render a date and time when the showtime prop is passed', () => {
        const { queryByText } = render(
            <DateField
                record={{ foo: new Date('2017-04-23 23:05') }}
                showTime
                source="foo"
                locales="en-US"
            />
        );

        const date = new Date('2017-04-23 23:05').toLocaleString('en-US');
        assert.notEqual(queryByText(date), null);
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
                record={{ foo: date }}
                source="foo"
                locales="en-US"
                options={options}
            />
        );

        assert.notEqual(
            queryByText(date.toLocaleDateString('en-US', options)),
            null
        );
    });

    it('should use the locales props as an argument to toLocaleString', () => {
        const { queryByText } = render(
            <DateField
                record={{ foo: new Date('2017-04-23') }}
                source="foo"
                locales="fr-FR"
            />
        );

        const date = new Date('2017-04-23').toLocaleDateString('fr-FR');
        assert.notEqual(queryByText(date), null);
    });

    it('should use custom className', () => {
        const { container } = render(
            <DateField
                record={{ foo: new Date('01/01/2016') }}
                source="foo"
                locales="en-US"
                className="foo"
            />
        );

        assert.ok(container.firstChild.classList.contains('foo'));
    });

    it('should handle deep fields', () => {
        const { queryByText } = render(
            <DateField
                record={{ foo: { bar: new Date('01/01/2016') } }}
                source="foo.bar"
                locales="en-US"
            />
        );

        const date = new Date('1/1/2016').toLocaleDateString('en-US');
        assert.notEqual(queryByText(date), null);
    });

    it('should render the emptyText when value is null', () => {
        const { queryByText } = render(
            <DateField
                record={{ foo: null }}
                source="foo"
                locales="fr-FR"
                emptyText="NA"
            />
        );
        assert.notEqual(queryByText('NA'), null);
    });
});
