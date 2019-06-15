import React from 'react';
import { shallow } from 'enzyme';
import assert from 'assert';

import TabbedFormTabs from './TabbedFormTabs';
import FormTab from './FormTab';

describe('<TabbedFormTabs />', () => {
    it('should set the style of an inactive Tab button with errors', () => {
        const wrapper = shallow(
            <TabbedFormTabs
                classes={{ errorTabButton: 'error' }}
                currentLocationPath={'/posts/12'}
                match={{ url: '/posts/12' }}
                tabsWithErrors={['tab2']}
            >
                <FormTab label="tab1" />
                <FormTab label="tab2" />
            </TabbedFormTabs>
        );

        const tabs = wrapper.find(FormTab);
        const tab1 = tabs.at(0);
        const tab2 = tabs.at(1);

        assert.equal(tab1.prop('className'), null);
        assert.equal(tab2.prop('className'), 'error');
    });

    it('should not set the style of an active Tab button with errors', () => {
        const wrapper = shallow(
            <TabbedFormTabs
                classes={{ errorTabButton: 'error' }}
                currentLocationPath={'/posts/12'}
                match={{ url: '/posts/12' }}
                tabsWithErrors={['tab1']}
            >
                <FormTab label="tab1" />
                <FormTab label="tab2" />
            </TabbedFormTabs>
        );

        const tabs = wrapper.find(FormTab);
        const tab1 = tabs.at(0);
        const tab2 = tabs.at(1);

        assert.equal(tab1.prop('className'), null);
        assert.equal(tab2.prop('className'), null);
    });
});
