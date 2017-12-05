import React from 'react';
import { shallow, render } from 'enzyme';
import { html } from 'cheerio';

import { Restricted } from './Restricted';

describe('<Restricted>', () => {
    const Foo = () => <div>Foo</div>;
    it('should call userCheck on mount', () => {
        const userCheck = jest.fn();
        shallow(
            <Restricted userCheck={userCheck}>
                <Foo />
            </Restricted>
        );
        expect(userCheck.mock.calls.length).toEqual(1);
    });
    it('should call userCheck on update', () => {
        const userCheck = jest.fn();
        const wrapper = shallow(
            <Restricted userCheck={userCheck}>
                <Foo />
            </Restricted>
        );
        wrapper.setProps({ location: { pathname: 'foo' }, userCheck });
        expect(userCheck.mock.calls.length).toEqual(2);
    });
    it('should render its child by default', () => {
        const userCheck = jest.fn();
        const wrapper = render(
            <Restricted userCheck={userCheck}>
                <Foo />
            </Restricted>
        );
        expect(html(wrapper)).toEqual('<div>Foo</div>');
    });
});
