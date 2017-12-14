import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { BooleanField } from './BooleanField';

describe('<BooleanField />', () => {
    test('should display tick if value is true', () =>
        assert.ok(
            shallow(
                <BooleanField record={{ published: true }} source="published" />
            ).is('pure(Done)')
        ));

    test('should display cross if value is false', () =>
        assert.ok(
            shallow(
                <BooleanField
                    record={{ published: false }}
                    source="published"
                />
            ).is('pure(Clear)')
        ));

    test('should not display anything if value is null', () =>
        assert.ok(
            shallow(
                <BooleanField record={{ published: null }} source="published" />
            ).is('span')
        ));

    test('should use custom className', () =>
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

    test('should handle deep fields', () =>
        assert.ok(
            shallow(
                <BooleanField
                    record={{ foo: { bar: true } }}
                    source="foo.bar"
                />
            ).is('pure(Done)')
        ));
});
