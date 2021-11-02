import * as React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
    minLength,
    required,
    SaveContextProvider,
    SideEffectContextProvider,
} from 'ra-core';
import { renderWithRedux } from 'ra-test';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isInaccessible, screen, waitFor } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';

import { defaultTheme } from '../defaultTheme';
import { TabbedForm } from './TabbedForm';
import { FormTab } from './FormTab';
import { TextInput } from '../input';

describe('<TabbedForm />', () => {
    const saveContextValue = {
        save: jest.fn(),
        saving: false,
        setOnFailure: jest.fn(),
    };
    const sideEffectValue = {};

    it('should display the tabs', () => {
        renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <SideEffectContextProvider value={sideEffectValue}>
                            <TabbedForm>
                                <FormTab label="tab1" />
                                <FormTab label="tab2" />
                            </TabbedForm>
                        </SideEffectContextProvider>
                    </SaveContextProvider>
                </ThemeProvider>
            </MemoryRouter>
        );

        const tabs = screen.queryAllByRole('tab');
        expect(tabs.length).toEqual(2);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const Toolbar = ({ submitOnEnter }: any) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { rerender } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <SideEffectContextProvider value={sideEffectValue}>
                            <TabbedForm
                                submitOnEnter={false}
                                toolbar={<Toolbar />}
                            >
                                <FormTab label="tab1" />
                                <FormTab label="tab2" />
                            </TabbedForm>
                        </SideEffectContextProvider>
                    </SaveContextProvider>
                </ThemeProvider>
            </MemoryRouter>
        );

        expect(screen.queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <MemoryRouter initialEntries={['/']}>
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <SideEffectContextProvider value={sideEffectValue}>
                            <TabbedForm submitOnEnter toolbar={<Toolbar />}>
                                <FormTab label="tab1" />
                                <FormTab label="tab2" />
                            </TabbedForm>
                        </SideEffectContextProvider>
                    </SaveContextProvider>
                </ThemeProvider>
            </MemoryRouter>
        );

        expect(screen.queryByText('submitOnEnter: true')).not.toBeNull();
    });

    it('should set the style of any Tab button with errors on submit', async () => {
        renderWithRedux(
            <MemoryRouter initialEntries={['/posts/1']} initialIndex={0}>
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <TabbedForm resource="posts">
                            <FormTab label="tab1">
                                <TextInput
                                    source="title"
                                    validate={required()}
                                />
                            </FormTab>
                            <FormTab label="tab2">
                                <TextInput
                                    source="description"
                                    validate={minLength(10)}
                                />
                            </FormTab>
                        </TabbedForm>
                    </SaveContextProvider>
                </ThemeProvider>
            </MemoryRouter>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(screen.getByText('tab2'));
        const input = screen.getByLabelText(
            'resources.posts.fields.description'
        );
        fireEvent.type(input, 'fooooooooo');
        fireEvent.click(screen.getByLabelText('ra.action.save'));

        await waitFor(() => {
            expect(
                tabs[0].classList.contains('RaTabbedForm-errorTabButton')
            ).toEqual(true);
        });
        expect(
            tabs[1].classList.contains('RaTabbedForm-errorTabButton')
        ).toEqual(false);
    });

    it('should sync tabs with location by default', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        renderWithRedux(
            <Router history={history}>
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <TabbedForm resource="posts">
                            <FormTab label="tab1">
                                <TextInput
                                    source="title"
                                    validate={required()}
                                />
                            </FormTab>
                            <FormTab label="tab2">
                                <TextInput
                                    source="description"
                                    validate={minLength(10)}
                                />
                            </FormTab>
                        </TabbedForm>
                    </SaveContextProvider>
                </ThemeProvider>
            </Router>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        expect(history.location.pathname).toEqual('/1');
        expect(
            screen.getByLabelText('resources.posts.fields.description')
        ).not.toBeNull();
        expect(
            isInaccessible(
                screen.getByLabelText('resources.posts.fields.title *')
            )
        ).toEqual(true);
        fireEvent.click(tabs[0]);
        expect(history.location.pathname).toEqual('/');
        expect(
            screen.getByLabelText('resources.posts.fields.title *')
        ).not.toBeNull();
        expect(
            isInaccessible(
                screen.getByLabelText('resources.posts.fields.description')
            )
        ).toEqual(true);
    });

    it('should not sync tabs with location if syncWithLocation is false', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        renderWithRedux(
            <Router history={history}>
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <TabbedForm resource="posts" syncWithLocation={false}>
                            <FormTab label="tab1">
                                <TextInput
                                    source="title"
                                    validate={required()}
                                />
                            </FormTab>
                            <FormTab label="tab2">
                                <TextInput
                                    source="description"
                                    validate={minLength(10)}
                                />
                            </FormTab>
                        </TabbedForm>
                    </SaveContextProvider>
                </ThemeProvider>
            </Router>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        expect(history.location.pathname).toEqual('/');
        expect(
            screen.getByLabelText('resources.posts.fields.description')
        ).not.toBeNull();
        expect(
            isInaccessible(
                screen.getByLabelText('resources.posts.fields.title *')
            )
        ).toEqual(true);
        fireEvent.click(tabs[0]);
        expect(history.location.pathname).toEqual('/');
        expect(
            screen.getByLabelText('resources.posts.fields.title *')
        ).not.toBeNull();
        expect(
            isInaccessible(
                screen.getByLabelText('resources.posts.fields.description')
            )
        ).toEqual(true);
    });
});
