import { useCallback } from 'react';
import template from 'lodash/template';

import { useTranslate } from '../i18n';

/**
 * Get a render function for rendering a lodash template
 *
 * @example
 * const render = useRenderTemplate();
 * render('Hello <%= name %>!', { name: 'John' }); // Hello John!
 */
export const useRenderTemplate = () => {
    const translate = useTranslate();
    return useCallback(
        (templateString: string, data: any, defaultErrorMessage?: string) => {
            try {
                return template(templateString)(data);
            } catch (e) {
                return (
                    defaultErrorMessage ??
                    translate('ra.configurable.templateError', {
                        _: '# template error #',
                    })
                );
            }
        },
        [translate]
    );
};
