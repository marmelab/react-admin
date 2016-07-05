import pagination from './reducer';
import {
    CRUD_NEXT_PAGE,
    CRUD_PREV_PAGE,
    CRUD_FIRST_PAGE,
    CRUD_LAST_PAGE,
    CRUD_GOTO_PAGE,
} from './actions';
import assert from 'assert';

describe('pagination', () => {
    it('should not modify the state when the action resource does not match the reducer resource', () => {
        assert.deepEqual(pagination('foo')('unchanged', { type: CRUD_NEXT_PAGE, meta: { resource: 'bar' } }), 'unchanged');
    });

    it('should modify the state when the action resource does match the reducer resource', () => {
        assert.deepEqual(pagination('bar')({ page: 2, total: 5 }, {
            type: CRUD_NEXT_PAGE,
            meta: { resource: 'bar' },
        }), {
            page: 3,
            total: 5,
        });
    });

    it('should return the default pagination (page: 1, total: 1)', () => {
        assert.deepEqual(pagination('bar')(undefined, { meta: { resource: 'bar' } }), {
            page: 1,
            total: 1,
        });
    });

    describe('CRUD_NEXT_PAGE', () => {
        it('should increase the page', () => {
            assert.deepEqual(pagination('bar')({ page: 2, total: 5 }, {
                type: CRUD_NEXT_PAGE,
                meta: { resource: 'bar' },
            }), {
                page: 3,
                total: 5,
            });
        });
        it('should throw an error if called while already at total', () => {
            assert.throws(() => pagination('bar')({ page: 5, total: 5 }, {
                type: CRUD_NEXT_PAGE,
                meta: { resource: 'bar' },
            }), Error);
        });
    });


    describe('CRUD_PREV_PAGE', () => {
        it('should decrease the page', () => {
            assert.deepEqual(pagination('bar')({ page: 2, total: 5 }, {
                type: CRUD_PREV_PAGE,
                meta: { resource: 'bar' },
            }), {
                page: 1,
                total: 5,
            });
        });
        it('should throw an error if called while already at first page', () => {
            assert.throws(() => pagination('bar')({ page: 1, total: 5 }, {
                type: CRUD_PREV_PAGE,
                meta: { resource: 'bar' },
            }), Error);
        });
    });

    describe('CRUD_FIRST_PAGE', () => {
        it('should set page to 1', () => {
            assert.deepEqual(pagination('bar')({ page: 2, total: 5 }, {
                type: CRUD_FIRST_PAGE,
                meta: { resource: 'bar' },
            }), {
                page: 1,
                total: 5,
            });
        });
    });

    describe('CRUD_LAST_PAGE', () => {
        it('should set page to total', () => {
            assert.deepEqual(pagination('bar')({ page: 2, total: 5 }, {
                type: CRUD_LAST_PAGE,
                meta: { resource: 'bar' },
            }), {
                page: 5,
                total: 5,
            });
        });
    });

    describe('CRUD_GOTO_PAGE', () => {
        it('should set the page', () => {
            assert.deepEqual(pagination('bar')({ page: 2, total: 5 }, {
                type: CRUD_GOTO_PAGE,
                payload: { page: 4 },
                meta: { resource: 'bar' },
            }), {
                page: 4,
                total: 5,
            });
        });
        it('should throw an error if called with an invalid page', () => {
            assert.throws(() => pagination('bar')({ page: 2, total: 5 }, {
                type: CRUD_GOTO_PAGE,
                payload: { page: 6 },
                meta: { resource: 'bar' },
            }), Error);
        });
    });
});
