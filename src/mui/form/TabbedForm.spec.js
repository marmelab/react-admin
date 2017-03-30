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

    it('should not pass handleSubmit to the form and pass submitOnEnter and handleSumit to <Toolbar /> when submitOnEnter is false', () => {
        const handleSubmit = () => {};
        const wrapper = shallow(
            <TabbedForm translate={translate} submitOnEnter={false} handleSubmit={handleSubmit}>
            </TabbedForm>
        );
        const form = wrapper.find('form');
        assert.notStrictEqual(form.prop('onSubmit'), handleSubmit);

        const button = wrapper.find('Toolbar');
        assert.equal(button.prop('submitOnEnter'), true);
        assert.equal(button.prop('handleSubmit'), handleSubmit);
    });

    it('should pass handleSubmit to the form and not pass submitOnEnter and handleSumit to <Toolbar /> when submitOnEnter is true', () => {
        const handleSubmit = () => {};
        const wrapper = shallow(
            <TabbedForm translate={translate} submitOnEnter={true} handleSubmit={handleSubmit}>
            </TabbedForm>
        );
        const form = wrapper.find('form');
        assert.strictEqual(form.prop('onSubmit'), handleSubmit);

        const button = wrapper.find('Toolbar');
        assert.strictEqual(button.prop('submitOnEnter'), undefined);
        assert.strictEqual(button.prop('handleSubmit'), undefined);
    });
});
