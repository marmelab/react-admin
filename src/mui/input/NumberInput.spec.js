import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import NumberInput from './NumberInput';

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
            <NumberInput {...defaultProps} input={{ value: 'hello' }} />
        );
        const TextFieldElement = wrapper.find('TextField');
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('value'), 'hello');
        assert.equal(TextFieldElement.prop('type'), 'number');
    });

    describe('onChange event', () => {
        it('should be customizable via the `onChange` prop', () => {
            const onChange = sinon.spy();

            const props = { ...defaultProps };
            const wrapper = shallow(
                <NumberInput {...props} onChange={onChange} />
            );

            wrapper.find('TextField').simulate('change', 3);
            assert.deepEqual(onChange.args, [[3]]);
        });

        it('should keep calling redux-form original event', () => {
            const onChange = sinon.spy();

            const wrapper = shallow(
                <NumberInput {...defaultProps} input={{ value: 2, onChange }} />
            );
            wrapper.find('TextField').simulate('change', 3);
            assert.deepEqual(onChange.args, [[3]]);
        });
    });

    describe('onFocus event', () => {
        it('should be customizable via the `onFocus` prop', () => {
            const onFocus = sinon.spy();

            const props = { ...defaultProps };
            const wrapper = shallow(
                <NumberInput {...props} onFocus={onFocus} />
            );

            wrapper.find('TextField').simulate('focus', 3);
            assert.deepEqual(onFocus.args, [[3]]);
        });

        it('should keep calling redux-form original event', () => {
            const onFocus = sinon.spy();

            const wrapper = shallow(
                <NumberInput {...defaultProps} input={{ value: 2, onFocus }} />
            );
            wrapper.find('TextField').simulate('focus', 3);
            assert.deepEqual(onFocus.args, [[3]]);
        });
    });

    describe('onBlur event', () => {
        it('should be customizable via the `onBlur` prop', () => {
            const onBlur = sinon.spy();

            const props = { ...defaultProps };
            const wrapper = shallow(<NumberInput {...props} onBlur={onBlur} />);

            wrapper.find('TextField').simulate('blur', 3);
            assert.deepEqual(onBlur.args, [[3]]);
        });

        it('should keep calling redux-form original event', () => {
            const onBlur = sinon.spy();

            const props = {
                ...defaultProps,
                input: {
                    ...defaultProps.input,
                    onBlur,
                },
            };

            const wrapper = shallow(<NumberInput {...props} />);
            wrapper.find('TextField').simulate('blur', 3);
            assert.deepEqual(onBlur.args, [[3]]);
        });

        it('should cast value as a numeric one', () => {
            const onChange = sinon.spy();
            const wrapper = shallow(
                <NumberInput
                    {...defaultProps}
                    input={{
                        value: '2',
                        onBlur: () => {},
                        onChange,
                    }}
                />
            );

            const TextFieldElement = wrapper.find('TextField').first();
            TextFieldElement.simulate('blur');
            assert.deepEqual(onChange.args, [[2]]);
        });
    });
});
