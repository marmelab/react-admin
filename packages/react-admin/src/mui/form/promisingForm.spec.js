import { shallow } from 'enzyme';
import React from 'react';

import promisingForm from './promisingForm';

describe('promisingForm', () => {
    it('should transform handleSubmit to return a Promise', () => {
        const Form = promisingForm('form');
        const onSubmit = jest.fn();
        const dispatch = jest.fn(({ payload: { resolve } }) => {
            resolve('ok');
        });
        const reduxFormSubmit = callback => formValues =>
            callback(formValues, dispatch);

        const wrapper = shallow(<Form handleSubmit={reduxFormSubmit} />);
        expect(wrapper.prop('handleSubmit')).not.toBe(reduxFormSubmit);
        const result = wrapper.prop('handleSubmit')(onSubmit)();
        // Check if it is a Promise
        expect(Promise.resolve(result) === result);
        expect(onSubmit).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'RA/FORM_SUBMIT',
            })
        );
        return expect(result).resolves.toBe('ok');
    });
});
