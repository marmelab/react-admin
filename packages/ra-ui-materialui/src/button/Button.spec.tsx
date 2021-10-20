import * as React from 'react';
import { render } from '@testing-library/react';
import expect from 'expect';
import { MutationMode } from 'ra-core';
import { TestContext } from 'ra-test';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Button } from './Button';

const theme = createTheme();

const invalidButtonDomProps = {
    basePath: '',
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
    mutationMode: 'pessimistic' as MutationMode,
};

describe('<Button />', () => {
    it('should render as submit type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <TestContext>
                <ThemeProvider theme={theme}>
                    <Button label="button" {...invalidButtonDomProps} />
                </ThemeProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('button').getAttribute('type')).toEqual('button');

        spy.mockRestore();
    });
});
