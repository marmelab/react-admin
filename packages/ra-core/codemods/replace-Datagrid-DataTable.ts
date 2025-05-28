import j from 'jscodeshift';

module.exports = (file, api: j.API) => {
    const j = api.jscodeshift;
    const root = j(file.source);

    const continueAfterImport = replaceImport(root, j);
    if (!continueAfterImport) {
        return root.toSource();
    }

    const continueAfterComponent = replaceComponent(root, j);
    if (!continueAfterComponent) {
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

const replaceComponent = (root, j) => {
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
        const openingElement = j.jsxOpeningElement(
            j.jsxIdentifier('DataTable'),
            node.openingElement.attributes,
            node.openingElement.selfClosing
        );
        const closingElement = j.jsxClosingElement(
            j.jsxIdentifier('DataTable')
        );
        return j.jsxElement(openingElement, closingElement, node.children);
    });

    return true;
};
