import path from 'node:path';
import fs from 'node:fs';

const packagesDir = path.join(__dirname, '..', 'packages');
const examplesDir = path.join(__dirname, '..', 'examples');
const excludePackages = new Set(['create-react-admin']);

const updatePackages = async () => {
    const packageNames = (await fs.promises.readdir(packagesDir))
        .filter(name => !excludePackages.has(name))
        .map(name => path.join(packagesDir, name));

    const packagesToUpdate = [
        ...packageNames,
        path.join(examplesDir, 'data-generator'),
    ];

    await Promise.all(
        packagesToUpdate.map(async packagePath => {
            const stats = await fs.promises.stat(packagePath);
            if (stats.isDirectory()) {
                await updatePackageExports(packagePath);
            }
        })
    );
};

updatePackages().catch(err => {
    console.error('Error updating package exports:', err);
    process.exit(1);
});

const updatePackageExports = async (packagePath: string) => {
    const packageJsonPath = path.join(packagePath, 'package.json');
    const packageJson = await import(packageJsonPath).then(
        mod => mod.default || mod
    );

    const exportsField: Record<string, any> = {};

    // This is the current exports field:
    // "exports": {
    //     ".": {
    //         "types": "./dist/index.d.cts",
    //         "import": "./dist/index.js",
    //         "require": "./dist/index.cjs"
    //     }
    // }
    // We want to update it to:
    // "exports": {
    //     ".": {
    //         "import": {
    //             "types": "./dist/index.d.ts",
    //             "default": "./dist/index.js"
    //         },
    //         "require": {
    //             "types": "./dist/index.d.cts",
    //             "default": "./dist/index.cjs"
    //         }
    //     }
    // }

    exportsField['.'] = {
        import: {
            types: './dist/index.d.ts',
            default: './dist/index.js',
        },
        require: {
            types: './dist/index.d.cts',
            default: './dist/index.cjs',
        },
    };

    packageJson.exports = exportsField;

    await fs.promises.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf-8'
    );
};
