// sum.test.js
import { IN_FILTER_REGEX, transformInFilter } from './transformInFilter';

it('should throw an error if the filter is not a string', () => {
    expect(() => transformInFilter(1)).toThrow(
        `Invalid '@in' filter value, expected a string matching '${IN_FILTER_REGEX.source}', got: 1`
    );
});

it('should throw an error if the filter does not match pattern', () => {
    expect(() => transformInFilter('1,2')).toThrow(
        `Invalid '@in' filter value, expected a string matching '${IN_FILTER_REGEX.source}', got: 1,2`
    );
});

it('should support empty arrays', () => {
    expect(transformInFilter('()')).toEqual([]);
});

it('should return an array of numbers', () => {
    expect(transformInFilter('(1)')).toEqual([1]);
    expect(transformInFilter('(1,2,3)')).toEqual([1, 2, 3]);
});

it('should return an array of strings', () => {
    expect(transformInFilter('(a)')).toEqual(['a']);
    expect(transformInFilter('(a,B,c-d)')).toEqual(['a', 'B', 'c-d']);
});

it('should return an array of quoted strings', () => {
    expect(transformInFilter('("a")')).toEqual(['a']);
    expect(transformInFilter('("a","B, c")')).toEqual(['a', 'B, c']);
});
