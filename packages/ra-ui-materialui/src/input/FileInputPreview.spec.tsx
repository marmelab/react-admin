import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import FileInputPreview from './FileInputPreview';

describe('<FileInputPreview />', () => {
    afterEach(cleanup);

    const file = {
        preview: 'previewUrl',
    };

    const defaultProps = {
        file,
        onRemove: jest.fn(),
        revokeObjectURL: jest.fn(),
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

    it('should clean up generated URLs for preview', () => {
        const revokeObjectURL = jest.fn();

        const { unmount } = render(
            <FileInputPreview
                {...defaultProps}
                revokeObjectURL={revokeObjectURL}
            >
                <div id="child">Child</div>
            </FileInputPreview>
        );

        unmount();
        expect(revokeObjectURL).toHaveBeenCalledWith('previewUrl');
    });

    it('should not try to clean up preview urls if not passed a File object with a preview', () => {
        const file = {};
        const revokeObjectURL = jest.fn();

        const { unmount } = render(
            <FileInputPreview
                {...defaultProps}
                file={file}
                revokeObjectURL={revokeObjectURL}
            >
                <div id="child">Child</div>
            </FileInputPreview>
        );

        unmount();
        expect(revokeObjectURL).not.toHaveBeenCalled();
    });
});
