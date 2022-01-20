import * as React from 'react';
import { createMemoryHistory } from 'history';
import { minLength, required, testDataProvider } from 'ra-core';
import {
    fireEvent,
    isInaccessible,
    render,
    screen,
    waitFor,
} from '@testing-library/react';

import { AdminContext } from '../AdminContext';
import { TabbedForm } from './TabbedForm';
import { TabbedFormClasses } from './TabbedFormView';
import { FormTab } from './FormTab';
import { TextInput } from '../input';

describe('<TabbedForm />', () => {
    it('should display the tabs', () => {
        const history = createMemoryHistory();
        render(
            <AdminContext dataProvider={testDataProvider()} history={history}>
                <TabbedForm>
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedForm>
            </AdminContext>
        );

        const tabs = screen.queryAllByRole('tab');
        expect(tabs.length).toEqual(2);
    });

    // We should introduce a context for form config (submitOnEnter, variant, margin)
    it.skip('should pass submitOnEnter to <Toolbar />', () => {
        const Toolbar = ({ submitOnEnter }: any) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );
        const history = createMemoryHistory();

        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()} history={history}>
                <TabbedForm submitOnEnter={false} toolbar={<Toolbar />}>
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedForm>
            </AdminContext>
        );

        expect(screen.queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <AdminContext dataProvider={testDataProvider()} history={history}>
                <TabbedForm submitOnEnter toolbar={<Toolbar />}>
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedForm>
            </AdminContext>
        );

        expect(screen.queryByText('submitOnEnter: true')).not.toBeNull();
    });

    it('should set the style of an inactive Tab button with errors', async () => {
        const history = createMemoryHistory({ initialEntries: ['/posts/1'] });
        render(
            <AdminContext dataProvider={testDataProvider()} history={history}>
                <TabbedForm resource="posts" mode="onBlur">
                    <FormTab label="tab1">
                        <TextInput
                            defaultValue=""
                            source="title"
                            validate={required()}
                        />
                    </FormTab>
                    <FormTab label="tab2">
                        <TextInput
                            defaultValue=""
                            source="description"
                            validate={minLength(10)}
                        />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description'
        );
        fireEvent.change(input, { target: { value: 'foo' } });
        fireEvent.blur(input);
        fireEvent.click(tabs[0]);

        await waitFor(() => {
            expect(
                tabs[1].classList.contains(TabbedFormClasses.errorTabButton)
            ).toEqual(true);
        });

        expect(
            tabs[0].classList.contains(TabbedFormClasses.errorTabButton)
        ).toEqual(false);
    });

    it('should set the style of an active Tab button with errors', async () => {
        const history = createMemoryHistory({ initialEntries: ['/posts/1'] });
        render(
            <AdminContext dataProvider={testDataProvider()} history={history}>
                <TabbedForm resource="posts" mode="onBlur">
                    <FormTab label="tab1">
                        <TextInput
                            defaultValue=""
                            source="title"
                            validate={required()}
                        />
                    </FormTab>
                    <FormTab label="tab2">
                        <TextInput
                            defaultValue=""
                            source="description"
                            validate={required()}
                        />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description *'
        );
        fireEvent.blur(input);
        await waitFor(() => {
            expect(
                tabs[1].classList.contains(TabbedFormClasses.errorTabButton)
            ).toEqual(true);
        });
        expect(
            tabs[0].classList.contains(TabbedFormClasses.errorTabButton)
        ).toEqual(false);
    });

    it('should set the style of any Tab button with errors on submit', async () => {
        const history = createMemoryHistory({ initialEntries: ['/posts/1'] });
        render(
            <AdminContext dataProvider={testDataProvider()} history={history}>
                <TabbedForm resource="posts" mode="onBlur">
                    <FormTab label="tab1">
                        <TextInput
                            defaultValue=""
                            source="title"
                            validate={required()}
                        />
                    </FormTab>
                    <FormTab label="tab2">
                        <TextInput
                            defaultValue=""
                            source="description"
                            validate={minLength(10)}
                        />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );

        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[1]);
        const input = screen.getByLabelText(
            'resources.posts.fields.description'
        );
        fireEvent.change(input, { target: { value: 'fooooooooo' } });
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(
                tabs[0].classList.contains(TabbedFormClasses.errorTabButton)
            ).toEqual(true);
        });
        expect(
            tabs[1].classList.contains(TabbedFormClasses.errorTabButton)
        ).toEqual(false);
    });

    it('should sync tabs with location by default', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        render(
            <AdminContext dataProvider={testDataProvider()} history={history}>
                <TabbedForm resource="posts">
                    <FormTab label="tab1">
                        <TextInput
                            defaultValue=""
                            source="title"
                            validate={required()}
                        />
                    </FormTab>
                    <FormTab label="tab2">
                        <TextInput
                            defaultValue=""
                            source="description"
                            validate={minLength(10)}
                        />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
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
            <AdminContext dataProvider={testDataProvider()} history={history}>
                <TabbedForm resource="posts" syncWithLocation={false}>
                    <FormTab label="tab1">
                        <TextInput source="title" validate={required()} />
                    </FormTab>
                    <FormTab label="tab2">
                        <TextInput
                            source="description"
                            validate={minLength(10)}
                        />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
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
