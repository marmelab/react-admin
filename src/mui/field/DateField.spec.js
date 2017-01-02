import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import DateField from './DateField';

describe('<DateField />', () => {
    it('should return null when the record is not set', () => assert.equal(
        shallow(<DateField source="foo" />).html(),
        null,
    ));

    it('should return null when the record has no value for the source', () => assert.equal(
        shallow(<DateField record={{}} source="foo" />).html(),
        null,
    ));

    it('should render a date', () => assert.equal(
        shallow(<DateField record={{ foo: new Date('01/01/2016') }} source="foo" locales="en-US" />).html(),
        '<span>1/1/2016</span>',
    ));

    it('should pass the options prop to Intl.DateTimeFormat', () => assert.equal(
        shallow(<DateField record={{ foo: new Date('01/01/2016') }} source="foo" locales="en-US" options={{
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }} />).html(),
        '<span>Friday, January 1, 2016</span>',
    ));

    it('should use the locales props as an argument to Intl.DateTimeFormat', () => assert.equal(
        shallow(<DateField record={{ foo: new Date('01/01/2016') }} source="foo" locales="fr-FR" />).html(),
        '<span>01/01/2016</span>',
    ));

    it('should use custom styles passed as an elStyle prop', () => assert.equal(
        shallow(<DateField record={{ foo: new Date('01/01/2016') }} source="foo" locales="en-US" elStyle={{ margin: 1 }} />).html(),
        '<span style="margin:1px;">1/1/2016</span>',
    ));

    it('should handle deep fields', () => assert.equal(
        shallow(<DateField record={{ foo: { bar: new Date('01/01/2016') } }} source="foo.bar" locales="en-US" />).html(),
        '<span>1/1/2016</span>',
    ));
});
