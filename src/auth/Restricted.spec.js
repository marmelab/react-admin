import React from 'react';
import assert from 'assert';
import { shallow, render } from 'enzyme';
import sinon from 'sinon';

import { Restricted } from './Restricted';

describe('<Restricted>', () => {
    const Foo = () => <div>Foo</div>;
    it('should call userCheck on mount', () => {
        const userCheck = sinon.spy();
        shallow(
            <Restricted userCheck={userCheck}>
                <Foo />
            </Restricted>,
            { lifecycleExperimental: true }
        );
        assert(userCheck.calledOnce);
    });
    it('should call userCheck on update', () => {
        const userCheck = sinon.spy();
        const wrapper = shallow(
            <Restricted userCheck={userCheck}>
                <Foo />
            </Restricted>,
            { lifecycleExperimental: true }
        );
        wrapper.setProps({ location: { pathname: 'foo' }, userCheck });
        assert(userCheck.calledTwice);
    });
    it('should render its child by default', () => {
        const userCheck = sinon.stub();
        const wrapper = render(
            <Restricted userCheck={userCheck}>
                <Foo />
            </Restricted>
        );
        assert.equal(wrapper.html(), '<div>Foo</div>');
    });
});
