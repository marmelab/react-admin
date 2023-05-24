import ts from 'typescript';

export const getResourcesFromFiles = (
    fileNames: string[],
    options: ts.CompilerOptions = {}
) => {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);

    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();
    let output: string[] = [];

    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            // Walk the tree to search for classes
            ts.forEachChild(sourceFile, visit);
        }
    }

    return output;

    function visit(node: ts.Node) {
        // Only consider exported nodes
        if (!isNodeExported(node)) {
            return;
        }

        const isInterfaceOrTypeAlias =
            ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node);

        if (isInterfaceOrTypeAlias && node.name) {
            let symbol = checker.getSymbolAtLocation(node.name);

            if (hasResourceJsDocTag(symbol)) {
                output.push(symbol.getName());
            }
        } else if (ts.isModuleDeclaration(node)) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }

    function hasResourceJsDocTag(symbol: ts.Symbol) {
        return symbol
            .getJsDocTags(checker)
            .some(tag => tag.name.toLowerCase() === `resource`);
    }

    function isNodeExported(node: ts.Node): boolean {
        return (
            (ts.getCombinedModifierFlags(node as ts.Declaration) &
                ts.ModifierFlags.Export) !==
                0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
        );
    }
};
