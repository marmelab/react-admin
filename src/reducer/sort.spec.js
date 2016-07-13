import sort from './sort';
import { CRUD_SET_SORT } from '../actions/sortActions';

import assert from 'assert';

describe('sort', () => {
    it('should not modify the state when the action resource does not match the reducer resource', () => {
        assert.deepEqual(sort('foo')('unchanged', {
            type: CRUD_SET_SORT,
            meta: { resource: 'bar' },
        }), 'unchanged');
    });

    it('should modify the state when the action resource does match the reducer resource', () => {
        assert.deepEqual(sort('bar')({}, {
            type: CRUD_SET_SORT,
            meta: { resource: 'bar' },
            payload: {
                field: 'a',
                order: 'b',
            },
        }), {
            field: 'a',
            order: 'b',
        });
    });

    it('should return default sort order (field: id, sort: DESC)', () => {
        assert.deepEqual(sort('foo')(undefined, { meta: { resource: 'foo' } }), { field: 'id', order: 'DESC' });
    });

    describe('CRUD_SET_SORT', () => {
        it('should set the sort field and order', () => {
            assert.deepEqual(sort('bar')({ field: 'a', order: 'b' }, {
                type: CRUD_SET_SORT,
                meta: { resource: 'bar' },
                payload: {
                    field: 'c',
                    order: 'd',
                },
            }), {
                field: 'c',
                order: 'd',
            });
        });
        it('should reverse the order when sorting on the current state field', () => {
            assert.deepEqual(sort('bar')({ field: 'foo', order: 'ASC' }, {
                type: CRUD_SET_SORT,
                meta: { resource: 'bar' },
                payload: {
                    field: 'foo',
                },
            }), { field: 'foo', order: 'DESC' });
        });
    });
});
