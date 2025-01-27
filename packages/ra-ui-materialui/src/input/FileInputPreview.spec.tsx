import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { FileInputPreview } from './FileInputPreview';

describe('<FileInputPreview />', () => {
    beforeAll(() => {
        vi.spyOn(URL, 'revokeObjectURL');
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const file = {
        preview: 'previewUrl',
    };

    const defaultProps = {
        file,
        onRemove: vi.fn(),
    };

    it('should call `onRemove` prop when clicking on remove button', () => {
        const onRemoveSpy = vi.fn();

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
            expect(URL.revokeObjectURL).toHaveBeenCalledWith('previewUrl');
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
            expect(URL.revokeObjectURL).not.toHaveBeenCalled();
        });
    });
});
