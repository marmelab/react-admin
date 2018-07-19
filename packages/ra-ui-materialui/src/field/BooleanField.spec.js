import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { BooleanField } from './BooleanField';

describe('<BooleanField />', () => {
    it('should display tick if value is true', () => {
        const wrapper = shallow(
            <BooleanField record={{ published: true }} source="published" />
        );
        assert.ok(wrapper.first().is('WithStyles(Typography)'));
        assert.equal(wrapper.first().find('pure(Done)').length, 1);
    });

    it('should display cross if value is false', () => {
        const wrapper = shallow(
            <BooleanField record={{ published: false }} source="published" />
        );

        assert.ok(wrapper.first().is('WithStyles(Typography)'));
        assert.equal(wrapper.first().find('pure(Clear)').length, 1);
    });

    it('should not display anything if value is null', () => {
        const wrapper = shallow(
            <BooleanField record={{ published: null }} source="published" />
        );

        assert.equal(wrapper.first().children().length, 0);
    });

    it('should use custom className', () =>
        assert.deepEqual(
            shallow(
                <BooleanField
                    record={{ foo: true }}
                    source="foo"
                    className="foo"
                />
            ).prop('className'),
            'foo'
        ));

    it('should handle deep fields', () => {
        const wrapper = shallow(
            <BooleanField record={{ foo: { bar: true } }} source="foo.bar" />
        );
        assert.ok(wrapper.first().is('WithStyles(Typography)'));
        assert.equal(wrapper.first().find('pure(Done)').length, 1);
    });
});
