import * as React from 'react';
import expect from 'expect';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { TestContext } from 'ra-test';

import { CloneButton } from './CloneButton';

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
        const { getByLabelText } = render(
            <Router history={history}>
                <ThemeProvider theme={theme}>
                    <CloneButton
                        record={{ id: 123, foo: 'bar' }}
                        basePath="/posts"
                    />
                </ThemeProvider>
            </Router>
        );

        expect(getByLabelText('ra.action.clone').getAttribute('href')).toEqual(
            '/posts/create?source=%7B%22foo%22%3A%22bar%22%7D'
        );
    });

    it('should render as button type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <CloneButton {...invalidButtonDomProps} />
                </ThemeProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.clone').getAttribute('href')).toEqual(
            '/posts/create?source=%7B%22foo%22%3A%22bar%22%7D'
        );

        spy.mockRestore();
    });
});
