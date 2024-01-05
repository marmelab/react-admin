import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTranslateLabel } from './useTranslateLabel';
import { TestTranslationProvider } from './TestTranslationProvider';
import { SourceContextProvider } from '..';

describe('useTranslateLabel', () => {
    const TranslateLabel = ({
        source,
        label,
        resource,
    }: {
        source?: string;
        label?: string | false | React.ReactElement;
        resource?: string;
    }) => {
        const translateLabel = useTranslateLabel();
        return (
            <>
                {translateLabel({
                    label,
                    source,
                    resource,
                })}
            </>
        );
    };

    it('should return null when label is false', () => {
        render(
            <TestTranslationProvider>
                <TranslateLabel label={false} source="title" resource="posts" />
            </TestTranslationProvider>
        );
        expect(screen.queryByText(/title/)).toBeNull();
    });

    it('should return null when label is empty', () => {
        render(
            <TestTranslationProvider>
                <TranslateLabel label="" source="title" resource="posts" />
            </TestTranslationProvider>
        );
        expect(screen.queryByText(/title/)).toBeNull();
    });

    it('should return the label element when provided', () => {
        render(
            <TestTranslationProvider>
                <TranslateLabel
                    label={<span>My title</span>}
                    source="title"
                    resource="posts"
                />
            </TestTranslationProvider>
        );
        screen.getByText('My title');
    });

    it('should return the label text when provided', () => {
        render(
            <TestTranslationProvider messages={{}}>
                <TranslateLabel
                    label="My title"
                    source="title"
                    resource="posts"
                />
            </TestTranslationProvider>
        );
        screen.getByText('My title');
    });

    it('should return the translated label text when provided', () => {
        render(
            <TestTranslationProvider
                messages={{
                    test: { title: 'My title' },
                }}
            >
                <TranslateLabel
                    label="test.title"
                    source="title"
                    resource="posts"
                />
            </TestTranslationProvider>
        );
        screen.getByText('My title');
    });

    it('should return the inferred label from source and resource when no label is provided', () => {
        render(
            <TestTranslationProvider messages={{}}>
                <TranslateLabel source="title" resource="posts" />
            </TestTranslationProvider>
        );
        screen.getByText('Title');
    });

    it('should return the translated inferred label from source and resource when no label is provided', () => {
        render(
            <TestTranslationProvider
                messages={{
                    resources: {
                        posts: {
                            fields: {
                                title: 'My Title',
                            },
                        },
                    },
                }}
            >
                <TranslateLabel source="title" resource="posts" />
            </TestTranslationProvider>
        );
        screen.getByText('My Title');
    });

    it('should return the label from SourceContext when no label is provided but a SourceContext is present', () => {
        render(
            <TestTranslationProvider messages={{}}>
                <SourceContextProvider
                    value={{
                        getSource: source => source,
                        getLabel: source => `test.${source}`,
                    }}
                >
                    <TranslateLabel source="title" resource="posts" />
                </SourceContextProvider>
            </TestTranslationProvider>
        );
        screen.getByText('Title');
    });

    it('should return the translated label from SourceContext when no label is provided but a SourceContext is present', () => {
        render(
            <TestTranslationProvider
                messages={{
                    test: {
                        title: 'Label for title',
                    },
                }}
            >
                <SourceContextProvider
                    value={{
                        getSource: source => source,
                        getLabel: source => `test.${source}`,
                    }}
                >
                    <TranslateLabel source="title" resource="posts" />
                </SourceContextProvider>
            </TestTranslationProvider>
        );
        screen.getByText('Label for title');
    });
});
