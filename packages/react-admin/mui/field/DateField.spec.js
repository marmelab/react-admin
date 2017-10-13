import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { DateField } from './DateField';

describe('<DateField />', () => {
    it('should return null when the record is not set', () =>
        assert.equal(shallow(<DateField source="foo" />).html(), null));

    it('should return null when the record has no value for the source', () =>
        assert.equal(
            shallow(<DateField record={{}} source="foo" />).html(),
            null
        ));

    it('should render a date', () =>
        assert.equal(
            shallow(
                <DateField
                    record={{ foo: new Date('2017-04-23') }}
                    source="foo"
                    locales="en-US"
                />
            ).html(),
            `<span>${new Date('2017-04-23').toLocaleDateString('en-US')}</span>`
        ));

    it('should render a date and time when the showtime prop is passed', () =>
        assert.equal(
            shallow(
                <DateField
                    record={{ foo: new Date('2017-04-23 23:05') }}
                    showTime
                    source="foo"
                    locales="en-US"
                />
            ).html(),
            `<span>${new Date('2017-04-23 23:05').toLocaleString(
                'en-US'
            )}</span>`
        ));

    it('should pass the options prop to toLocaleString', () => {
        const date = new Date('2017-04-23');
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return assert.equal(
            shallow(
                <DateField
                    record={{ foo: date }}
                    source="foo"
                    locales="en-US"
                    options={options}
                />
            ).html(),
            `<span>${date.toLocaleDateString('en-US', options)}</span>`
        );
    });

    it('should use the locales props as an argument to toLocaleString', () =>
        assert.equal(
            shallow(
                <DateField
                    record={{ foo: new Date('2017-04-23') }}
                    source="foo"
                    locales="fr-FR"
                />
            ).html(),
            `<span>${new Date('2017-04-23').toLocaleDateString('fr-FR')}</span>`
        ));

    it('should use custom styles passed as an elStyle prop', () =>
        assert.equal(
            shallow(
                <DateField
                    record={{ foo: new Date('01/01/2016') }}
                    source="foo"
                    locales="en-US"
                    elStyle={{ margin: 1 }}
                />
            ).html(),
            `<span style="margin:1px;">${new Date(
                '1/1/2016'
            ).toLocaleDateString('en-US')}</span>`
        ));

    it('should handle deep fields', () =>
        assert.equal(
            shallow(
                <DateField
                    record={{ foo: { bar: new Date('01/01/2016') } }}
                    source="foo.bar"
                    locales="en-US"
                />
            ).html(),
            `<span>${new Date('1/1/2016').toLocaleDateString('en-US')}</span>`
        ));
});
