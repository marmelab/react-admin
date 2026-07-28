import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import {
    Breakpoint,
    ReactNodeLabel,
    SimpleStringLabel,
    TranslationKeyLabel,
} from './Button.stories';

describe('<DeleteButton />', () => {
    it('should allow simple string as label', async () => {
        const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');
        const translate = jest.spyOn(i18nProvider, 'translate');
        render(<SimpleStringLabel i18nProvider={i18nProvider} />);
        await screen.findByText('A non translated string');
        expect(translate).toHaveBeenCalledWith('A non translated string', {
            _: 'A non translated string',
        });
    });
    it('should allow translation keys as label', async () => {
        const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');
        const translate = jest.spyOn(i18nProvider, 'translate');
        render(<TranslationKeyLabel i18nProvider={i18nProvider} />);
        await screen.findByText('Create');
        expect(translate).toHaveBeenCalledWith('ra.action.create', {
            _: 'ra.action.create',
        });
    });
    it('should ReactNode as label', async () => {
        const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');
        const translate = jest.spyOn(i18nProvider, 'translate');
        render(<ReactNodeLabel i18nProvider={i18nProvider} />);
        await screen.findByText('A ReactNode');
        expect(translate).not.toHaveBeenCalled();
    });
    describe('breakpoint', () => {
        it('should shrink to an icon button below the sm breakpoint by default', async () => {
            render(<Breakpoint width="xs" />);
            await screen.findByLabelText(/Shrinks below sm/);
            expect(screen.queryByText(/Shrinks below sm/)).toBeNull();
        });
        it('should render the label above the sm breakpoint by default', async () => {
            render(<Breakpoint width="md" />);
            await screen.findByText(/Shrinks below sm/);
        });
        it('should shrink below the breakpoint passed as prop', async () => {
            render(<Breakpoint width="md" />);
            await screen.findByLabelText('Shrinks below lg');
            expect(screen.queryByText('Shrinks below lg')).toBeNull();
        });
        it('should never shrink when breakpoint is false', async () => {
            render(<Breakpoint width="xs" />);
            await screen.findByText('Never shrinks');
        });
    });
});
