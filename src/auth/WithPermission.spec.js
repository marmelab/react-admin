import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { WithPermissionComponent as WithPermission } from './WithPermission';

describe('<WithPermission />', () => {
    it('filter falsy children', () => {
        const condition = false;
        const authClient = sinon.spy(() => Promise.resolve('admin'));

        const wrapper = shallow(
            <WithPermission value="admin" authClient={authClient}>
                <span source="foo" />
                {condition && <span source="foo1" />}
                {condition ? <span source="foo2" /> : null}
            </WithPermission>
        );

        // We need a timeout because of the authClient returning a promise
        return new Promise(resolve => {
            setTimeout(() => {
                assert.equal(wrapper.find('span[source]').length, 1);
                resolve();
            }, 100);
        });
    });
});
