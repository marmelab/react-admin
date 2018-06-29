import assert from 'assert';
import { shallow } from 'enzyme';
import React, { createElement } from 'react';

import { TabbedForm, findTabsWithErrors } from './TabbedForm';
import FormTab from './FormTab';

const translate = label => label;
const muiTheme = { textField: { errorColor: 'red' } };

describe('<TabbedForm />', () => {
    it('should display <Toolbar />', () => {
        const wrapper = shallow(
            <TabbedForm
                location={{}}
                match={{}}
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            >
                <FormTab />
                <FormTab />
            </TabbedForm>
        );

        const toolbar = wrapper.find('WithStyles(Toolbar)');
        assert.equal(toolbar.length, 1);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const wrapper1 = shallow(
            <TabbedForm
                location={{}}
                match={{}}
                translate={translate}
                submitOnEnter={false}
                handleSubmit={handleSubmit}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            />
        );
        const button1 = wrapper1.find('WithStyles(Toolbar)');
        assert.equal(button1.prop('submitOnEnter'), false);

        const wrapper2 = shallow(
            <TabbedForm
                location={{}}
                match={{}}
                translate={translate}
                submitOnEnter
                handleSubmit={handleSubmit}
                muiTheme={muiTheme}
                tabsWithErrors={[]}
            />
        );
        const button2 = wrapper2.find('WithStyles(Toolbar)');
        assert.strictEqual(button2.prop('submitOnEnter'), true);
    });

    it('should set the style of an inactive Tab button with errors', () => {
        const wrapper = shallow(
            <TabbedForm
                location={{ pathname: '/posts/12' }}
                match={{ url: '/posts/12' }}
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={['tab2']}
                classes={{ errorTabButton: 'error' }}
            >
                <FormTab label="tab1" />
                <FormTab label="tab2" />
            </TabbedForm>
        );
        const tabs = wrapper.find('WithStyles(Tab)');
        const tab1 = tabs.at(0);
        const tab2 = tabs.at(1);

        assert.equal(tab1.prop('className'), 'form-tab');
        assert.equal(tab2.prop('className'), 'form-tab error');
    });

    it('should not set the style of an active Tab button with errors', () => {
        const wrapper = shallow(
            <TabbedForm
                location={{ pathname: '/posts/12' }}
                match={{ url: '/posts/12' }}
                translate={translate}
                muiTheme={muiTheme}
                tabsWithErrors={['tab1']}
                classes={{ errorTabButton: 'error' }}
            >
                <FormTab label="tab1" />
                <FormTab label="tab2" />
            </TabbedForm>
        );
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
