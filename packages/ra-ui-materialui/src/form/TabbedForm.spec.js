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

        const toolbar = wrapper.find('WithTheme(WithWidth(Toolbar))');
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
        const button1 = wrapper1.find('WithTheme(WithWidth(Toolbar))');
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
        const button2 = wrapper2.find('WithTheme(WithWidth(Toolbar))');
        assert.strictEqual(button2.prop('submitOnEnter'), true);
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
