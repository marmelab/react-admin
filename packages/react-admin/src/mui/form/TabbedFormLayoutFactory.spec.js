import assert from 'assert';
import { shallow } from 'enzyme';
import React, { createElement } from 'react';

import { findTabsWithErrors } from './TabbedForm';
import TabbedFormLayoutFactory from './TabbedFormLayoutFactory';
import FormTab from './FormTab';

const translate = label => label;
const muiTheme = { textField: { errorColor: 'red' } };

describe('<TabbedFormLayoutFactory />', () => {
    it('should render tabs', () => {
        const wrapper = shallow(
            <TabbedFormLayoutFactory
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            >
                <FormTab />
                <FormTab />
            </TabbedFormLayoutFactory>
        ).dive();
        const tabsContainer = wrapper.find('WithStyles(Tabs)');
        assert.equal(tabsContainer.length, 1);
        const tabs = wrapper.find('FormTab');
        assert.equal(tabs.length, 1);
    });

    it('should display <Toolbar />', () => {
        const wrapper = shallow(
            <TabbedFormLayoutFactory
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            >
                <FormTab />
                <FormTab />
            </TabbedFormLayoutFactory>
        ).dive();

        const toolbar = wrapper.find('WithStyles(Toolbar)');
        assert.equal(toolbar.length, 1);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const wrapper1 = shallow(
            <TabbedFormLayoutFactory
                translate={translate}
                submitOnEnter={false}
                handleSubmit={handleSubmit}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            />
        ).dive();
        const button1 = wrapper1.find('WithStyles(Toolbar)');
        assert.equal(button1.prop('submitOnEnter'), false);

        const wrapper2 = shallow(
            <TabbedFormLayoutFactory
                translate={translate}
                submitOnEnter
                handleSubmit={handleSubmit}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            />
        ).dive();
        const button2 = wrapper2.find('WithStyles(Toolbar)');
        assert.strictEqual(button2.prop('submitOnEnter'), true);
    });

    it('should set the style of an inactive Tab button with errors', () => {
        const wrapper = shallow(
            <TabbedFormLayoutFactory
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={['tab2']}
                classes={{ errorTabButton: 'error' }}
            >
                <FormTab label="tab1" />
                <FormTab label="tab2" />
            </TabbedFormLayoutFactory>
        ).dive();
        const tabs = wrapper.find('WithStyles(Tab)');
        const tab1 = tabs.at(0);
        const tab2 = tabs.at(1);

        assert.equal(tab1.prop('className'), 'form-tab');
        assert.equal(tab2.prop('className'), 'form-tab error');
    });

    it('should not set the style of an active Tab button with errors', () => {
        const wrapper = shallow(
            <TabbedFormLayoutFactory
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={['tab1']}
                classes={{ errorTabButton: 'error' }}
            >
                <FormTab label="tab1" />
                <FormTab label="tab2" />
            </TabbedFormLayoutFactory>
        ).dive();
        const tabs = wrapper.find('WithStyles(Tab)');
        const tab1 = tabs.at(0);
        const tab2 = tabs.at(1);

        assert.equal(tab1.prop('className'), 'form-tab');
        assert.equal(tab2.prop('className'), 'form-tab');
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
