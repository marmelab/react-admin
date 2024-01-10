import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { FileInputPreview } from './FileInputPreview';

describe('<FileInputPreview />', () => {
    beforeAll(() => {
        // @ts-ignore
        global.URL.revokeObjectURL = jest.fn();
    });

    afterAll(() => {
        // @ts-ignore
        delete global.URL.revokeObjectURL;
    });

    afterEach(() => {
        // @ts-ignore
        global.URL.revokeObjectURL.mockClear();
    });

    const file = {
        preview: 'previewUrl',
    };

    const defaultProps = {
        file,
        onRemove: jest.fn(),
    };

    it('should call `onRemove` prop when clicking on remove button', () => {
        const onRemoveSpy = jest.fn();

        const { getByLabelText } = render(
            <FileInputPreview {...defaultProps} onRemove={onRemoveSpy}>
                <div>Child</div>
            </FileInputPreview>
        );

        fireEvent.click(getByLabelText('ra.action.delete'));

        expect(onRemoveSpy).toHaveBeenCalled();
    });

    it('should render passed children', () => {
        const { queryByText } = render(
            <FileInputPreview {...defaultProps}>
                <div id="child">Child</div>
            </FileInputPreview>
        );

        expect(queryByText('Child')).not.toBeNull();
    });

    it('should clean up generated URLs for preview', async () => {
        const { unmount } = render(
            <FileInputPreview {...defaultProps}>
                <div id="child">Child</div>
            </FileInputPreview>
        );

        unmount();
        await waitFor(() => {
            // @ts-ignore
            expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(
                'previewUrl'
            );
        });
    });

    it('should not try to clean up preview urls if not passed a File object with a preview', async () => {
        const file = {};

        const { unmount } = render(
            <FileInputPreview {...defaultProps} file={file}>
                <div id="child">Child</div>
            </FileInputPreview>
        );

        unmount();
        await waitFor(() => {
            // @ts-ignore
            expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
        });
    });
});
