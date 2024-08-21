// sum.test.js
import { transformOrFilter } from './transformOrFilter';

it('should throw an error if the value is not an object', () => {
    expect(() => transformOrFilter([])).toThrow(
        "Invalid '@or' filter, expected an object"
    );
});

it('should throw an error if the object is empty', () => {
    expect(() => transformOrFilter({})).toThrow(
        "Invalid '@or' filter, object is empty"
    );
});

it('should return the query value', () => {
    expect(transformOrFilter({ 'last_name@ilike': 'one' })).toEqual('one');
    expect(
        transformOrFilter({
            'last_name@ilike': 'one',
            'first_name@ilike': 'one',
        })
    ).toEqual('one');
});
