import React from 'react';
import { render } from '@testing-library/react';

import { useResourceDefinition } from './useResourceDefinition';
import { ResourceDefinitionContextProvider } from './ResourceDefinitionContext';

describe('useResourceDefinition', () => {
    const UseResourceDefinition = ({
        resource = 'posts',
        callback,
    }: {
        resource?: string;
        callback: (params: any) => void;
    }) => {
        const resourceDefinition = useResourceDefinition({ resource });
        callback(resourceDefinition);
        return <span />;
    };

    it('should not fail when used outside of a ResourceDefinitionContext', () => {
        const callback = jest.fn();
        render(<UseResourceDefinition callback={callback} />);
        expect(callback).toHaveBeenCalledWith({
            hasCreate: undefined,
            hasEdit: undefined,
            hasList: undefined,
            hasShow: undefined,
        });
    });

    it('should use the definition from ResourceDefinitionContext', () => {
        const callback = jest.fn();
        render(
            <ResourceDefinitionContextProvider
                definitions={{
                    posts: {
                        options: { label: 'Posts' },
                    },
                    comments: {
                        options: { label: 'Comments' },
                    },
                }}
            >
                <UseResourceDefinition callback={callback} />
            </ResourceDefinitionContextProvider>
        );
        expect(callback).toHaveBeenCalledWith({
            hasCreate: undefined,
            hasEdit: undefined,
            hasList: undefined,
            hasShow: undefined,
            options: { label: 'Posts' },
        });
    });
});
