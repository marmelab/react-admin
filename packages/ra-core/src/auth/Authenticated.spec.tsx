import React from 'react';
import expect from 'expect';
import { shallow, render } from 'enzyme';
import { html } from 'cheerio';

import { Authenticated } from './Authenticated';

describe('<Authenticated>', () => {
    const Foo = () => <div>Foo</div>;
    it('should call userCheck on mount', () => {
        const userCheck = jest.fn();
        shallow(
            <Authenticated location={{}} userCheck={userCheck}>
                <Foo />
            </Authenticated>
        );
        expect(userCheck.mock.calls.length).toEqual(1);
    });
    it('should call userCheck on update', () => {
        const userCheck = jest.fn();
        const wrapper = shallow(
            <Authenticated location={{}} userCheck={userCheck}>
                <Foo />
            </Authenticated>
        );
        wrapper.setProps({ location: { pathname: 'foo' }, userCheck });
        expect(userCheck.mock.calls.length).toEqual(2);
    });
    it('should render its child by default', () => {
        const userCheck = jest.fn();
        const wrapper = render(
            <Authenticated location={{}} userCheck={userCheck}>
                <Foo />
            </Authenticated>
        );
        expect(html(wrapper)).toEqual('<div>Foo</div>');
    });
});
