import React from 'react';
import { render, screen } from '@testing-library/react';

import {
    Basic,
    I18nLabelAsKey,
    I18nNoTranslation,
    I18nTranslation,
    InSourceContext,
    InSourceContextI18nKey,
    InSourceContextNoTranslation,
    InSourceContextWithResource,
    LabelElement,
    LabelEmpty,
    LabelFalse,
    LabelText,
    Resource,
    Source,
} from './useTranslateLabel.stories';

describe('useTranslateLabel', () => {
    it('should compose a translation key from the resource and source', () => {
        render(<Basic />);
        screen.getByText('resources.posts.fields.title');
    });

    it('should use the resource in the translation key', () => {
        render(<Resource />);
        screen.getByText('resources.comments.fields.title');
    });

    it('should use the source in the translation key', () => {
        render(<Source />);
        screen.getByText('resources.posts.fields.date');
    });

    it('should return null when label is false', () => {
        render(<LabelFalse />);
        expect(screen.queryByText(/title/)).toBeNull();
    });

    it('should return null when label is empty', () => {
        render(<LabelEmpty />);
        expect(screen.queryByText(/title/)).toBeNull();
    });

    it('should return the label element when provided', () => {
        render(<LabelElement />);
        screen.getByText('My title');
    });

    it('should return the label text when provided', () => {
        render(<LabelText />);
        screen.getByText('My title');
    });

    describe('i18n', () => {
        it('should use the source and resource to create a default translation key', () => {
            render(<I18nTranslation />);
            screen.getByText('My Title');
        });

        it('should use the label as key when provided', () => {
            render(<I18nLabelAsKey />);
            screen.getByText('My title');
        });

        it('should infer a human readable default label when no translation is provided', () => {
            render(<I18nNoTranslation />);
            screen.getByText('Title');
        });
    });

    describe('SourceContext', () => {
        it('should call getLabel for the default label', () => {
            render(<InSourceContext />);
            screen.getByText('Label for title');
        });

        it('should use the getLabel return as translation key', () => {
            render(<InSourceContextI18nKey />);
            screen.getByText('test.title');
        });

        it('should infer a human readable default label when no translation is provided', () => {
            render(<InSourceContextNoTranslation />);
            screen.getByText('Title');
        });

        it('should infer a human readable default label when a resource is provided', () => {
            render(<InSourceContextWithResource />);
            screen.getByText('Title');
        });
    });
});
