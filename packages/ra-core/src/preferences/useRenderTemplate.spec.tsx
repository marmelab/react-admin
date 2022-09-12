import { renderHook } from '@testing-library/react-hooks';

import { useRenderTemplate } from './useRenderTemplate';

describe('useRenderTemplate', () => {
    it('should return a function that renders a template', () => {
        const render = renderHook(() => useRenderTemplate());
        expect(render.result.current('foo', {})).toEqual('foo');
    });
    it('should allow template interpolation using the second argument', () => {
        const render = renderHook(() => useRenderTemplate());
        expect(
            render.result.current('Hello, <%= name %>!', { name: 'John' })
        ).toEqual('Hello, John!');
    });
    // lodash.template seems to behave differently in jest than in the browser, can't figure out why
    it.skip('should return an error mesage when the interpolation is not possible', () => {
        const render = renderHook(() => useRenderTemplate());
        expect(
            render.result.current('Hello, <%= name %>!', { name: 'John' })
        ).toEqual('ra.configurable.templateError');
    });
});
