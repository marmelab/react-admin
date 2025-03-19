/* global Prism, prettier, prettierPlugins */

function buildPageToC() {
    var M = window.M;
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    // Initialize version selector
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));

    var Prism = window.Prism;
    Prism.highlightAll();

    /* Generate table of contents */
    if (document.querySelector('.toc') != null) {
        var tocbot = window.tocbot;
        tocbot.init({
            // Where to render the table of contents
            tocSelector: '.toc',
            positionFixedSelector: '.toc',
            // Where to grab the headings to build the table of contents
            contentSelector: '.toc-content',
            // More options
            headingSelector: 'h2, h3, h4',
            includeHtml: true,
            collapseDepth: 2,
            hasInnerContainers: true,
        });
    }
}

const applyPreferredLanguage = async () => {
    const preferredLanguage =
        window.localStorage.getItem('preferred-language') || 'tsx';

    const languageSwitchers = document.querySelectorAll('.language-switcher');
    const codeFences = document.querySelectorAll('div[class^=language-]');

    languageSwitchers.forEach(switcher => {
        if (switcher.dataset.language === preferredLanguage) {
            switcher.classList.add('active');
        } else {
            switcher.classList.remove('active');
        }
    });

    await Promise.all(
        Array.from(codeFences).map(async fence => {
            if (fence.classList.contains(`language-${preferredLanguage}`)) {
                fence.style.display = 'block';
            } else {
                if (
                    (fence.classList.contains(`language-jsx`) &&
                        fence.dataset.tsBlock) ||
                    fence.classList.contains(`language-tsx`)
                ) {
                    fence.style.display = 'none';
                }
            }

            if (
                // We want to transpile TS code blocks to JS only when actually requested
                preferredLanguage === 'jsx' &&
                // The code block is a JSX one
                fence.classList.contains('language-jsx') &&
                // That has been generated from a TSX block
                fence.dataset.tsBlock &&
                // And has not been transpiled yet
                fence.dataset.transpiled !== 'true'
            ) {
                const tsBlock = document.getElementById(fence.dataset.tsBlock);
                if (tsBlock) {
                    const jsCode = await transpileToJS(tsBlock.innerText);
                    fence.querySelector('code').textContent =
                        jsCode === ''
                            ? '// TypeScript-only snippet, please select the TS language ↗️'
                            : jsCode;
                    fence.dataset.transpiled = 'true';
                    Prism.highlightElement(fence.querySelector('code'));
                }
            }
        })
    );
};

const transpileToJS = async tsCode => {
    // As we load those libs asynchronously, we need to ensure they are loaded
    // before using them
    if (
        window.ts === undefined ||
        window.prettier === undefined ||
        window.prettierPlugins === undefined
    ) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return transpileToJS(tsCode);
    }

    const transpilation = window.ts.transpileModule(
        // Ensure blank lines are preserved
        tsCode.replace(/\n\n/g, '\n/** THIS_IS_A_NEWLINE **/'),
        {
            compilerOptions: {
                jsx: 'preserve',
                target: 99,
                noResolve: true,
                isolatedModules: true,
                verbatimModuleSyntax: true,
            },
            reportDiagnostics: false,
        }
    );

    // prettier is necessary because the transpiled code is not formatted
    const jsCode = prettier.format(
        // Ensure blank lines are preserved
        transpilation.outputText.replace(
            /\/\*\* THIS_IS_A_NEWLINE \*\*\//g,
            '\n\n'
        ),
        {
            plugins: [prettierPlugins.babel],
            parser: 'babel',
            tabWidth: 4,
            printWidth: 120,
        }
    );

    return jsCode;
};

const buildJSCodeBlocksFromTS = async () => {
    const tsBlocks = document.querySelectorAll('div.language-tsx');

    await Promise.all(
        Array.from(tsBlocks).map(async (block, index) => {
            const parent = block.parentNode;

            // Container for both tabs links and panels
            const container = document.createElement('div');
            container.className = 'marmelab-code-container';

            // Container for tabs links
            const tabs = document.createElement('div');
            tabs.className = 'marmelab-language-switcher-tabs';

            // JS tab link
            const jsTab = document.createElement('span');
            const jsTabTitle = document.createElement('a');
            jsTabTitle.className = 'language-switcher';
            jsTabTitle.dataset.language = 'jsx';
            jsTabTitle.href = `#jsx-${index}`;
            jsTabTitle.title = 'JavaScript';
            jsTabTitle.innerText = 'JS';
            jsTab.appendChild(jsTabTitle);

            // JS tab panel
            const jsTabContent = document.createElement('div');
            jsTabContent.className = 'language-jsx highlighter-rouge';
            jsTabContent.id = `jsx-${index}`;
            // Allows us to find the corresponding TS block to hide it when switching to JS
            jsTabContent.dataset.tsBlock = `tsx-${index}`;

            // Containers for Prism highlighter
            const highlight = document.createElement('div');
            highlight.className = 'highlight';
            jsTabContent.appendChild(highlight);
            const jsTabContentPre = document.createElement('pre');
            jsTabContentPre.className = 'highlight';
            highlight.appendChild(jsTabContentPre);

            // The actual JS code element
            const jsTabContentCode = document.createElement('code');
            jsTabContentCode.className = 'language-jsx';
            jsTabContentPre.appendChild(jsTabContentCode);
            tabs.appendChild(jsTab);

            // TS tab link
            const tsTab = document.createElement('span');
            const tsTabTitle = document.createElement('a');
            tsTabTitle.className = 'language-switcher';
            tsTabTitle.href = `#tsx-${index}`;
            tsTabTitle.title = 'TypeScript';
            tsTabTitle.innerText = 'TS';
            tsTabTitle.dataset.language = 'tsx';
            tsTab.appendChild(tsTabTitle);

            // TS tab panel (the block we cloned is already Prism highlighted)
            const tsTabContent = block.cloneNode(true);
            tsTabContent.id = `tsx-${index}`;
            tabs.appendChild(tsTab);

            container.appendChild(tabs);
            container.appendChild(jsTabContent);
            container.appendChild(tsTabContent);

            // Replace the old TS only block by the new tabs container
            parent.insertBefore(container, block);
            parent.removeChild(block);

            jsTabTitle.addEventListener('click', event => {
                event.preventDefault();
                window.localStorage.setItem('preferred-language', 'jsx');
                applyPreferredLanguage();
            });
            tsTabTitle.addEventListener('click', event => {
                event.preventDefault();
                window.localStorage.setItem('preferred-language', 'tsx');
                applyPreferredLanguage();
            });
        })
    );

    applyPreferredLanguage();
};

function changeSelectedMenu() {
    var activeMenu = document.querySelector(`.sidenav li.active`);
    activeMenu && activeMenu.classList.remove('active');
    const allMenus = Array.from(
        document.querySelectorAll(`.sidenav a.nav-link`)
    );
    allMenus
        .find(menuEl => menuEl.href === window.location.href.split('#')[0])
        ?.parentNode.classList.add('active');
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    );
}

function scrollActiveMenuItemIntoView() {
    var activeMenu = document.querySelector('.sidenav li.active');
    if (activeMenu && !isElementInViewport(activeMenu)) {
        activeMenu.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
}

document.addEventListener('turbo:load', function (event) {
    console.log('turbo:load', event);
    buildPageToC();
    buildJSCodeBlocksFromTS();
    changeSelectedMenu();
    scrollActiveMenuItemIntoView();
});
