import * as React from 'react';
import debounce from 'lodash/debounce';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';

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
        jest.useFakeTimers();
        const handleChange = jest.fn();
        debounce.mockImplementation(fn => fn);
        const { getByTestId, rerender } = render(
            <Form
                initialValues={{ body: '<p>test</p>' }}
                onSubmit={jest.fn()}
                render={() => (
                    <RichTextInput source="body" onChange={handleChange} />
                )}
            />
        );
        const quillNode = await waitFor(() => {
            return getByTestId('quill');
        });
        const node = quillNode.querySelector('.ql-editor');
        fireEvent.input(node, {
            target: { innerHTML: '<p>test1</p>' },
        });

        // ensuring the first 'text-change' event had been handled
        jest.runOnlyPendingTimers();

        rerender(
            <Form
                initialValues={{ body: '<p>test1</p>' }}
                onSubmit={jest.fn()}
                render={() => (
                    <RichTextInput source="body" onChange={handleChange} />
                )}
            />
        );

        expect(handleChange).toHaveBeenCalledTimes(1);
    });
});
