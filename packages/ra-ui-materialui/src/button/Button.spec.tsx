import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import expect from 'expect';
import { TestContext } from 'ra-core';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import Button from './Button';

const theme = createMuiTheme();

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
    afterEach(cleanup);

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
