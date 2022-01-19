import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Route, Routes } from 'react-router-dom';
import {
    minLength,
    required,
    SaveContextProvider,
    CoreAdminContext,
    testDataProvider,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    fireEvent,
    isInaccessible,
    render,
    screen,
} from '@testing-library/react';

import { defaultTheme } from '../defaultTheme';
import { TabbedForm } from './TabbedForm';
import { FormTab } from './FormTab';
import { TextInput } from '../input';

describe('<TabbedForm />', () => {
    const saveContextValue = {
        save: jest.fn(),
        saving: false,
    };

    it('should display the tabs', () => {
        const history = createMemoryHistory();
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <TabbedForm>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SaveContextProvider>
                </ThemeProvider>
            </CoreAdminContext>
        );

        const tabs = screen.queryAllByRole('tab');
        expect(tabs.length).toEqual(2);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const Toolbar = ({ submitOnEnter }: any) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );
        const history = createMemoryHistory();

        const { rerender } = render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <TabbedForm submitOnEnter={false} toolbar={<Toolbar />}>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SaveContextProvider>
                </ThemeProvider>
            </CoreAdminContext>
        );

        expect(screen.queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <TabbedForm submitOnEnter toolbar={<Toolbar />}>
                            <FormTab label="tab1" />
                            <FormTab label="tab2" />
                        </TabbedForm>
                    </SaveContextProvider>
                </ThemeProvider>
            </CoreAdminContext>
        );

        expect(screen.queryByText('submitOnEnter: true')).not.toBeNull();
    });

    it('should set the style of an inactive Tab button with errors', async () => {
        const history = createMemoryHistory({ initialEntries: ['/posts/1'] });
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <Routes>
                    <Route
                        path="/posts/:id/*"
                        element={
                            <ThemeProvider theme={createTheme(defaultTheme)}>
                                <SaveContextProvider value={saveContextValue}>
                                    <TabbedForm
                                        classes={{ errorTabButton: 'error' }}
                                        resource="posts"
                                    >
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
                        }
                    />
                </Routes>
            </CoreAdminContext>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description'
        );
        fireEvent.change(input, { target: { value: 'foo' } });
        fireEvent.blur(input);
        fireEvent.click(tabs[0]);
        expect(tabs[0].classList.contains('error')).toEqual(false);
        expect(tabs[1].classList.contains('error')).toEqual(true);
    });

    it('should set the style of an active Tab button with errors', () => {
        const history = createMemoryHistory({ initialEntries: ['/posts/1'] });
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <Routes>
                    <Route
                        path="/posts/:id/*"
                        element={
                            <ThemeProvider theme={createTheme(defaultTheme)}>
                                <SaveContextProvider value={saveContextValue}>
                                    <TabbedForm
                                        classes={{ errorTabButton: 'error' }}
                                        resource="posts"
                                    >
                                        <FormTab label="tab1">
                                            <TextInput
                                                source="title"
                                                validate={required()}
                                            />
                                        </FormTab>
                                        <FormTab label="tab2">
                                            <TextInput
                                                source="description"
                                                validate={required()}
                                            />
                                        </FormTab>
                                    </TabbedForm>
                                </SaveContextProvider>
                            </ThemeProvider>
                        }
                    />
                </Routes>
            </CoreAdminContext>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description *'
        );
        fireEvent.blur(input);
        expect(tabs[0].classList.contains('error')).toEqual(false);
        expect(tabs[1].classList.contains('error')).toEqual(true);
    });

    it('should set the style of any Tab button with errors on submit', () => {
        const history = createMemoryHistory({ initialEntries: ['/posts/1'] });
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <Routes>
                    <Route
                        path="/posts/:id/*"
                        element={
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
                        }
                    />
                </Routes>
            </CoreAdminContext>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description'
        );
        fireEvent.blur(input);
        fireEvent.change(input, { target: { value: 'fooooooooo' } });
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        expect(tabs[0].classList.contains('error')).toEqual(true);
        expect(tabs[1].classList.contains('error')).toEqual(false);
    });

    it('should sync tabs with location by default', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <TabbedForm
                            classes={{ errorTabButton: 'error' }}
                            resource="posts"
                        >
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
            </CoreAdminContext>
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

        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <ThemeProvider theme={createTheme(defaultTheme)}>
                    <SaveContextProvider value={saveContextValue}>
                        <TabbedForm
                            classes={{ errorTabButton: 'error' }}
                            resource="posts"
                            syncWithLocation={false}
                        >
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
            </CoreAdminContext>
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
