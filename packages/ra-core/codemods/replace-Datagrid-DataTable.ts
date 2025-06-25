import j from 'jscodeshift';

module.exports = (file, api: j.API) => {
    const j = api.jscodeshift;
    const root = j(file.source);

    const continueAfterImport = replaceImport(root, j);
    if (!continueAfterImport) {
        return root.toSource();
    }

    const continueAfterReplaceDatagrid = replaceDatagrid(root, j);
    if (!continueAfterReplaceDatagrid) {
        return root.toSource();
    }

    transformChildren(root, j);
    cleanImports(root, j);

    return root.toSource({ quote: 'single', lineTerminator: '\n' });
};

const replaceImport = (root, j) => {
    // Check if there is an import from react-admin
    const reactAdminImport = root.find(j.ImportDeclaration, {
        source: {
            value: 'react-admin',
        },
    });
    if (!reactAdminImport.length) {
        return false;
    }

    // Check if there is an import of DataGrid from react-admin
    const datagridImport = reactAdminImport.filter(path => {
        return path.node.specifiers.some(
            specifier =>
                j.ImportSpecifier.check(specifier) &&
                specifier.imported.name === 'Datagrid'
        );
    });
    if (!datagridImport.length) {
        return false;
    }

    // Replace import of DataGrid with DataTable
    reactAdminImport.replaceWith(({ node }) =>
        j.importDeclaration(
            node.specifiers.map(specifier => {
                if (
                    j.ImportSpecifier.check(specifier) &&
                    specifier.imported.name === 'Datagrid'
                ) {
                    return j.importSpecifier(j.identifier('DataTable'));
                }
                return specifier;
            }),
            node.source
        )
    );
    return true;
};

const replaceDatagrid = (root, j) => {
    // Find all instances of Datagrid
    const datagridComponents = root.find(j.JSXElement, {
        openingElement: {
            name: {
                type: 'JSXIdentifier',
                name: 'Datagrid',
            },
        },
    });

    if (!datagridComponents.length) {
        return false;
    }

    // Replace Datagrid with DataTable
    datagridComponents.replaceWith(({ node }) => {
        return {
            ...node,
            openingElement: {
                ...node.openingElement,
                name: j.jsxIdentifier('DataTable'),
                attributes: cleanAttributes(node, j),
            },
            closingElement: {
                ...node.closingElement,
                name: j.jsxIdentifier('DataTable'),
            },
        };
    });

    return true;
};

const cleanAttributes = (node, j) => {
    const initialAttributes = node.openingElement.attributes;

    // rename the `rowStyle` attribute to `rowSx` if it exists
    const rowSxRenamedAttributes = initialAttributes.map(attr => {
        if (j.JSXAttribute.check(attr) && attr.name.name === 'rowStyle') {
            return j.jsxAttribute(j.jsxIdentifier('rowSx'), attr.value);
        }
        return attr;
    });

    // rename the keys of the "sx" prop from "& .RaDatagrid-xxxx" to "& .RaDataTable-xxxx"
    const sxRenamedAttributes = rowSxRenamedAttributes.map(attr => {
        if (
            j.JSXAttribute.check(attr) &&
            attr.name.name === 'sx' &&
            j.JSXExpressionContainer.check(attr.value)
        ) {
            const expression = attr.value.expression;
            if (j.ObjectExpression.check(expression)) {
                expression.properties.map(prop => {
                    if (
                        j.ObjectProperty.check(prop) &&
                        j.Literal.check(prop.key) &&
                        typeof prop.key.value === 'string'
                    ) {
                        prop.key.value = prop.key.value.replace(
                            /RaDatagrid-/g,
                            'RaDataTable-'
                        );
                    }
                    return prop;
                });
                return attr;
            }
        }
        return attr;
    });

    // remove the `optimized` attribute if it exists
    const finalAttributes = sxRenamedAttributes.filter(
        attr => !(j.JSXAttribute.check(attr) && attr.name.name === 'optimized')
    );

    return finalAttributes;
};

const transformChildren = (root, j) => {
    // Find all instances of Datagrid
    const datagridComponents = root.find(j.JSXElement, {
        openingElement: {
            name: {
                type: 'JSXIdentifier',
                name: 'DataTable',
            },
        },
    });
    if (!datagridComponents.length) {
        return false;
    }

    // For each DataTable component, wrap its children in DataTable.Col
    datagridComponents.forEach(dataTableComponent => {
        const children = dataTableComponent.value.children.filter(child =>
            j.JSXElement.check(child)
        );
        children.forEach(child => {
            transformChild(root, j, child);
        });
    });
};

