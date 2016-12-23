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
        shallow(<DateField record={{ foo: new Date('01/01/2016') }} source="foo" />).html(),
        '<span>2016-01-01</span>',
    ));

    it('should use custom styles passed as an elStyle prop', () => assert.equal(
        shallow(<DateField record={{ foo: new Date('01/01/2016') }} source="foo" elStyle={{ margin: 1 }} />).html(),
        '<span style="margin:1px;">2016-01-01</span>',
    ));

    it('should handle deep fields', () => assert.equal(
        shallow(<DateField record={{ foo: { bar: new Date('01/01/2016') } }} source="foo.bar" />).html(),
        '<span>2016-01-01</span>',
    ));
});
