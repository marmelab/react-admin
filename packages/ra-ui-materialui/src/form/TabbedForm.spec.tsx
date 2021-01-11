import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
    renderWithRedux,
    SaveContextProvider,
    SideEffectContextProvider,
} from 'ra-core';

import TabbedForm, { findTabsWithErrors } from './TabbedForm';
import FormTab from './FormTab';

describe('<TabbedForm />', () => {
    const saveContextValue = { save: jest.fn(), saving: false };
    const sideEffectValue = {};

    it('should display the tabs', () => {
        const { queryAllByRole } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </MemoryRouter>
        );

        const tabs = queryAllByRole('tab');
        expect(tabs.length).toEqual(2);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const Toolbar = ({ submitOnEnter }: any) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { queryByText, rerender } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm submitOnEnter={false} toolbar={<Toolbar />}>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </MemoryRouter>
        );

        expect(queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <MemoryRouter initialEntries={['/']}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm submitOnEnter toolbar={<Toolbar />}>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </MemoryRouter>
        );

        expect(queryByText('submitOnEnter: true')).not.toBeNull();
    });
});