const transformChild = (root, j, child) => {
    let newChild;
    if (
        j.JSXElement.check(child) &&
        child.openingElement.name.type === 'JSXIdentifier' &&
        child.openingElement.name.name === 'TextField' &&
        !child.openingElement.attributes.some(
            attr =>
                j.JSXAttribute.check(attr) &&
                !['source', 'label', 'empty'].includes(attr.name.name)
        )
    ) {
        child.openingElement.name.name = 'DataTable.Col';
    } else if (
        j.JSXElement.check(child) &&
        child.openingElement.name.type === 'JSXIdentifier' &&
        child.openingElement.name.name === 'NumberField' &&
        !child.openingElement.attributes.some(
            attr =>
                j.JSXAttribute.check(attr) &&
                !['source', 'label', 'empty', 'options', 'locales'].includes(
                    attr.name.name
                )
        )
    ) {
        child.openingElement.name.name = 'DataTable.NumberCol';
    } else {
        newChild = wrapChild(j, child);

        // Replace the original child with the new child
        root.find(j.JSXElement, {
            openingElement: {
                name: {
                    type: 'JSXIdentifier',
                    name: 'DataTable',
                },
            },
        }).forEach(dataTableComponent => {
            dataTableComponent.value.children =
                dataTableComponent.value.children.map(c =>
                    c === child ? newChild : c
                );
        });
    }
};

const wrapChild = (j, child) => {
    const labelAttribute = child.openingElement.attributes.find(
        attr => j.JSXAttribute.check(attr) && attr.name.name === 'label'
    );
    const sourceAttribute = child.openingElement.attributes.find(
        attr => j.JSXAttribute.check(attr) && attr.name.name === 'source'
    );

    // Wrap the child in a DataTable.Col component
    return j.jsxElement(
        j.jsxOpeningElement(
            j.jsxIdentifier('DataTable.Col'),
            labelAttribute
                ? [labelAttribute]
                : sourceAttribute
                  ? [sourceAttribute]
                  : [],
            false
        ),
        j.jsxClosingElement(j.jsxIdentifier('DataTable.Col')),
        [j.jsxText('\n'), child, j.jsxText('\n')]
    );
};

const cleanImports = (root, j) => {
    // Check if there is still a use of TextField in the code
    const textFieldUsage = root.find(j.JSXElement, {
        openingElement: {
            name: {
                type: 'JSXIdentifier',
                name: 'TextField',
            },
        },
    });
    // Check if there is still a use of NumberField in the code
    const numberFieldUsage = root.find(j.JSXElement, {
        openingElement: {
            name: {
                type: 'JSXIdentifier',
                name: 'NumberField',
            },
        },
    });

    const imports = root.find(j.ImportDeclaration, {
        source: {
            value: 'react-admin',
        },
    });
    // Check if there is an import of TextField from react-admin
    const textFieldImport = imports.filter(path => {
        return path.node.specifiers.some(
            specifier =>
                j.ImportSpecifier.check(specifier) &&
                specifier.imported.name === 'TextField'
        );
    });
    const numberFieldImport = imports.filter(path => {
        return path.node.specifiers.some(
            specifier =>
                j.ImportSpecifier.check(specifier) &&
                specifier.imported.name === 'NumberField'
        );
    });

    if (!textFieldUsage.length && textFieldImport.length) {
        // Remove the import of TextField from react-admin
        textFieldImport.forEach(path => {
            path.node.specifiers = path.node.specifiers.filter(
                specifier =>
                    !(
                        j.ImportSpecifier.check(specifier) &&
                        specifier.imported.name === 'TextField'
                    )
            );
        });
        // Remove the import declaration if there are no more specifiers
        root.find(j.ImportDeclaration).forEach(path => {
            if (path.node.specifiers.length === 0) {
                j(path).remove();
            }
        });
    }
    if (!numberFieldUsage.length && numberFieldImport.length) {
        // Remove the import of NumberField from react-admin
        numberFieldImport.forEach(path => {
            path.node.specifiers = path.node.specifiers.filter(
                specifier =>
                    !(
                        j.ImportSpecifier.check(specifier) &&
                        specifier.imported.name === 'NumberField'
                    )
            );
        });
        // Remove the import declaration if there are no more specifiers
        root.find(j.ImportDeclaration).forEach(path => {
            if (path.node.specifiers.length === 0) {
                j(path).remove();
            }
        });
    }
};
