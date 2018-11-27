import assert from 'assert';

import reducer from './locale';
import { DEFAULT_LOCALE } from '../../i18n/index';
import {
    CHANGE_LOCALE_SUCCESS,
    CHANGE_LOCALE_FAILURE,
} from '../../actions/localeActions';

describe('locale reducer', () => {
    it('should return DEFAULT_LOCALE by default', () => {
        assert.equal(DEFAULT_LOCALE, reducer()(undefined, { type: 'foo' }));
    });
    it('should change with CHANGE_LOCALE_SUCCESS action', () => {
        assert.equal(
            'fr',
            reducer()('en', {
                type: CHANGE_LOCALE_SUCCESS,
                payload: {
                    locale: 'fr',
                    messages: {},
                },
            })
        );
    });
    it('should remain with CHANGE_LOCALE_FAILURE action', () => {
        assert.equal(
            'en',
            reducer()('en', {
                type: CHANGE_LOCALE_FAILURE,
                payload: 'fr',
            })
        );
    });
});
