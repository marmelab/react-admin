import assert from 'assert';

import reducer from './locale';
import { DEFAULT_LOCALE } from '../i18n/index';
import { CHANGE_LOCALE } from '../actions/localeActions';

describe('locale reducer', () => {
    it('should return DEFAULT_LOCALE by default', () => {
        assert.equal(DEFAULT_LOCALE, reducer()(undefined, {}));
    });
    it('should change with CHANGE_LOCALE actions', () => {
        assert.equal(
            'fr',
            reducer()('en', { type: CHANGE_LOCALE, payload: 'fr' })
        );
    });
});
