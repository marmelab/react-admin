/**
 * Escape special characters in path so that react-router Route does not do any special treatment
 *
 * @see https://github.com/ReactTraining/react-router/blob/v3/docs/guides/RouteMatching.md#path-syntax
 *
 * @example
 *
 * escapePath('/foo(bar)') => 'foo\(bar\)'
 */
export default url => url.replace(/(\(|\))/g, '\\$1');
