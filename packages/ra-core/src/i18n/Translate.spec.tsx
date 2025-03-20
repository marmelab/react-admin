import React from 'react';
import { render } from '@testing-library/react';

import {
    Args,
    Basic,
    NoTranslation,
    NoTranslationWithChildren,
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
                <Translate i18nKey="custom.myKey">Lorem Ipsum</Translate>
            </TestTranslationProvider>
        );
        expect(container.innerHTML).toBe('My Translated Key');
    });

    it('should render anything if no translation available', () => {
        const { container } = render(<NoTranslation />);
        expect(container.innerHTML).toBe('');
    });

    it('should render the children (string) if no translation available', () => {
        const { container } = render(<NoTranslationWithChildren />);
        expect(container.innerHTML).toBe('My Default Translation');
    });

    it('should render the children (ReactNode) if no translation available', () => {
        const { container } = render(
            <NoTranslationWithChildren isChildrenANode />
        );
        expect(container.innerHTML).toBe(
            '<div style="color: red;"><i>My Default Translation</i></div>'
        );
    });

    it('should render the translation with args', () => {
        const { container } = render(<Args />);
        expect(container.innerHTML).toBe('It cost 6.00 $');
    });
});
