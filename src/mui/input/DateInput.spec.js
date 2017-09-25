import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import DateInput, { datify } from './DateInput';

describe('DateInput .datify', () => {
    it('should return null if there is no input', () => {
        assert.equal(datify(), null);
        assert.equal(datify(null), null);
        assert.equal(datify(''), null);
    });

    it('should throw an error if given input is not a recognizable date', () => {
        try {
            datify('Hello world');
        } catch (e) {
            return;
        }

        assert.fail();
    });

    it('should return a date Object whichever non-null input is given', () => {
        assert.deepEqual(
            datify(new Date('2010-05-01')),
            new Date('2010-05-01')
        );
        assert.deepEqual(datify('2010-05-01'), new Date('2010-05-01'));
    });
});

describe('<DateInput />', () => {
    it('should render a localized <DatePicker />', () => {
        const input = { value: null };
        const wrapper = shallow(
            <DateInput
                source="foo"
                meta={{}}
                input={input}
                options={{ locale: 'de-DE' }}
            />
        );

        const datePicker = wrapper.find('DatePicker');
        assert.equal(datePicker.length, 1);
        assert.equal(datePicker.prop('locale'), 'de-DE');
    });

    it('should call props `input.onChange` method when changed', () => {
        const input = { value: null, onChange: sinon.spy(), onBlur: () => {} };
        const wrapper = shallow(
            <DateInput source="foo" input={input} meta={{}} locale="de-DE" />
        );

        wrapper
            .find('DatePicker')
            .simulate('change', null, new Date('2010-01-04'));
        assert.deepEqual(input.onChange.args, [['2010-01-04T00:00:00.000Z']]);
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <DateInput
                    source="foo"
                    input={{ value: null }}
                    meta={{ touched: false }}
                />
            );
            const DatePicker = wrapper.find('DatePicker');
            assert.equal(DatePicker.prop('errorText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <DateInput
                    source="foo"
                    input={{ value: null }}
                    meta={{ touched: true, error: false }}
                />
            );
            const DatePicker = wrapper.find('DatePicker');
            assert.equal(DatePicker.prop('errorText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <DateInput
                    source="foo"
                    input={{ value: null }}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const DatePicker = wrapper.find('DatePicker');
            assert.equal(DatePicker.prop('errorText'), 'Required field.');
        });
    });
});
