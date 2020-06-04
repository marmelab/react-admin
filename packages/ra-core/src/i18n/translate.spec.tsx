import * as React from 'react';
import { FunctionComponent } from 'react';
import expect from 'expect';

import translate from './translate';
import { TranslationContextProps } from './TranslationContext';

interface Props extends TranslationContextProps {
    foo: string;
}
describe('translate HOC', () => {
    it('should conserve base component default props', () => {
        const Component: FunctionComponent<Props> = () => <div />;
        Component.defaultProps = { foo: 'bar' };

        const TranslatedComponent = translate(Component);
        expect(TranslatedComponent.defaultProps).toEqual({ foo: 'bar' });
    });
});
