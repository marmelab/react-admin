import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { NumberInput } from './NumberInput';

describe('<NumberInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {
            onBlur: () => {},
            onChange: () => {},
            onFocus: () => {},
        },
        onChange: () => {},
        onBlur: () => {},
        onFocus: () => {},
    };

    it('should use a mui TextField', () => {
        const wrapper = shallow(
            <NumberInput {...defaultProps} input={{ value: 12 }} />
        );
        const TextFieldElement = wrapper.find('TextField');
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('value'), 12);
        assert.equal(TextFieldElement.prop('type'), 'number');
    });

    describe('onChange event', () => {
        it('should be customizable via the `onChange` prop', () => {
            const onChange = jest.fn();

            const props = { ...defaultProps };
            const wrapper = shallow(
                <NumberInput {...props} onChange={onChange} />
            );

            wrapper
                .find('TextField')
                .simulate('change', { target: { value: 3 } });
            assert.equal(onChange.mock.calls[0][0], 3);
        });

        it('should keep calling redux-form original event', () => {
            const onChange = jest.fn();

            const wrapper = shallow(
                <NumberInput {...defaultProps} input={{ value: 2, onChange }} />
            );
            wrapper
                .find('TextField')
                .simulate('change', { target: { value: 3 } });
            assert.equal(onChange.mock.calls[0][0], 3);
        });

        it('should cast value as a numeric one', () => {
            const onChange = jest.fn();
            const wrapper = shallow(
                <NumberInput
                    {...defaultProps}
                    input={{ value: '2', onChange }}
                />
            );

            wrapper
                .find('TextField')
                .simulate('change', { target: { value: '2' } });
            assert.equal(onChange.mock.calls[0][0], 2);
        });
    });

    describe('onFocus event', () => {
        it('should be customizable via the `onFocus` prop', () => {
            const onFocus = jest.fn();

            const props = { ...defaultProps };
            const wrapper = shallow(
                <NumberInput {...props} onFocus={onFocus} />
            );

            wrapper.find('TextField').simulate('focus', 3);
            assert.equal(onFocus.mock.calls[0][0], 3);
        });

        it('should keep calling redux-form original event', () => {
            const onFocus = jest.fn();

            const wrapper = shallow(
                <NumberInput {...defaultProps} input={{ value: 2, onFocus }} />
            );
            wrapper
                .find('TextField')
                .simulate('focus', { target: { value: 3 } });
            assert.deepEqual(onFocus.mock.calls[0][0], {
                target: { value: 3 },
            });
        });
    });

    describe('onBlur event', () => {
        it('should be customizable via the `onBlur` prop', () => {
            const onBlur = jest.fn();

            const props = { ...defaultProps };
            const wrapper = shallow(<NumberInput {...props} onBlur={onBlur} />);

            wrapper
                .find('TextField')
                .simulate('blur', { target: { value: 3 } });
            assert.equal(onBlur.mock.calls[0][0], 3);
        });

        it('should keep calling redux-form original event', () => {
            const onBlur = jest.fn();

            const props = {
                ...defaultProps,
                input: {
                    ...defaultProps.input,
                    onBlur,
                },
            };

            const wrapper = shallow(<NumberInput {...props} />);
            wrapper
                .find('TextField')
                .simulate('blur', { target: { value: 3 } });
            assert.equal(onBlur.mock.calls[0][0], 3);
        });

        it('should cast value as a numeric one', () => {
            const onBlur = jest.fn();
            const wrapper = shallow(
                <NumberInput
                    {...defaultProps}
                    input={{
                        value: '2',
                        onBlur,
                    }}
                />
            );

            wrapper
                .find('TextField')
                .simulate('blur', { target: { value: '2' } });
            assert.equal(onBlur.mock.calls[0][0], 2);
        });
    });
});
