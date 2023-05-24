import ts from 'typescript';
import path from 'path';

export const generateTypedComponentsForResource = (
    resource: string,
    out: string
) => {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    const resultFile = ts.createSourceFile(
        path.join(process.cwd(), out, `${resource}.tsx`),
        '',
        ts.ScriptTarget.Latest,
        /*setParentNodes*/ false,
        ts.ScriptKind.TS
    );

    const importRaComponentsDeclaration = getReactAdminComponentsImports();
    const importResourceDeclaration = getResourceImport(resource);
    const importReactDeclaration = getReactImport();

    // Generate a React component for each resource that reexport each component
    // by passing it the resource as a generic type
    // For instance the TextField component for the Category resource will be:
    // export const TextField = (props: TextFieldProps<Category>) => <RaTextField {...props} />;
    const exportsResourceComponents = Components.map(componentName => {
        return getComponentForResource(componentName, resource);
    });

    return [
        printer.printNode(
            ts.EmitHint.Unspecified,
            importReactDeclaration,
            resultFile
        ),
        printer.printNode(
            ts.EmitHint.Unspecified,
            importRaComponentsDeclaration,
            resultFile
        ),
        printer.printNode(
            ts.EmitHint.Unspecified,
            importResourceDeclaration,
            resultFile
        ),
        // Add a blank line between imports and exports
        '',
        ...exportsResourceComponents.flatMap(c => [
            printer.printNode(ts.EmitHint.Unspecified, c, resultFile),
            // Add a blank line between components
            '',
        ]),
    ].join('\n');
};

const getReactAdminComponentsImports = () => {
    return ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
            false,
            undefined,
            ts.factory.createNamedImports(
                Components.flatMap(c => [
                    // Create an import for the component renamed with a Ra prefix
                    ts.factory.createImportSpecifier(
                        undefined,
                        ts.factory.createIdentifier(c),
                        ts.factory.createIdentifier(`Ra${c}`)
                    ),
                    // Create an import for the component props
                    ts.factory.createImportSpecifier(
                        undefined,
                        undefined,
                        ts.factory.createIdentifier(`${c}Props`)
                    ),
                ])
            )
        ),
        ts.factory.createStringLiteral('react-admin')
    );
};

const getResourceImport = (resource: string) => {
    return ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
            false,
            undefined,
            ts.factory.createNamedImports([
                ts.factory.createImportSpecifier(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier(resource)
                ),
            ])
        ),
        ts.factory.createStringLiteral('../types')
    );
};

const getReactImport = () => {
    return ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
            false,
            ts.factory.createIdentifier('* as React'),
            undefined
        ),
        ts.factory.createStringLiteral('react')
    );
};

const getComponentForResource = (componentName: string, resource: string) => {
    return ts.factory.createVariableStatement(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
            [
                ts.factory.createVariableDeclaration(
                    ts.factory.createIdentifier(componentName),
                    undefined,
                    undefined,
                    ts.factory.createArrowFunction(
                        undefined,
                        undefined,
                        [
                            ts.factory.createParameterDeclaration(
                                undefined,
                                undefined,
                                ts.factory.createIdentifier('props'),
                                undefined,
                                ts.factory.createTypeReferenceNode(
                                    ts.factory.createIdentifier(
                                        `${componentName}Props`
                                    ),
                                    [
                                        ts.factory.createTypeReferenceNode(
                                            ts.factory.createIdentifier(
                                                resource
                                            ),
                                            undefined
                                        ),
                                    ]
                                ),
                                undefined
                            ),
                        ],
                        undefined,
                        ts.factory.createToken(
                            ts.SyntaxKind.EqualsGreaterThanToken
                        ),
                        ts.factory.createJsxSelfClosingElement(
                            ts.factory.createIdentifier(`Ra${componentName}`),
                            [
                                ts.factory.createTypeReferenceNode(
                                    ts.factory.createIdentifier(resource),
                                    undefined
                                ),
                            ],
                            ts.factory.createJsxAttributes([
                                ts.factory.createJsxSpreadAttribute(
                                    ts.factory.createIdentifier('props')
                                ),
                            ])
                        )
                    )
                ),
            ],
            ts.NodeFlags.Const
        )
    );
};

const Components = [
    'ArrayField',
    'BooleanField',
    'ChipField',
    'NumberField',
    'DateField',
    'EmailField',
    'FileField',
    'FunctionField',
    'ImageField',
    'ReferenceArrayField',
    'ReferenceField',
    'ReferenceManyCount',
    'ReferenceManyField',
    'RichTextField',
    'SelectField',
    'TextField',
    'UrlField',
    'WrapperField',
];
