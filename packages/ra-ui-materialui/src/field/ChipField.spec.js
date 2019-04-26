import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { ChipField } from './ChipField';

describe('<ChipField />', () => {
    it('should display the record value added as source', () =>
        assert.equal(
            shallow(
                <ChipField
                    className="className"
                    classes={{}}
                    source="name"
                    record={{ name: 'foo' }}
                />
            ).prop('label'),
            'foo'
        ));

    it('should not display any label added as props', () =>
        assert.equal(
            shallow(
                <ChipField
                    className="className"
                    classes={{}}
                    source="name"
                    record={{ name: 'foo' }}
                    label="bar"
                />
            ).prop('label'),
            'foo'
        ));
    
    it('should display label returned by formatLabel prop', () =>
        assert.equal(
            shallow(
                <ChipField
                    className="className"
                    classes={{}}
                    source="firstName"
                    record={{ firstName: 'foo', lastName: 'bar' }}
                    formatLabel={record => `${record.firstName} ${record.lastName}`}
                />
            ).prop('label'),
            'foo bar'
        ));
});
