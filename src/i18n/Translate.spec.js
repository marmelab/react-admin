import assert from 'assert';
import React from 'react';

import Translate from './Translate';

describe('Translate HOC', () => {
    it('should conserve base component default props', () => {
        const Component = () => <div />;
        Component.defaultProps = { foo: 'bar' };

        const TranslatedComponent = Translate(Component);
        assert.deepEqual(TranslatedComponent.defaultProps, { foo: 'bar' });
    });
});
