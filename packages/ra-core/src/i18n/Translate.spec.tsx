import React from 'react';
import { render } from '@testing-library/react';

import {
    Args,
    Basic,
    NoTranslation,
    NoTranslationWithChildren,
    NoTranslationWithEmpty,
} from './Translate.stories';
import { TestTranslationProvider } from './TestTranslationProvider';
import { Translate } from './Translate';

describe('<Translate />', () => {
    it('should render the translation', () => {
        const { container } = render(<Basic />);
        expect(container.innerHTML).toBe('My Translated Key');
    });

    it('should render the translation event if children is set', () => {
        const { container } = render(
            <TestTranslationProvider
                messages={{
                    custom: {
                        myKey: 'My Translated Key',
                    },
                }}
            >
                <Translate i18nKey="custom.myKey" />
            </TestTranslationProvider>
        );
        expect(container.innerHTML).toBe('My Translated Key');
    });

    it('should render the empty prop if no translation available', () => {
        const { container } = render(<NoTranslation />);
        expect(container.innerHTML).toBe('no translation');
    });

    it('should render the children if no translation available', () => {
        const { container } = render(<NoTranslationWithChildren />);
        expect(container.innerHTML).toBe('My Key');
    });

    it('should render the empty prop if no translation available', () => {
        const { container } = render(<NoTranslationWithEmpty />);
        expect(container.innerHTML).toBe('translation failed');
    });

    it('should render the translation with args', () => {
        const { container } = render(<Args />);
        expect(container.innerHTML).toBe('It cost 6.00 $');
    });
});
