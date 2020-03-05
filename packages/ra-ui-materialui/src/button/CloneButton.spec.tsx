import expect from 'expect';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { CloneButton } from './CloneButton';

const theme = createMuiTheme();

describe('<CloneButton />', () => {
    it('should pass a clone of the record in the location state', () => {
        const history = createMemoryHistory();
        const { getByRole } = render(
            <Router history={history}>
                <ThemeProvider theme={theme}>
                    <CloneButton record={{ id: 123, foo: 'bar' }} basePath="" />
                </ThemeProvider>
            </Router>
        );

        const button = getByRole('button');
        expect(button.getAttribute('href')).toEqual(
            '/create?source=%7B%22foo%22%3A%22bar%22%7D'
        );
    });
});
