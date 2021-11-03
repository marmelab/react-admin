import * as React from 'react';
import debounce from 'lodash/debounce';
import { fireEvent, waitFor } from '@testing-library/react';
import { FormWithRedirect } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import RichTextInput from './index';

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
        const { getByTestId } = renderWithRedux(
            <FormWithRedirect
                defaultValues={{ body: '<p>test</p>' }}
                save={jest.fn()}
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

        await waitFor(() => {
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
    });
});
