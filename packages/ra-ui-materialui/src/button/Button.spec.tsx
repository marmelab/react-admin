import { render } from '@testing-library/react';
import * as React from 'react';
import expect from 'expect';
import { TestContext } from 'ra-test';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Button from './Button';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

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
    undoable: false,
};

describe('<Button />', () => {
    it('should render as submit type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <TestContext>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <Button label="button" {...invalidButtonDomProps} />
                    </ThemeProvider>
                </StyledEngineProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('button').getAttribute('type')).toEqual('button');

        spy.mockRestore();
    });
});
