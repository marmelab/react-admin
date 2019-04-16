import React from 'react';
import debounce from 'lodash/debounce';
import {render, fireEvent, waitForElement, cleanup, getByTestId} from 'react-testing-library'

import { RichTextInput } from './index';

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
            getRangeAt: function() {}, 
          };
      };
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('should call text-change event only once when editing', async () => {
        const mockFn = jest.fn();
        debounce.mockImplementation(fn => fn);
        const { getByTestId, rerender } = render(
        <RichTextInput
            input={{
              value: '<p>test</p>',
                onChange: mockFn
            }}
            meta={{error: null}} />);
        const quillNode = await waitForElement(() => {
            return getByTestId('quill')
        });
        quillNode.__quill.setText('test1');
        rerender(
          <RichTextInput
            input={{
              value: '<p>test1</p>',
                onChange: mockFn
            }}
            meta={{error: null}} />)

        expect(mockFn).toHaveBeenCalledTimes(1);
    });
})
