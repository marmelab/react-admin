import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { SwitchPermissionsComponent as SwitchPermissions } from './SwitchPermissions';
import Permission from './Permission';
import FormField from '../mui/form/FormField';

describe('<SwitchPermissions />', () => {
    it('filter falsy children', () => {
        const condition = false;
        const authClient = sinon.spy(() => Promise.resolve('admin'));

        const wrapper = shallow(
            <SwitchPermissions authClient={authClient}>
                <Permission value="admin">
                    <span />
                    {condition && <span />}
                    {condition ? <span /> : null}
                </Permission>
                {condition && <Permission value="admin" />}
                {condition ? <Permission value="admin" /> : null}
            </SwitchPermissions>,
            { lifecycleExperimental: true }
        );

        // We need a timeout because of the authClient returning a promise
        return new Promise(resolve => {
            setTimeout(() => {
                assert.equal(wrapper.find(FormField).length, 1);
                resolve();
            }, 100);
        });
    });
});
