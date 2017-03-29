import React from 'react';
import assert from 'assert';
import { shallow, render } from 'enzyme';
import sinon from 'sinon';

import { Restricted } from './Restricted';

describe('<Restricted>', () => {
    const Foo = () => <div>Foo</div>;
    it('should call authClient on mount', () => {
        const authClient = sinon.stub().returns(Promise.resolve());
        shallow(<Restricted authClient={authClient}><Foo /></Restricted>, { lifecycleExperimental: true });
        assert(authClient.calledOnce);
    });
    it('should call authClient on update', () => {
        const authClient = sinon.stub().returns(Promise.resolve());
        const wrapper = shallow(<Restricted authClient={authClient}><Foo /></Restricted>, { lifecycleExperimental: true });
        wrapper.setProps({ location: { pathname: 'foo' }, authClient });
        assert(authClient.calledTwice);
    });
    it('should render its child by default', () => {
        const authClient = sinon.stub().returns(Promise.resolve());
        const wrapper = render(<Restricted authClient={authClient}><Foo /></Restricted>);
        assert.equal(wrapper.html(), '<div>Foo</div>');
    });
    it('should not redirect to login when auth client resolves', async () => {
        const authClient = sinon.stub().returns(Promise.resolve());
        const replace = sinon.spy();
        const wrapper = render(<Restricted authClient={authClient} replace={replace} location={{ pathname: 'foo' }}><Foo /></Restricted>);
        // wait for promise to finish
        await new Promise(resolve => setTimeout(resolve, 10));
        assert(!replace.called);
    });
    it('should redirect to login when auth client rejects', async () => {
        const authClient = sinon.stub().returns(Promise.reject());
        const replace = sinon.spy();
        const wrapper = render(<Restricted authClient={authClient} replace={replace} location={{ pathname: 'foo' }}><Foo /></Restricted>);
        // wait for promise to finish
        await new Promise(resolve => setTimeout(resolve, 10));
        assert(replace.calledOnce);
        assert(replace.calledWith({ pathname: '/login', state: { nextPathname: 'foo' } }));
    });
});
