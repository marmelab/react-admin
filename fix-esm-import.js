const fs = require('fs');
const path = require('path');

/**
 * This jscodeshift transform will:
 * 1. Change imports like './a' to './a.js' if 'a' is not a directory.
 * 2. Apply the change recursively to nested imports in imported files.
 */

module.exports = function (fileInfo, api) {
    const j = api.jscodeshift; // jscodeshift API for working with AST
    const root = j(fileInfo.source); // Parse the source code into an AST
    const fileDir = path.dirname(fileInfo.path); // Directory of the current file

    // Function to check if a file exists as a JS file
    function resolveImportPath(importPath) {
        const fullPath = path.resolve(fileDir, importPath);

        // Check if the import path is a directory
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
            return importPath + '/index.js'; // It's a directory, need to add index.js
        }

        // Check if it's a file without the .js extension
        if (
            fs.existsSync(fullPath + '.ts') ||
            fs.existsSync(fullPath + '.tsx')
        ) {
            return importPath + '.js'; // If we should add a js extension add one
        }

        // Otherwise, return importPath
        return importPath;
    }

    // Find all import declarations
    root.find(j.ImportDeclaration).forEach(path => {
        const source = path.node.source.value;

        // If the import is relative (starts with './' or '../')
        if (source.startsWith('.')) {
            const newSource = resolveImportPath(source);

            // If the source was changed (i.e., we appended `.js`), update the import path
            if (newSource !== source) {
                path.node.source.value = newSource;
            }
        }
    });

    // Handle export * from statements
    root.find(j.ExportAllDeclaration).forEach(path => {
        const source = path.node.source.value;

        // If the export * from path is relative (starts with './' or '../')
        if (source.startsWith('./') || source.startsWith('../')) {
            const newSource = resolveImportPath(source);

            // If the source was changed (i.e., we appended `.js`), update the export path
            if (newSource !== source) {
                path.node.source.value = newSource;
            }
        }
    });

    // Handle export { ... } from statements
    root.find(j.ExportNamedDeclaration).forEach(path => {
        const source = path.node.source?.value;

        // If there's a source and it's relative (starts with './' or '../')
        if (source && (source.startsWith('./') || source.startsWith('../'))) {
            const newSource = resolveImportPath(source);

            // If the source was changed (i.e., we appended `.js`), update the export path
            if (newSource !== source) {
                path.node.source.value = newSource;
            }
        }
    });

    // Find import declarations that are importing from submodule of @mui/material except @mui/material/styles
    root.find(j.ImportDeclaration).forEach(path => {
        const importSource = path.node.source.value;

        // Check if the import source starts with '@mui/material/'
        if (
            importSource.startsWith('@mui/material/') &&
            !importSource.startsWith('@mui/material/styles')
        ) {
            // If the import does not already end with '.js', modify the path
            if (!importSource.endsWith('.js')) {
                path.node.source.value = `${importSource}/index.js`;
            }
        }
    });

    // Find all imports from '@mui/material/styles'
    const imports = root
        .find(j.ImportDeclaration)
        .filter(path => path.node.source.value === '@mui/material/styles');

    if (imports.length > 0) {
        // Collect all named imports for '@mui/material/styles'
        let namedImports = [];
        imports.forEach(importPath => {
            importPath.node.specifiers.forEach(specifier => {
                if (specifier.type === 'ImportSpecifier') {
                    namedImports.push(specifier.imported.name);
                }
            });
        });

        // Deduplicate imports
        namedImports = [...new Set(namedImports)];

        // Remove any duplicate import declarations
        imports.filter((path, index) => index !== 0).remove();

        imports.forEach(importPath => {
            importPath.node.specifiers = namedImports.map(name =>
                j.importSpecifier(j.identifier(name))
            );
        });
    }

    //Find all import declarations from '@mui/material/styles'
    // root
    // .find(j.ImportDeclaration, {
    //   source: { value: '@mui/material/styles' }
    // })
    // .forEach(path => {
    //   // Collect all named imports
    //   const namedImports = path.node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier');
    //
    //   // Create a new import statement for the default import `pkg`
    //   const newImport = j.importDeclaration(
    //     [j.importDefaultSpecifier(j.identifier('pkg'))],
    //     j.literal('@mui/material/styles/index.js')
    //   );
    //
    //   // Replace the original import statement with the new import
    //   j(path).replaceWith(newImport);
    //
    //   // After replacing the import, insert the unpacking const statement
    //   if (namedImports.length > 0) {
    //     // Create destructuring for all named imports
    //     const unpackStatement = j.variableDeclaration('const', [
    //       j.variableDeclarator(
    //         j.objectPattern(
    //           namedImports.map(specifier =>
    //             j.property('init', j.identifier(specifier.imported.name), j.identifier(specifier.local.name))
    //           )
    //         ),
    //         j.identifier('pkg')
    //       )
    //     ]);
    //
    //     // Insert this unpacking statement after the last import
    //     root
    //       .find(j.ImportDeclaration)
    //       .at(-1) // Insert after the last import statement
    //       .insertAfter(unpackStatement);
    //   }
    // });

    // Find import declarations that are importing from @mui/icons-material/xxx or any other submodule of @mui/icons-material
    root.find(j.ImportDeclaration).forEach(path => {
        const importSource = path.node.source.value;

        // Check if the import source starts with '@mui/icons-material/'
        if (importSource.startsWith('@mui/icons-material/')) {
            // If the import does not already end with '.js', modify the path
            if (!importSource.endsWith('.js')) {
                path.node.source.value = `${importSource}.js`;
            }
        }
    });

    // Find import declarations where the source path starts with lodash/
    root.find(j.ImportDeclaration, {
        source: { value: value => value.startsWith('lodash/') },
    }).forEach(path => {
        // Get the current source value (e.g., 'lodash/xxx')
        const currentPath = path.node.source.value;

        // Check if the path does not already end with '.js'
        if (!currentPath.endsWith('.js')) {
            // Append '.js' to the end of the import path (e.g., 'lodash/xxx' -> 'lodash/xxx.js')
            path.node.source.value = `${currentPath}.js`;
        }
    });

    // Find import declarations that are importing from jsonexport/dist
    root.find(j.ImportDeclaration, {
        source: { value: 'jsonexport/dist' },
    }).forEach(path => {
        // Update the import source to jsonexport/dist/index.js
        path.node.source.value = 'jsonexport/dist/index.js';
    });

    // Return the transformed code as a string
    return root.toSource();
};
