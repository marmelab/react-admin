import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { BooleanField } from './BooleanField';

describe('<BooleanField />', () => {
    it('should display tick if value is true', () =>
        assert.ok(
            shallow(
                <BooleanField record={{ published: true }} source="published" />
            ).is('pure(Done)')
        ));

    it('should display cross if value is false', () =>
        assert.ok(
            shallow(
                <BooleanField
                    record={{ published: false }}
                    source="published"
                />
            ).is('pure(Clear)')
        ));

    it('should not display anything if value is null', () =>
        assert.ok(
            shallow(
                <BooleanField record={{ published: null }} source="published" />
            ).is('span')
        ));

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

    it('should handle deep fields', () =>
        assert.ok(
            shallow(
                <BooleanField
                    record={{ foo: { bar: true } }}
                    source="foo.bar"
                />
            ).is('pure(Done)')
        ));
});
