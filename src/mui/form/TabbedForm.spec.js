import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { TabbedForm } from './TabbedForm';
import FormTab from './FormTab';

const translate = (label) => label;

describe('<TabbedForm />', () => {
    it('should render tabs', () => {
        const wrapper = shallow(
            <TabbedForm translate={translate}>
              <FormTab />
              <FormTab />
            </TabbedForm>
        );
        const tabsContainer = wrapper.find('Tabs');
        assert.equal(tabsContainer.length, 1);
        const tabs = wrapper.find('FormTab');
        assert.equal(tabs.length, 2);
    });

    it('should display <Toolbar />', () => {
        const wrapper = shallow(
            <TabbedForm translate={translate}>
            </TabbedForm>
        );
        const button = wrapper.find('Toolbar');
        assert.equal(button.length, 1);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const wrapper1 = shallow(
            <TabbedForm translate={translate} submitOnEnter={false} handleSubmit={handleSubmit}>
            </TabbedForm>
        );
        const button1 = wrapper1.find('Toolbar');
        assert.equal(button1.prop('submitOnEnter'), false);

        const wrapper2 = shallow(
            <TabbedForm translate={translate} submitOnEnter={true} handleSubmit={handleSubmit}>
            </TabbedForm>
        );
        const button2 = wrapper2.find('Toolbar');
        assert.strictEqual(button2.prop('submitOnEnter'), true);
    });
});
