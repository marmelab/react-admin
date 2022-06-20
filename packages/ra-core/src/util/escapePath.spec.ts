import escapePath from './escapePath';
import expect from 'expect';

describe('escapePath', () => {
    it('escape parenthesis from an url', () => {
        expect(escapePath('/foo(bar)')).toEqual('/foo\\(bar\\)');
    });
    it('escapes meta-characters', () => {
        expect(escapePath('/foo\n(bar)')).toEqual('/foo%0A\\(bar\\)');
    });
});
