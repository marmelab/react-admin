import expect from 'expect';
import { getSafeUrl, isSafeUrl } from './getSafeUrl';

describe('isSafeUrl', () => {
    it('should accept safe URLs', () => {
        expect(isSafeUrl('https://example.com')).toBe(true);
        expect(isSafeUrl('http://example.com/path?query=1#hash')).toBe(true);
        expect(isSafeUrl('mailto:john@example.com')).toBe(true);
        expect(isSafeUrl('tel:+33123456789')).toBe(true);
        expect(isSafeUrl('ftp://example.com/file.txt')).toBe(true);
        expect(isSafeUrl('/posts/1')).toBe(true);
        expect(isSafeUrl('posts/1')).toBe(true);
        expect(isSafeUrl('#/posts/1')).toBe(true);
        expect(isSafeUrl('//example.com')).toBe(true);
        expect(isSafeUrl('data:application/pdf;base64,JVBERi0xLjQ=')).toBe(
            true
        );
    });

    it('should reject unsafe URLs', () => {
        expect(isSafeUrl('javascript:alert(1)')).toBe(false);
        expect(isSafeUrl('JavaScript:alert(1)')).toBe(false);
        expect(isSafeUrl(' javascript:alert(1)')).toBe(false);
        expect(isSafeUrl('java\tscript:alert(1)')).toBe(false);
        expect(isSafeUrl('java\nscript:alert(1)')).toBe(false);
        expect(isSafeUrl('\u0000javascript:alert(1)')).toBe(false);
    });
});

describe('getSafeUrl', () => {
    it('should return a safe URL without logging', () => {
        const consoleError = jest.spyOn(console, 'error');
        expect(getSafeUrl('https://example.com')).toBe('https://example.com');
        expect(consoleError).not.toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it('should return undefined for an unsafe URL and log an error', () => {
        const consoleError = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        expect(getSafeUrl('javascript:alert(1)')).toBeUndefined();
        expect(consoleError).toHaveBeenCalledWith(
            'Blocked unsafe URL: "javascript:alert(1)"'
        );
        consoleError.mockRestore();
    });
});
