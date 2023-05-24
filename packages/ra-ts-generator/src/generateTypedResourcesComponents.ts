import path from 'path';
import fsExtra from 'fs-extra';
import { execa } from 'execa';
import { generateTypedComponentsForResource } from './generateTypedComponents.js';

export const generateTypedResourcesComponents = async (
    resources: string[],
    out: string,
    features: { eslint: boolean; prettier: boolean }
) => {
    const files = await Promise.all(
        resources.map(async resource => {
            const resourceFileContent = generateTypedComponentsForResource(
                resource,
                out
            );

            await fsExtra.outputFile(
                path.join(process.cwd(), out, `${resource}.tsx`),
                resourceFileContent
            );

            return path.join(process.cwd(), out, `${resource}.tsx`);
        })
    );

    if (features.eslint) {
        // Run eslint on the generated files
        await execa('npx', ['eslint', '--fix', ...files]);
    }

    if (features.prettier) {
        // Run prettier on the generated files
        await execa('npx', ['prettier', '--write', ...files]);
    }
};
