import React from 'react';
import { render } from '@testing-library/react';

import {
    Options,
    Basic,
    NoTranslation,
    NoTranslationWithChildrenAsNode,
    NoTranslationWithChildrenAsString,
} from './Translate.stories';

describe('<Translate />', () => {
    it('should render the translation', () => {
        const { container } = render(<Basic />);
        expect(container.innerHTML).toBe('My Translated Key');
    });

    it('should render the translation event if children is set', () => {
        const { container } = render(
            <NoTranslationWithChildrenAsString
                messages={{ custom: { myKey: 'My Translated Key' } }}
            />
        );
        expect(container.innerHTML).toBe('My Translated Key');
    });

    it('should render anything if no translation available', () => {
        const { container } = render(<NoTranslation />);
        expect(container.innerHTML).toBe('');
    });

    it('should render the children (string) if no translation available', () => {
        const { container } = render(<NoTranslationWithChildrenAsString />);
        expect(container.innerHTML).toBe('My Default Translation');
    });

    it('should render the children (ReactNode) if no translation available', () => {
        const { container } = render(<NoTranslationWithChildrenAsNode />);
        expect(container.innerHTML).toBe(
            '<div style="color: red;"><i>My Default Translation</i></div>'
        );
    });

    it('should render the translation with options', () => {
        const { container } = render(<Options />);
        expect(container.innerHTML).toBe('It cost 6.00 $');
    });
});
