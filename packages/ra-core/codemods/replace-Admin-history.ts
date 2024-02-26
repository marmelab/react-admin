import jscodeshift from 'jscodeshift';

const adminComponentsWithHistoryPropRemoved = [
    'Admin',
    'AdminContext',
    'CoreAdmin',
    'CoreAdminContext',
];

module.exports = (file, api: jscodeshift.API) => {
    const jscodeshift = api.jscodeshift;
    const root = jscodeshift(file.source);

    // Check if there is an import from history
    const historyImport = root.find(jscodeshift.ImportDeclaration, {
        source: {
            value: 'history',
        },
    });
    if (!historyImport.length) {
        return root.toSource({ quote: 'single', lineTerminator: '\n' });
    }

    // Add import for TestMemoryRouter
    const importSpecifier = jscodeshift.importSpecifier(
        jscodeshift.identifier('TestMemoryRouter')
    );
    const reactAdminImport = root.find(jscodeshift.ImportDeclaration, {
        source: {
            value: 'react-admin',
        },
    });
    if (reactAdminImport.length) {
        // Insert new import for TestMemoryRouter alongside other imports from react-admin
        reactAdminImport.replaceWith(({ node }) =>
            jscodeshift.importDeclaration(
                [...(node.specifiers || []), importSpecifier],
                node.source
            )
        );
    } else {
        // Insert new import for TestMemoryRouter from react-admin just after the import from history
        root.find(jscodeshift.ImportDeclaration, {
            source: {
                value: 'history',
            },
        }).insertAfter(
            jscodeshift.importDeclaration(
                [importSpecifier],
                jscodeshift.literal('react-admin')
            )
        );
    }

    // Remove import from history
    historyImport.remove();

    // Remove variable declaration calling createMemoryHistory
    root.find(jscodeshift.VariableDeclaration, {
        declarations: [
            {
                init: {
                    type: 'CallExpression',
                    callee: {
                        name: 'createMemoryHistory',
                    },
                },
            },
        ],
    }).remove();

    // Wrap Admin (and similar components) with TestMemoryRouter
    adminComponentsWithHistoryPropRemoved.forEach(componentName => {
        root.find(jscodeshift.JSXElement, {
            openingElement: {
                name: {
                    name: componentName,
                },
            },
        })
            .filter(
                path =>
                    jscodeshift(path).find(jscodeshift.JSXAttribute, {
                        name: { name: 'history' },
                    }).length > 0
            )
            .replaceWith(({ node }) =>
                jscodeshift.jsxElement(
                    jscodeshift.jsxOpeningElement(
                        jscodeshift.jsxIdentifier('TestMemoryRouter'),
                        [],
                        false
                    ),
                    jscodeshift.jsxClosingElement(
                        jscodeshift.jsxIdentifier('TestMemoryRouter')
                    ),
                    [jscodeshift.jsxText('\n'), node, jscodeshift.jsxText('\n')]
                )
            );
    });

    // Remove history prop from Admin (and similar components)
    adminComponentsWithHistoryPropRemoved.forEach(componentName => {
        root.find(jscodeshift.JSXOpeningElement, {
            name: {
                name: componentName,
            },
        })
            .find(jscodeshift.JSXAttribute, {
                name: {
                    name: 'history',
                },
            })
            .remove();
    });

    return root.toSource({ quote: 'single', lineTerminator: '\n' });
};
