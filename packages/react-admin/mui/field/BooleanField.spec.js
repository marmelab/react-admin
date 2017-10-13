import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { BooleanField } from './BooleanField';

describe('<BooleanField />', () => {
    it('should display tick if value is true', () =>
        assert.ok(
            shallow(
                <BooleanField record={{ published: true }} source="published" />
            ).is('ActionDone')
        ));

    it('should display cross if value is false', () =>
        assert.ok(
            shallow(
                <BooleanField
                    record={{ published: false }}
                    source="published"
                />
            ).is('ContentClear')
        ));

    it('should not display anything if value is null', () =>
        assert.ok(
            shallow(
                <BooleanField record={{ published: null }} source="published" />
            ).is('span')
        ));

    it('should use custom styles passed as an elStyle prop', () =>
        assert.deepEqual(
            shallow(
                <BooleanField
                    record={{ foo: true }}
                    source="foo"
                    elStyle={{ margin: 1 }}
                />
            ).prop('style'),
            { margin: 1 }
        ));

    it('should handle deep fields', () =>
        assert.ok(
            shallow(
                <BooleanField
                    record={{ foo: { bar: true } }}
                    source="foo.bar"
                />
            ).is('ActionDone')
        ));
});
