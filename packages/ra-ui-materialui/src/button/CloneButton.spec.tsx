import expect from 'expect';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { render } from '@testing-library/react';
import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { CloneButton } from './CloneButton';
import { TestContext } from 'ra-test';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const theme = createTheme();

const invalidButtonDomProps = {
    basePath: '/posts',
    handleSubmit: jest.fn(),
    handleSubmitWithRedirect: jest.fn(),
    invalid: false,
    onSave: jest.fn(),
    pristine: false,
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
    saving: false,
    submitOnEnter: true,
    undoable: false,
};

describe('<CloneButton />', () => {
    it('should pass a clone of the record in the location state', () => {
        const history = createMemoryHistory();
        const { getByRole } = render(
            <Router history={history}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <CloneButton
                            record={{ id: 123, foo: 'bar' }}
                            basePath="/posts"
                        />
                    </ThemeProvider>
                </StyledEngineProvider>
            </Router>
        );

        const button = getByRole('button');
        expect(button.getAttribute('href')).toEqual(
            '/posts/create?source=%7B%22foo%22%3A%22bar%22%7D'
        );
    });

    it('should render as button type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByRole } = render(
            <TestContext>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <CloneButton {...invalidButtonDomProps} />
                    </ThemeProvider>
                </StyledEngineProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByRole('button').getAttribute('href')).toEqual(
            '/posts/create?source=%7B%22foo%22%3A%22bar%22%7D'
        );

        spy.mockRestore();
    });
});
