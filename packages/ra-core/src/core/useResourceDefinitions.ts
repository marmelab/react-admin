import { ResourceDefinitions } from './ResourceDefinitionContext';
import { useResourceDefinitionContext } from './useResourceDefinitionContext';

/**
 * Get the definition of the all resources
 *
 * @example
 *
 * const definitions = useResourceDefinitions();
 * console.log(definitions.posts);
 * // {
 * //   name: 'posts',
 * //   hasList: true,
 * //   hasEdit: true,
 * //   hasShow: true,
 * //   hasCreate: true,
 * //   options: {},
 * //   icon: PostIcon,
 * // }
 */
export const useResourceDefinitions = (): ResourceDefinitions =>
    useResourceDefinitionContext().definitions;
