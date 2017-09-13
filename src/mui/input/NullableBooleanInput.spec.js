import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { NullableBooleanInput } from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    const defaultProps = {
        input: {},
        meta: {},
        translate: x => x,
    };

    it('should give three different choices for true, false or unknown', () => {
        const wrapper = shallow(
            <NullableBooleanInput source="foo" {...defaultProps} />
        );
        const choices = wrapper.find('getContext(SelectInput)').prop('choices');
        assert.deepEqual(choices, [
            { id: null, name: '' },
            { id: false, name: 'aor.boolean.false' },
            { id: true, name: 'aor.boolean.true' },
        ]);
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <NullableBooleanInput
                    source="foo"
                    {...defaultProps}
                    meta={{ touched: false }}
                />
            );
            const SelectInputElement = wrapper.find('getContext(SelectInput)');
            assert.equal(SelectInputElement.prop('errorText'), undefined);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <NullableBooleanInput
                    source="foo"
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const SelectInputElement = wrapper.find('getContext(SelectInput)');
            assert.equal(SelectInputElement.prop('errorText'), undefined);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <NullableBooleanInput
                    source="foo"
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const SelectInputElement = wrapper.find('getContext(SelectInput)');
            assert.deepEqual(SelectInputElement.prop('meta'), {
                touched: true,
                error: 'Required field.',
            });
        });
    });
});
