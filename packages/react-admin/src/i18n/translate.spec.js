import React from 'react';

import translate from './translate';

describe('translate HOC', () => {
    it('should conserve base component default props', () => {
        const Component = () => <div />;
        Component.defaultProps = { foo: 'bar' };

        const TranslatedComponent = translate(Component);
        expect(TranslatedComponent.defaultProps).toEqual({ foo: 'bar' });
    });
});
