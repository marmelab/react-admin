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

    const continueAfterWrap = wrapChildren(root, j);
    if (!continueAfterWrap) {
        return root.toSource();
    }

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
        const attributes = cleanAttributes(node, j);

        const openingElement = j.jsxOpeningElement(
            j.jsxIdentifier('DataTable'),
            attributes,
            [node.openingElement.selfClosing]
        );
        const closingElement = j.jsxClosingElement(
            j.jsxIdentifier('DataTable')
        );
        return j.jsxElement(openingElement, closingElement, node.children);
    });

    return true;
};

const cleanAttributes = (node, j) => {
    // remove the `optimized` attribute if it exists
    const filtredAttributes = node.openingElement.attributes.filter(
        attr => !(j.JSXAttribute.check(attr) && attr.name.name === 'optimized')
    );

    // rename the `rowStyle` attribute to `rowSx` if it exists
    const rowSxRenamedAttributes = filtredAttributes.map(attr => {
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
                const properties = expression.properties.map(prop => {
                    if (
                        j.ObjectProperty.check(prop) &&
                        j.Literal.check(prop.key) &&
                        typeof prop.key.value === 'string'
                    ) {
                        const newKey = prop.key.value.replace(
                            /RaDatagrid-/g,
                            'RaDataTable-'
                        );
                        return j.objectProperty(j.literal(newKey), prop.value);
                    }
                    return prop;
                });
                return j.jsxAttribute(
                    j.jsxIdentifier('sx'),
                    j.jsxExpressionContainer(j.objectExpression(properties))
                );
            }
        }
        return attr;
    });

    return sxRenamedAttributes;
};

const wrapChildren = (root, j) => {
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
            wrapChild(root, j, child);
        });
    });
};

const wrapChild = (root, j, child) => {
    // Wrap the child in a DataTable.Col component
    const wrappedChild = j.jsxElement(
        j.jsxOpeningElement(
            j.jsxIdentifier('DataTable.Col'),
            [
                j.jsxAttribute(
                    j.jsxIdentifier('source'),
                    j.stringLiteral(
                        child.openingElement.attributes.find(
                            attr =>
                                j.JSXAttribute.check(attr) &&
                                attr.name.name === 'source'
                        )?.value?.value || ''
                    )
                ),
            ],
            false
        ),
        j.jsxClosingElement(j.jsxIdentifier('DataTable.Col')),
        [j.jsxText('\n'), child, j.jsxText('\n')]
    );

    // Replace the original child with the wrapped child
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
                c === child ? wrappedChild : c
            );
    });
};
