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

    it('should render a date', () => {
        const wrapper = shallow(
            <DateField
                record={{ foo: new Date('2017-04-23') }}
                source="foo"
                locales="en-US"
            />
        );

        assert.equal(
            wrapper.children().text(),
            new Date('2017-04-23').toLocaleDateString('en-US')
        );
    });

    it('should render a date and time when the showtime prop is passed', () => {
        const wrapper = shallow(
            <DateField
                record={{ foo: new Date('2017-04-23 23:05') }}
                showTime
                source="foo"
                locales="en-US"
            />
        );

        assert.equal(
            wrapper.children().text(),
            new Date('2017-04-23 23:05').toLocaleString('en-US')
        );
    });

    it('should pass the options prop to toLocaleString', () => {
        const date = new Date('2017-04-23');
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        const wrapper = shallow(
            <DateField
                record={{ foo: date }}
                source="foo"
                locales="en-US"
                options={options}
            />
        );

        return assert.equal(
            wrapper.children().text(),
            date.toLocaleDateString('en-US', options)
        );
    });

    it('should use the locales props as an argument to toLocaleString', () => {
        const wrapper = shallow(
            <DateField
                record={{ foo: new Date('2017-04-23') }}
                source="foo"
                locales="fr-FR"
            />
        );

        assert.equal(
            wrapper.children().text(),
            new Date('2017-04-23').toLocaleDateString('fr-FR')
        );
    });

    it('should use custom className', () => {
        const wrapper = shallow(
            <DateField
                record={{ foo: new Date('01/01/2016') }}
                source="foo"
                locales="en-US"
                className="foo"
            />
        );

        assert.ok(wrapper.is('.foo'));
    });

    it('should handle deep fields', () => {
        const wrapper = shallow(
            <DateField
                record={{ foo: { bar: new Date('01/01/2016') } }}
                source="foo.bar"
                locales="en-US"
            />
        );

        assert.equal(
            wrapper.children().text(),
            new Date('1/1/2016').toLocaleDateString('en-US')
        );
    });
});
