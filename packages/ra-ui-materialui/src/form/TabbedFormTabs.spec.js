import React from 'react';
import { render, cleanup } from '@testing-library/react';

import TabbedFormTabs from './TabbedFormTabs';
import FormTab from './FormTab';
import { MemoryRouter } from 'react-router-dom';

describe('<TabbedFormTabs />', () => {
    afterEach(cleanup);

    it('should set the style of an inactive Tab button with errors', () => {
        const { getAllByRole } = render(
            <MemoryRouter initialEntries={['/posts/12']} initialIndex={0}>
                <TabbedFormTabs
                    classes={{ errorTabButton: 'error' }}
                    url="/posts/12"
                    tabsWithErrors={['tab2']}
                >
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedFormTabs>
            </MemoryRouter>
        );

        const tabs = getAllByRole('tab');
        expect(tabs[0].classList.contains('error')).toEqual(false);
        expect(tabs[1].classList.contains('error')).toEqual(true);
    });

    it('should not set the style of an active Tab button with errors', () => {
        const { getAllByRole } = render(
            <MemoryRouter initialEntries={['/posts/12']} initialIndex={0}>
                <TabbedFormTabs
                    classes={{ errorTabButton: 'error' }}
                    url="/posts/12"
                    tabsWithErrors={['tab1']}
                >
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedFormTabs>
            </MemoryRouter>
        );

        const tabs = getAllByRole('tab');
        expect(tabs[0].classList.contains('error')).toEqual(false);
        expect(tabs[1].classList.contains('error')).toEqual(false);
    });
});
