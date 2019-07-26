import { render, cleanup } from 'react-testing-library';
import React, { createElement } from 'react';
import { MemoryRouter } from 'react-router';

import { TabbedForm, findTabsWithErrors } from './TabbedForm';
import FormTab from './FormTab';

const translate = label => label;

describe('<TabbedForm />', () => {
    afterEach(cleanup);

    it('should display the tabs', () => {
        const { queryAllByRole } = render(
            <MemoryRouter initialEntries={['/']}>
                <TabbedForm
                    location={{}}
                    match={{}}
                    translate={translate}
                    tabsWithErrors={[]}
                >
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedForm>
            </MemoryRouter>
        );

        const tabs = queryAllByRole('tab');
        expect(tabs.length).toEqual(2);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const Toolbar = ({ submitOnEnter }) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { queryByText, rerender } = render(
            <TabbedForm
                location={{}}
                match={{}}
                translate={translate}
                submitOnEnter={false}
                handleSubmit={handleSubmit}
                tabsWithErrors={[]}
                toolbar={<Toolbar />}
            />
        );

        expect(queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <TabbedForm
                location={{}}
                match={{}}
                translate={translate}
                submitOnEnter
                handleSubmit={handleSubmit}
                tabsWithErrors={[]}
                toolbar={<Toolbar />}
            />
        );

        expect(queryByText('submitOnEnter: true')).not.toBeNull();
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
            expect(tabs).toEqual(['tab1', 'tab3']);
        });
    });
});
