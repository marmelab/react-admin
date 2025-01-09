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

    // Find import declarations that are importing from @mui/material/styles or any other submodule of @mui/material
    root.find(j.ImportDeclaration).forEach(path => {
        const importSource = path.node.source.value;

        // Check if the import source starts with '@mui/material/'
        if (importSource.startsWith('@mui/material/')) {
            // If the import does not already end with '.js', modify the path
            if (!importSource.endsWith('.js')) {
                path.node.source.value = `${importSource}/index.js`;
            }
        }
    });

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
