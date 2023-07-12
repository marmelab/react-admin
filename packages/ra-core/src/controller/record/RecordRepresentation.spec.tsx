import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
    ComponentRecordRepresentation,
    FunctionRecordRepresentation,
    NoRecordRepresentation,
    StringRecordRepresentation,
} from './RecordRepresentation.stories';

describe('RecordRepresentation', () => {
    it('should render the record id when not provided on its parent <Resource>', async () => {
        render(<NoRecordRepresentation />);
        await screen.findByText('#1');
    });
    it('should render the record representation when provided as a field name on its parent <Resource>', async () => {
        render(<StringRecordRepresentation />);
        await screen.findByText("The Hitchhiker's Guide to the Galaxy");
    });
    it('should render the record representation when provided as a function on its parent <Resource>', async () => {
        render(<FunctionRecordRepresentation />);
        await screen.findByText(
            "The Hitchhiker's Guide to the Galaxy by Douglas Adams"
        );
    });
    it('should render the record representation when provided as a component on its parent <Resource>', async () => {
        render(<ComponentRecordRepresentation />);
        await screen.findByText(
            (content, element) => {
                return (
                    element?.textContent ===
                    "The Hitchhiker's Guide to the Galaxy (by Douglas Adams) - 1979"
                );
            },
            { selector: 'p' }
        );
    });
});
