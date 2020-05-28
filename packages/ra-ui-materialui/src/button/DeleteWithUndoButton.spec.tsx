import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import expect from 'expect';
import { TestContext } from 'ra-core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import DeleteWithUndoButton from './DeleteWithUndoButton';

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

describe('<DeleteWithUndoButton />', () => {
    afterEach(cleanup);

    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <TestContext
                initialState={{
                    admin: {
                        resources: {
                            posts: {
                                data: {
                                    1: {
                                        id: 1,
                                        foo: 'bar',
                                    },
                                },
                            },
                        },
                    },
                }}
            >
                <ThemeProvider theme={theme}>
                    <DeleteWithUndoButton {...invalidButtonDomProps} />
                </ThemeProvider>
            </TestContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.delete').getAttribute('type')).toEqual(
            'button'
        );

        spy.mockRestore();
    });
});
