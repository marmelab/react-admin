import assert from 'assert';
import { shallow } from 'enzyme';
import React, { createElement } from 'react';

import { TabbedForm, findTabsWithErrors } from './TabbedForm';
import FormTab from './FormTab';

const translate = label => label;
const muiTheme = { textField: { errorColor: 'red' } };

describe('<TabbedForm />', () => {
    it('should render tabs', () => {
        const wrapper = shallow(
            <TabbedForm
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            >
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
            <TabbedForm
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            />
        );
        const button = wrapper.find('Toolbar');
        assert.equal(button.length, 1);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const wrapper1 = shallow(
            <TabbedForm
                translate={translate}
                submitOnEnter={false}
                handleSubmit={handleSubmit}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            />
        );
        const button1 = wrapper1.find('Toolbar');
        assert.equal(button1.prop('submitOnEnter'), false);

        const wrapper2 = shallow(
            <TabbedForm
                translate={translate}
                submitOnEnter
                handleSubmit={handleSubmit}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            />
        );
        const button2 = wrapper2.find('Toolbar');
        assert.strictEqual(button2.prop('submitOnEnter'), true);
    });

    it('should set the style of an inactive Tab button with errors', () => {
        const wrapper = shallow(
            <TabbedForm
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={['tab2']}
            >
                <FormTab label="tab1" />
                <FormTab label="tab2" />
            </TabbedForm>
        );
        const tabs = wrapper.find('Tab');
        const tab1 = tabs.at(0);
        const tab2 = tabs.at(1);

        assert.deepEqual(tab1.prop('buttonStyle'), null);
        assert.deepEqual(tab2.prop('buttonStyle'), {
            color: muiTheme.textField.errorColor,
        });
    });

    it('should not set the style of an active Tab button with errors', () => {
        const wrapper = shallow(
            <TabbedForm
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={['tab1']}
            >
                <FormTab label="tab1" />
                <FormTab label="tab2" />
            </TabbedForm>
        );
        const tabs = wrapper.find('Tab');
        const tab1 = tabs.at(0);
        const tab2 = tabs.at(1);

        assert.deepEqual(tab1.prop('buttonStyle'), null);
        assert.deepEqual(tab2.prop('buttonStyle'), null);
    });

    describe('findTabsWithErrors', () => {
        it('should find the tabs containing errors', () => {
            const collectErrors = () => ({
                field1: 'required',
                field5: 'required',
            });
            const state = {};
            const props = {
                children: [
                    createElement(
                        FormTab,
                        { label: 'tab1' },
                        createElement('input', { source: 'field1' }),
                        createElement('input', { source: 'field2' })
                    ),
                    createElement(
                        FormTab,
                        { label: 'tab2' },
                        createElement('input', { source: 'field3' }),
                        createElement('input', { source: 'field4' })
                    ),
                    createElement(
                        FormTab,
                        { label: 'tab3' },
                        createElement('input', { source: 'field5' }),
                        createElement('input', { source: 'field6' })
                    ),
                ],
            };

            const tabs = findTabsWithErrors(state, props, collectErrors);
            assert.deepEqual(tabs, ['tab1', 'tab3']);
        });
    });
});
