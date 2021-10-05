import { render } from '@testing-library/react';
import * as React from 'react';
import expect from 'expect';
import { TestContext } from 'ra-test';
import {
    ThemeProvider,
    Theme,
    StyledEngineProvider,
    adaptV4Theme,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import CreateButton from './CreateButton';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

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

describe('<CreateButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const theme = createTheme(
            adaptV4Theme({
                props: {
                    MuiWithWidth: {
                        initialWidth: 'sm',
                    },
                },
            })
        );

        const { getByLabelText } = render(
            <TestContext>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <CreateButton {...invalidButtonDomProps} />
                    </ThemeProvider>
                </StyledEngineProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.create').tagName).toEqual('A');

        spy.mockRestore();
    });
});
