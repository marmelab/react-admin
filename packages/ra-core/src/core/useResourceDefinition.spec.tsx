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
                        name: 'posts',
                        hasList: true,
                        options: { label: 'Posts' },
                        recordRepresentation: 'title',
                    },
                    comments: {
                        name: 'comments',
                        options: { label: 'Comments' },
                    },
                }}
            >
                <UseResourceDefinition callback={callback} />
            </ResourceDefinitionContextProvider>
        );
        expect(callback).toHaveBeenCalledWith({
            name: 'posts',
            hasCreate: undefined,
            hasEdit: undefined,
            hasList: true,
            hasShow: undefined,
            recordRepresentation: 'title',
            options: { label: 'Posts' },
        });
    });
});
