import expect from 'expect';

import escapePath from './escapePath';

describe('escapePath', () => {
    it('escapes parentheses', () => {
        expect(escapePath('/foo(bar)')).toEqual('/foo\\(bar\\)');
    });

    it('escapes backslashes before escaping parentheses', () => {
        expect(escapePath('/foo\\(bar)')).toEqual('/foo\\\\\\(bar\\)');
    });
});
