import React from 'react';
import { render } from '@testing-library/react';

import { useResourceDefinitions } from './useResourceDefinitions';
import { ResourceDefinitionContextProvider } from './ResourceDefinitionContext';

describe('useResourceDefinitions', () => {
    const UseResourceDefinitions = ({
        callback,
    }: {
        resource?: string;
        callback: (params: any) => void;
    }) => {
        const resourceDefinition = useResourceDefinitions();
        callback(resourceDefinition);
        return <span />;
    };

    it('should not fail when used outside of a ResourceDefinitionContext', () => {
        const callback = jest.fn();
        render(<UseResourceDefinitions callback={callback} />);
        expect(callback).toHaveBeenCalledWith({});
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
                <UseResourceDefinitions callback={callback} />
            </ResourceDefinitionContextProvider>
        );
        expect(callback).toHaveBeenCalledWith({
            posts: {
                options: { label: 'Posts' },
            },
            comments: {
                options: { label: 'Comments' },
            },
        });
    });
});
