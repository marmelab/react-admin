import * as React from 'react';
import debounce from 'lodash/debounce';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { testDataProvider } from 'ra-core';
import { AdminContext, SimpleForm } from 'ra-ui-materialui';

import { RichTextInput } from './RichTextInput';

let container;

jest.mock('lodash/debounce');

describe('RichTextInput', () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        // required as quilljs uses getSelection api
        document.getSelection = () => {
            return {
                removeAllRanges: () => {},
                getRangeAt: function () {},
            };
        };
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('should call handleChange only once when editing', async () => {
        const handleChange = jest.fn();
        debounce.mockImplementation(fn => fn);
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ body: '<p>test</p>' }}
                    onSubmit={jest.fn()}
                >
                    <RichTextInput source="body" onChange={handleChange} />
                </SimpleForm>
            </AdminContext>
        );
        const quillNode = await waitFor(() => {
            return screen.getByTestId('quill');
        });
        const node = quillNode.querySelector('.ql-editor');
        fireEvent.input(node, {
            target: { innerHTML: '<p>test1</p>' },
        });

        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
    });
});
