import expect from 'expect';
import { defaultI18nProvider } from './defaultI18nProvider';

describe('defaultI18nProvider', () => {
    it('should use the English translations', () => {
        expect(defaultI18nProvider.translate('ra.action.edit')).toBe('Edit');
    });
    it('should return the input when the translation is missing', () => {
        expect(defaultI18nProvider.translate('bar')).toBe('bar');
    });
    it('should not log any warning for missing translations', () => {
        const spy = jest.spyOn(console, 'error');
        defaultI18nProvider.translate('foo');
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });
});
