import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { LabelPrefixContextProvider } from './LabelPrefixContextProvider';
import { useLabelPrefix } from './useLabelPrefix';

describe('LabelPrefixContextProvider', () => {
    it('should return the prefix', () => {
        const Label = () => {
            return <>{useLabelPrefix()}</>;
        };
        render(
            <LabelPrefixContextProvider prefix="resource.posts.fields.title">
                <Label />
            </LabelPrefixContextProvider>
        );
        screen.getByText('resource.posts.fields.title');
    });
    it('should not concatenate previous prefix', () => {
        const Label = () => {
            return <>{useLabelPrefix()}</>;
        };
        render(
            <LabelPrefixContextProvider prefix="resource.posts.fields.title">
                <LabelPrefixContextProvider
                    prefix="resource.comments.fields.body"
                    concatenate={false}
                >
                    <Label />
                </LabelPrefixContextProvider>
            </LabelPrefixContextProvider>
        );
        screen.getByText('resource.comments.fields.body');
    });
});
