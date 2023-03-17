"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>expandTailwindAtRules
});
const _fs = /*#__PURE__*/ _interopRequireDefault(require("fs"));
const _quickLru = /*#__PURE__*/ _interopRequireDefault(require("quick-lru"));
const _sharedState = /*#__PURE__*/ _interopRequireWildcard(require("./sharedState"));
const _generateRules = require("./generateRules");
const _log = /*#__PURE__*/ _interopRequireDefault(require("../util/log"));
const _cloneNodes = /*#__PURE__*/ _interopRequireDefault(require("../util/cloneNodes"));
const _defaultExtractor = require("./defaultExtractor");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
let env = _sharedState.env;
const builtInExtractors = {
    DEFAULT: _defaultExtractor.defaultExtractor
};
const builtInTransformers = {
    DEFAULT: (content)=>content,
    svelte: (content)=>content.replace(/(?:^|\s)class:/g, " ")
};
function getExtractor(context, fileExtension) {
    let extractors = context.tailwindConfig.content.extract;
    return extractors[fileExtension] || extractors.DEFAULT || builtInExtractors[fileExtension] || builtInExtractors.DEFAULT(context);
}
function getTransformer(tailwindConfig, fileExtension) {
    let transformers = tailwindConfig.content.transform;
    return transformers[fileExtension] || transformers.DEFAULT || builtInTransformers[fileExtension] || builtInTransformers.DEFAULT;
}
let extractorCache = new WeakMap();
// Scans template contents for possible classes. This is a hot path on initial build but
// not too important for subsequent builds. The faster the better though — if we can speed
// up these regexes by 50% that could cut initial build time by like 20%.
function getClassCandidates(content, extractor, candidates, seen) {
    if (!extractorCache.has(extractor)) {
        extractorCache.set(extractor, new _quickLru.default({
            maxSize: 25000
        }));
    }
    for (let line of content.split("\n")){
        line = line.trim();
        if (seen.has(line)) {
            continue;
        }
        seen.add(line);
        if (extractorCache.get(extractor).has(line)) {
            for (let match of extractorCache.get(extractor).get(line)){
                candidates.add(match);
            }
        } else {
            let extractorMatches = extractor(line).filter((s)=>s !== "!*");
            let lineMatchesSet = new Set(extractorMatches);
            for (let match1 of lineMatchesSet){
                candidates.add(match1);
            }
            extractorCache.get(extractor).set(line, lineMatchesSet);
        }
    }
}
/**
 *
 * @param {[import('./offsets.js').RuleOffset, import('postcss').Node][]} rules
 * @param {*} context
 */ function buildStylesheet(rules, context) {
    let sortedRules = context.offsets.sort(rules);
    let returnValue = {
        base: new Set(),
        defaults: new Set(),
        components: new Set(),
        utilities: new Set(),
        variants: new Set()
    };
    for (let [sort, rule] of sortedRules){
        returnValue[sort.layer].add(rule);
    }
    return returnValue;
}
function expandTailwindAtRules(context) {
    return (root)=>{
        let layerNodes = {
            base: null,
            components: null,
            utilities: null,
            variants: null
        };
        root.walkAtRules((rule)=>{
            // Make sure this file contains Tailwind directives. If not, we can save
            // a lot of work and bail early. Also we don't have to register our touch
            // file as a dependency since the output of this CSS does not depend on
            // the source of any templates. Think Vue <style> blocks for example.
            if (rule.name === "tailwind") {
                if (Object.keys(layerNodes).includes(rule.params)) {
                    layerNodes[rule.params] = rule;
                }
            }
        });
        if (Object.values(layerNodes).every((n)=>n === null)) {
            return root;
        }
        var _context_candidates;
        // ---
        // Find potential rules in changed files
        let candidates = new Set([
            ...(_context_candidates = context.candidates) !== null && _context_candidates !== void 0 ? _context_candidates : [],
            _sharedState.NOT_ON_DEMAND
        ]);
        let seen = new Set();
        env.DEBUG && console.time("Reading changed files");
        if (env.OXIDE) {
            // TODO: Pass through or implement `extractor`
            for (let candidate of require("@tailwindcss/oxide").parseCandidateStringsFromFiles(context.changedContent)){
                candidates.add(candidate);
            }
        // for (let { file, content, extension } of context.changedContent) {
        //   let transformer = getTransformer(context.tailwindConfig, extension)
        //   let extractor = getExtractor(context, extension)
        //   getClassCandidatesOxide(file, transformer(content), extractor, candidates, seen)
        // }
        } else {
            for (let { file , content , extension  } of context.changedContent){
                let transformer = getTransformer(context.tailwindConfig, extension);
                let extractor = getExtractor(context, extension);
                content = file ? _fs.default.readFileSync(file, "utf8") : content;
                getClassCandidates(transformer(content), extractor, candidates, seen);
            }
        }
        env.DEBUG && console.timeEnd("Reading changed files");
        // ---
        // Generate the actual CSS
        let classCacheCount = context.classCache.size;
        env.DEBUG && console.time("Generate rules");
        env.DEBUG && console.time("Sorting candidates");
        let sortedCandidates = env.OXIDE ? candidates : new Set([
            ...candidates
        ].sort((a, z)=>{
            if (a === z) return 0;
            if (a < z) return -1;
            return 1;
        }));
        env.DEBUG && console.timeEnd("Sorting candidates");
        (0, _generateRules.generateRules)(sortedCandidates, context);
        env.DEBUG && console.timeEnd("Generate rules");
        // We only ever add to the classCache, so if it didn't grow, there is nothing new.
        env.DEBUG && console.time("Build stylesheet");
        if (context.stylesheetCache === null || context.classCache.size !== classCacheCount) {
            context.stylesheetCache = buildStylesheet([
                ...context.ruleCache
            ], context);
        }
        env.DEBUG && console.timeEnd("Build stylesheet");
        let { defaults: defaultNodes , base: baseNodes , components: componentNodes , utilities: utilityNodes , variants: screenNodes  } = context.stylesheetCache;
        // ---
        // Replace any Tailwind directives with generated CSS
        if (layerNodes.base) {
            layerNodes.base.before((0, _cloneNodes.default)([
                ...baseNodes,
                ...defaultNodes
            ], layerNodes.base.source, {
                layer: "base"
            }));
            layerNodes.base.remove();
        }
        if (layerNodes.components) {
            layerNodes.components.before((0, _cloneNodes.default)([
                ...componentNodes
            ], layerNodes.components.source, {
                layer: "components"
            }));
            layerNodes.components.remove();
        }
        if (layerNodes.utilities) {
            layerNodes.utilities.before((0, _cloneNodes.default)([
                ...utilityNodes
            ], layerNodes.utilities.source, {
                layer: "utilities"
            }));
            layerNodes.utilities.remove();
        }
        // We do post-filtering to not alter the emitted order of the variants
        const variantNodes = Array.from(screenNodes).filter((node)=>{
            var _node_raws_tailwind;
            const parentLayer = (_node_raws_tailwind = node.raws.tailwind) === null || _node_raws_tailwind === void 0 ? void 0 : _node_raws_tailwind.parentLayer;
            if (parentLayer === "components") {
                return layerNodes.components !== null;
            }
            if (parentLayer === "utilities") {
                return layerNodes.utilities !== null;
            }
            return true;
        });
        if (layerNodes.variants) {
            layerNodes.variants.before((0, _cloneNodes.default)(variantNodes, layerNodes.variants.source, {
                layer: "variants"
            }));
            layerNodes.variants.remove();
        } else if (variantNodes.length > 0) {
            root.append((0, _cloneNodes.default)(variantNodes, root.source, {
                layer: "variants"
            }));
        }
        // If we've got a utility layer and no utilities are generated there's likely something wrong
        const hasUtilityVariants = variantNodes.some((node)=>{
            var _node_raws_tailwind;
            return ((_node_raws_tailwind = node.raws.tailwind) === null || _node_raws_tailwind === void 0 ? void 0 : _node_raws_tailwind.parentLayer) === "utilities";
        });
        if (layerNodes.utilities && utilityNodes.size === 0 && !hasUtilityVariants) {
            _log.default.warn("content-problems", [
                "No utility classes were detected in your source files. If this is unexpected, double-check the `content` option in your Tailwind CSS configuration.",
                "https://tailwindcss.com/docs/content-configuration"
            ]);
        }
        // ---
        if (env.DEBUG) {
            console.log("Potential classes: ", candidates.size);
            console.log("Active contexts: ", _sharedState.contextSourcesMap.size);
        }
        // Clear the cache for the changed files
        context.changedContent = [];
        // Cleanup any leftover @layer atrules
        root.walkAtRules("layer", (rule)=>{
            if (Object.keys(layerNodes).includes(rule.params)) {
                rule.remove();
            }
        });
    };
}
