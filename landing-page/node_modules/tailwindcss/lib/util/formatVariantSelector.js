"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatVariantSelector: ()=>formatVariantSelector,
    eliminateIrrelevantSelectors: ()=>eliminateIrrelevantSelectors,
    finalizeSelector: ()=>finalizeSelector,
    handleMergePseudo: ()=>handleMergePseudo
});
const _postcssSelectorParser = /*#__PURE__*/ _interopRequireDefault(require("postcss-selector-parser"));
const _unesc = /*#__PURE__*/ _interopRequireDefault(require("postcss-selector-parser/dist/util/unesc"));
const _escapeClassName = /*#__PURE__*/ _interopRequireDefault(require("../util/escapeClassName"));
const _prefixSelector = /*#__PURE__*/ _interopRequireDefault(require("../util/prefixSelector"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/** @typedef {import('postcss-selector-parser').Root} Root */ /** @typedef {import('postcss-selector-parser').Selector} Selector */ /** @typedef {import('postcss-selector-parser').Pseudo} Pseudo */ /** @typedef {import('postcss-selector-parser').Node} Node */ /** @typedef {{format: string, isArbitraryVariant: boolean}[]} RawFormats */ /** @typedef {import('postcss-selector-parser').Root} ParsedFormats */ /** @typedef {RawFormats | ParsedFormats} AcceptedFormats */ let MERGE = ":merge";
function formatVariantSelector(formats, { context , candidate  }) {
    var _context_tailwindConfig_prefix;
    let prefix = (_context_tailwindConfig_prefix = context === null || context === void 0 ? void 0 : context.tailwindConfig.prefix) !== null && _context_tailwindConfig_prefix !== void 0 ? _context_tailwindConfig_prefix : "";
    // Parse the format selector into an AST
    let parsedFormats = formats.map((format)=>{
        let ast = (0, _postcssSelectorParser.default)().astSync(format.format);
        return {
            ...format,
            ast: format.isArbitraryVariant ? ast : (0, _prefixSelector.default)(prefix, ast)
        };
    });
    // We start with the candidate selector
    let formatAst = _postcssSelectorParser.default.root({
        nodes: [
            _postcssSelectorParser.default.selector({
                nodes: [
                    _postcssSelectorParser.default.className({
                        value: (0, _escapeClassName.default)(candidate)
                    })
                ]
            })
        ]
    });
    // And iteratively merge each format selector into the candidate selector
    for (let { ast  } of parsedFormats){
        [formatAst, ast] = handleMergePseudo(formatAst, ast);
        // 2. Merge the format selector into the current selector AST
        ast.walkNesting((nesting)=>nesting.replaceWith(...formatAst.nodes[0].nodes));
        // 3. Keep going!
        formatAst = ast;
    }
    return formatAst;
}
/**
 * Given any node in a selector this gets the "simple" selector it's a part of
 * A simple selector is just a list of nodes without any combinators
 * Technically :is(), :not(), :has(), etc… can have combinators but those are nested
 * inside the relevant node and won't be picked up so they're fine to ignore
 *
 * @param {Node} node
 * @returns {Node[]}
 **/ function simpleSelectorForNode(node) {
    /** @type {Node[]} */ let nodes = [];
    // Walk backwards until we hit a combinator node (or the start)
    while(node.prev() && node.prev().type !== "combinator"){
        node = node.prev();
    }
    // Now record all non-combinator nodes until we hit one (or the end)
    while(node && node.type !== "combinator"){
        nodes.push(node);
        node = node.next();
    }
    return nodes;
}
/**
 * Resorts the nodes in a selector to ensure they're in the correct order
 * Tags go before classes, and pseudo classes go after classes
 *
 * @param {Selector} sel
 * @returns {Selector}
 **/ function resortSelector(sel) {
    sel.sort((a, b)=>{
        if (a.type === "tag" && b.type === "class") {
            return -1;
        } else if (a.type === "class" && b.type === "tag") {
            return 1;
        } else if (a.type === "class" && b.type === "pseudo" && b.value.startsWith("::")) {
            return -1;
        } else if (a.type === "pseudo" && a.value.startsWith("::") && b.type === "class") {
            return 1;
        }
        return sel.index(a) - sel.index(b);
    });
    return sel;
}
function eliminateIrrelevantSelectors(sel, base) {
    let hasClassesMatchingCandidate = false;
    sel.walk((child)=>{
        if (child.type === "class" && child.value === base) {
            hasClassesMatchingCandidate = true;
            return false // Stop walking
            ;
        }
    });
    if (!hasClassesMatchingCandidate) {
        sel.remove();
    }
// We do NOT recursively eliminate sub selectors that don't have the base class
// as this is NOT a safe operation. For example, if we have:
// `.space-x-2 > :not([hidden]) ~ :not([hidden])`
// We cannot remove the [hidden] from the :not() because it would change the
// meaning of the selector.
// TODO: Can we do this for :matches, :is, and :where?
}
function finalizeSelector(current, formats, { context , candidate , base  }) {
    var _context_tailwindConfig;
    var _context_tailwindConfig_separator;
    let separator = (_context_tailwindConfig_separator = context === null || context === void 0 ? void 0 : (_context_tailwindConfig = context.tailwindConfig) === null || _context_tailwindConfig === void 0 ? void 0 : _context_tailwindConfig.separator) !== null && _context_tailwindConfig_separator !== void 0 ? _context_tailwindConfig_separator : ":";
    // Split by the separator, but ignore the separator inside square brackets:
    //
    // E.g.: dark:lg:hover:[paint-order:markers]
    //           ┬  ┬     ┬            ┬
    //           │  │     │            ╰── We will not split here
    //           ╰──┴─────┴─────────────── We will split here
    //
    base = base !== null && base !== void 0 ? base : candidate.split(new RegExp(`\\${separator}(?![^[]*\\])`)).pop();
    // Parse the selector into an AST
    let selector = (0, _postcssSelectorParser.default)().astSync(current);
    // Normalize escaped classes, e.g.:
    //
    // The idea would be to replace the escaped `base` in the selector with the
    // `format`. However, in css you can escape the same selector in a few
    // different ways. This would result in different strings and therefore we
    // can't replace it properly.
    //
    //               base: bg-[rgb(255,0,0)]
    //   base in selector: bg-\\[rgb\\(255\\,0\\,0\\)\\]
    //       escaped base: bg-\\[rgb\\(255\\2c 0\\2c 0\\)\\]
    //
    selector.walkClasses((node)=>{
        if (node.raws && node.value.includes(base)) {
            node.raws.value = (0, _escapeClassName.default)((0, _unesc.default)(node.raws.value));
        }
    });
    // Remove extraneous selectors that do not include the base candidate
    selector.each((sel)=>eliminateIrrelevantSelectors(sel, base));
    // If there are no formats that means there were no variants added to the candidate
    // so we can just return the selector as-is
    let formatAst = Array.isArray(formats) ? formatVariantSelector(formats, {
        context,
        candidate
    }) : formats;
    if (formatAst === null) {
        return selector.toString();
    }
    let simpleStart = _postcssSelectorParser.default.comment({
        value: "/*__simple__*/"
    });
    let simpleEnd = _postcssSelectorParser.default.comment({
        value: "/*__simple__*/"
    });
    // We can safely replace the escaped base now, since the `base` section is
    // now in a normalized escaped value.
    selector.walkClasses((node)=>{
        if (node.value !== base) {
            return;
        }
        let parent = node.parent;
        let formatNodes = formatAst.nodes[0].nodes;
        // Perf optimization: if the parent is a single class we can just replace it and be done
        if (parent.nodes.length === 1) {
            node.replaceWith(...formatNodes);
            return;
        }
        let simpleSelector = simpleSelectorForNode(node);
        parent.insertBefore(simpleSelector[0], simpleStart);
        parent.insertAfter(simpleSelector[simpleSelector.length - 1], simpleEnd);
        for (let child of formatNodes){
            parent.insertBefore(simpleSelector[0], child.clone());
        }
        node.remove();
        // Re-sort the simple selector to ensure it's in the correct order
        simpleSelector = simpleSelectorForNode(simpleStart);
        let firstNode = parent.index(simpleStart);
        parent.nodes.splice(firstNode, simpleSelector.length, ...resortSelector(_postcssSelectorParser.default.selector({
            nodes: simpleSelector
        })).nodes);
        simpleStart.remove();
        simpleEnd.remove();
    });
    // Remove unnecessary pseudo selectors that we used as placeholders
    selector.walkPseudos((p)=>{
        if (p.value === MERGE) {
            p.replaceWith(p.nodes);
        }
    });
    // Move pseudo elements to the end of the selector (if necessary)
    selector.each((sel)=>{
        let pseudoElements = collectPseudoElements(sel);
        if (pseudoElements.length > 0) {
            sel.nodes.push(pseudoElements.sort(sortSelector));
        }
    });
    return selector.toString();
}
function handleMergePseudo(selector, format) {
    /** @type {{pseudo: Pseudo, value: string}[]} */ let merges = [];
    // Find all :merge() pseudo-classes in `selector`
    selector.walkPseudos((pseudo)=>{
        if (pseudo.value === MERGE) {
            merges.push({
                pseudo,
                value: pseudo.nodes[0].toString()
            });
        }
    });
    // Find all :merge() "attachments" in `format` and attach them to the matching selector in `selector`
    format.walkPseudos((pseudo)=>{
        if (pseudo.value !== MERGE) {
            return;
        }
        let value = pseudo.nodes[0].toString();
        // Does `selector` contain a :merge() pseudo-class with the same value?
        let existing = merges.find((merge)=>merge.value === value);
        // Nope so there's nothing to do
        if (!existing) {
            return;
        }
        // Everything after `:merge()` up to the next combinator is what is attached to the merged selector
        let attachments = [];
        let next = pseudo.next();
        while(next && next.type !== "combinator"){
            attachments.push(next);
            next = next.next();
        }
        let combinator = next;
        existing.pseudo.parent.insertAfter(existing.pseudo, _postcssSelectorParser.default.selector({
            nodes: attachments.map((node)=>node.clone())
        }));
        pseudo.remove();
        attachments.forEach((node)=>node.remove());
        // What about this case:
        // :merge(.group):focus > &
        // :merge(.group):hover &
        if (combinator && combinator.type === "combinator") {
            combinator.remove();
        }
    });
    return [
        selector,
        format
    ];
}
// Note: As a rule, double colons (::) should be used instead of a single colon
// (:). This distinguishes pseudo-classes from pseudo-elements. However, since
// this distinction was not present in older versions of the W3C spec, most
// browsers support both syntaxes for the original pseudo-elements.
let pseudoElementsBC = [
    ":before",
    ":after",
    ":first-line",
    ":first-letter"
];
// These pseudo-elements _can_ be combined with other pseudo selectors AND the order does matter.
let pseudoElementExceptions = [
    "::file-selector-button",
    // Webkit scroll bar pseudo elements can be combined with user-action pseudo classes
    "::-webkit-scrollbar",
    "::-webkit-scrollbar-button",
    "::-webkit-scrollbar-thumb",
    "::-webkit-scrollbar-track",
    "::-webkit-scrollbar-track-piece",
    "::-webkit-scrollbar-corner",
    "::-webkit-resizer"
];
/**
 * This will make sure to move pseudo's to the correct spot (the end for
 * pseudo elements) because otherwise the selector will never work
 * anyway.
 *
 * E.g.:
 *  - `before:hover:text-center` would result in `.before\:hover\:text-center:hover::before`
 *  - `hover:before:text-center` would result in `.hover\:before\:text-center:hover::before`
 *
 * `::before:hover` doesn't work, which means that we can make it work for you by flipping the order.
 *
 * @param {Selector} selector
 **/ function collectPseudoElements(selector) {
    /** @type {Node[]} */ let nodes = [];
    for (let node of selector.nodes){
        if (isPseudoElement(node)) {
            nodes.push(node);
            selector.removeChild(node);
        }
        if (node === null || node === void 0 ? void 0 : node.nodes) {
            nodes.push(...collectPseudoElements(node));
        }
    }
    return nodes;
}
// This will make sure to move pseudo's to the correct spot (the end for
// pseudo elements) because otherwise the selector will never work
// anyway.
//
// E.g.:
//  - `before:hover:text-center` would result in `.before\:hover\:text-center:hover::before`
//  - `hover:before:text-center` would result in `.hover\:before\:text-center:hover::before`
//
// `::before:hover` doesn't work, which means that we can make it work
// for you by flipping the order.
function sortSelector(a, z) {
    // Both nodes are non-pseudo's so we can safely ignore them and keep
    // them in the same order.
    if (a.type !== "pseudo" && z.type !== "pseudo") {
        return 0;
    }
    // If one of them is a combinator, we need to keep it in the same order
    // because that means it will start a new "section" in the selector.
    if (a.type === "combinator" ^ z.type === "combinator") {
        return 0;
    }
    // One of the items is a pseudo and the other one isn't. Let's move
    // the pseudo to the right.
    if (a.type === "pseudo" ^ z.type === "pseudo") {
        return (a.type === "pseudo") - (z.type === "pseudo");
    }
    // Both are pseudo's, move the pseudo elements (except for
    // ::file-selector-button) to the right.
    return isPseudoElement(a) - isPseudoElement(z);
}
function isPseudoElement(node) {
    if (node.type !== "pseudo") return false;
    if (pseudoElementExceptions.includes(node.value)) return false;
    return node.value.startsWith("::") || pseudoElementsBC.includes(node.value);
}
