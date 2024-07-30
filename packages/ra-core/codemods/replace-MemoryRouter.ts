import j from 'jscodeshift';

const reactRouterSources = ['react-router', 'react-router-dom'];

module.exports = (file, api: j.API) => {
    const j = api.jscodeshift;
    const root = j(file.source);

    reactRouterSources.forEach(reactRouterSource => {
        // Check if MemoryRouter is imported
        const memoryRouterImport = root
            .find(j.ImportDeclaration, {
                source: {
                    value: reactRouterSource,
                },
            })
            .find(j.ImportSpecifier, {
                imported: {
                    name: 'MemoryRouter',
                },
            });
        if (!memoryRouterImport.length) {
            return;
        }

        memoryRouterImport.remove();

        // Check if TestMemoryRouter is already imported
        const testMemoryRouterImport = root
            .find(j.ImportDeclaration, {
                source: {
                    value: 'react-admin',
                },
            })
            .find(j.ImportSpecifier, {
                imported: {
                    name: 'TestMemoryRouter',
                },
            });

        if (!testMemoryRouterImport.length) {
            // Add import for TestMemoryRouter
            const importSpecifier = j.importSpecifier(
                j.identifier('TestMemoryRouter')
            );
            const reactAdminImport = root.find(j.ImportDeclaration, {
                source: {
                    value: 'react-admin',
                },
            });
            if (reactAdminImport.length) {
                // Insert new import for TestMemoryRouter alongside other imports from react-admin
                reactAdminImport.replaceWith(({ node }) =>
                    j.importDeclaration(
                        [...(node.specifiers || []), importSpecifier],
                        node.source
                    )
                );
            } else {
                // Insert new import for TestMemoryRouter from react-admin just after the import from react-router
                root.find(j.ImportDeclaration, {
                    source: {
                        value: reactRouterSource,
                    },
                }).insertAfter(
                    j.importDeclaration(
                        [importSpecifier],
                        j.literal('react-admin')
                    )
                );
            }
        }

        // Replace MemoryRouter with TestMemoryRouter
        root.find(j.JSXElement, {
            openingElement: {
                name: {
                    name: 'MemoryRouter',
                },
            },
        })
            .find(j.Identifier, {
                name: 'MemoryRouter',
            })
            .replaceWith(() => j.jsxIdentifier('TestMemoryRouter'));
    });

    return root.toSource({ quote: 'single', lineTerminator: '\n' });
};
