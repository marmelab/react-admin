import j from 'jscodeshift';

const adminComponentsWithHistoryPropRemoved = [
    'Admin',
    'AdminContext',
    'CoreAdmin',
    'CoreAdminContext',
];

module.exports = (file, api: j.API) => {
    const j = api.jscodeshift;
    const root = j(file.source);

    // Check if there is an import from history
    const historyImport = root.find(j.ImportDeclaration, {
        source: {
            value: 'history',
        },
    });
    if (!historyImport.length) {
        return root.toSource();
    }

    // Add import for TestMemoryRouter
    const importSpecifier = j.importSpecifier(j.identifier('TestMemoryRouter'));
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
        // Insert new import for TestMemoryRouter from react-admin just after the import from history
        root.find(j.ImportDeclaration, {
            source: {
                value: 'history',
            },
        }).insertAfter(
            j.importDeclaration([importSpecifier], j.literal('react-admin'))
        );
    }

    // Remove import from history
    historyImport.remove();

    // For each test
    root.find(j.CallExpression, {
        callee: {
            name: 'it',
        },
    }).forEach(test => {
        let initialEntries: j.ArrayExpression | undefined = undefined;

        // Remove variable declaration calling createMemoryHistory
        // and store initialEntries
        j(test)
            .find(j.VariableDeclaration, {
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
            })
            .map(variableDeclaration => {
                j(variableDeclaration)
                    .find(j.CallExpression, {
                        callee: {
                            name: 'createMemoryHistory',
                        },
                    })
                    .find(j.ObjectExpression)
                    .find(j.ObjectProperty, {
                        key: {
                            name: 'initialEntries',
                        },
                    })
                    .find(j.ArrayExpression)
                    .forEach(arrayValue => {
                        initialEntries = arrayValue.node;
                    });
                return variableDeclaration;
            })
            .remove();

        // Wrap Admin (and similar components) with TestMemoryRouter
        adminComponentsWithHistoryPropRemoved.forEach(adminComponentName => {
            j(test)
                .find(j.JSXElement, {
                    openingElement: {
                        name: {
                            name: adminComponentName,
                        },
                    },
                })
                .filter(
                    jsxElement =>
                        j(jsxElement).find(j.JSXAttribute, {
                            name: { name: 'history' },
                        }).length > 0
                )
                .replaceWith(({ node }) =>
                    j.jsxElement(
                        j.jsxOpeningElement(
                            j.jsxIdentifier('TestMemoryRouter'),
                            initialEntries
                                ? [
                                      j.jsxAttribute(
                                          j.jsxIdentifier('initialEntries'),
                                          j.jsxExpressionContainer(
                                              initialEntries
                                          )
                                      ),
                                  ]
                                : [],
                            false
                        ),
                        j.jsxClosingElement(
                            j.jsxIdentifier('TestMemoryRouter')
                        ),
                        [j.jsxText('\n'), node, j.jsxText('\n')]
                    )
                );
        });
    });

    // Remove history prop from Admin (and similar components)
    adminComponentsWithHistoryPropRemoved.forEach(adminComponentName => {
        root.find(j.JSXOpeningElement, {
            name: {
                name: adminComponentName,
            },
        })
            .find(j.JSXAttribute, {
                name: {
                    name: 'history',
                },
            })
            .remove();
    });

    return root.toSource({ quote: 'single', lineTerminator: '\n' });
};
