/* global Prism, prettier, prettierPlugins */
var allMenus, navLinks, versionsLinks;

const applyPreferredLanguage = async () => {
    const preferredLanguage =
        window.localStorage.getItem('preferred-language') || 'jsx';

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
                fence.style.display = 'none';
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
                    fence.querySelector('code').textContent = jsCode;
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
            },
            reportDiagnostics: false,
        }
    );

    // prettier is necessary because the transpiled code is not formatted
    const jsCode = prettier.format(
        // Ensure blank lines are preserved
        transpilation.outputText.replace(
            /\/\*\* THIS_IS_A_NEWLINE \*\*\//g,
            '\n'
        ),
        {
            plugins: [prettierPlugins.babel],
            parser: 'babel',
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
            jsTabContent.appendChild(highlight);
            const jsTabContentPre = document.createElement('pre');
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

            jsTabTitle.addEventListener('click', () => {
                window.localStorage.setItem('preferred-language', 'jsx');
                applyPreferredLanguage();
            });
            tsTabTitle.addEventListener('click', () => {
                window.localStorage.setItem('preferred-language', 'tsx');
                applyPreferredLanguage();
            });
        })
    );

    applyPreferredLanguage();
};

// eslint-disable-next-line no-unused-vars
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

function navigationFitScroll() {
    var scrollIntoView = window.sessionStorage.getItem('scrollIntoView');
    if (scrollIntoView !== 'false') {
        var activeMenu = document.querySelector('.sidenav li.active');
        if (activeMenu) activeMenu.parentNode.scrollIntoView();
    }
    window.sessionStorage.removeItem('scrollIntoView');
}

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

function replaceContent(text) {
    var tocContainer = document.querySelector('.toc-container');
    tocContainer.className =
        text.trim() !== ''
            ? 'toc-container col hide-on-small-only m3'
            : 'toc-container';

    var tmpElement = document.createElement('div');
    tmpElement.innerHTML = text;

    toggleDockBlocks(false);

    var content = document.querySelector('.DocSearch-content');
    content.innerHTML = tmpElement.querySelector(
        '.DocSearch-content'
    ).innerHTML;

    window.scrollTo(0, 0);

    buildPageToC();

    navigationFitScroll();
}

function changeSelectedMenu() {
    var activeMenu = document.querySelector(`.sidenav li.active`);
    activeMenu && activeMenu.classList.remove('active');
    allMenus
        .find(menuEl => menuEl.href === window.location.href)
        .parentNode.classList.add('active');
}

function toggleDockBlocks(status) {
    const docBlock = document.querySelector('.docBlocks');
    const needHelp = document.querySelector('.needHelp');
    if (status) {
        if (docBlock) docBlock.style.display = 'grid';
        if (needHelp) needHelp.style.display = 'block';
    } else {
        if (docBlock) docBlock.style.display = 'none';
        if (needHelp) needHelp.style.display = 'none';
    }
}

// Replace full page reloads by a fill of the content area
// so that the side navigation keeps its state
// use a global event listener to also catch links inside the content area
document.addEventListener('click', event => {
    var link = event.target.closest('a');
    if (!link) {
        return; // click not on a link
    }
    var location = document.location.href.split('#')[0];
    var href = link.href;
    if (href.indexOf(`${location}#`) === 0) {
        return; // click on an anchor in the current page
    }
    if (!navLinks.includes(href)) {
        return; // not a navigation link
    }
    window.sessionStorage.setItem(
        'scrollIntoView',
        link.closest('.sidenav') ? 'false' : 'true'
    );
    // now we're sure it's an internal navigation link
    // transform it to an AJAX call
    event.preventDefault();
    // update versions links
    var currentPage = href.split('/').pop();
    versionsLinks.forEach(link => {
        link.href =
            link.href.substr(0, link.href.lastIndexOf('/') + 1) + currentPage;
    });
    // fetch the new content
    fetch(href)
        .then(res => res.text())
        .then(replaceContent)
        .then(buildJSCodeBlocksFromTS);
    // change the URL
    window.history.pushState(null, null, href);
    changeSelectedMenu();
});

// make back button work again
window.addEventListener('popstate', () => {
    if (document.location.href.indexOf('#') !== -1) {
        // popstate triggered by a click on an anchor, not back button
        return;
    }
    if (window.location.pathname === '/documentation.html') {
        document.querySelector('.DocSearch-content').innerHTML = '';
        toggleDockBlocks(true);
    } else {
        // fetch the new content
        fetch(window.location.pathname)
            .then(res => res.text())
            .then(replaceContent)
            .then(buildJSCodeBlocksFromTS);
    }
    changeSelectedMenu();
});

window.addEventListener('DOMContentLoaded', () => {
    allMenus = Array.from(document.querySelectorAll(`.sidenav a.nav-link`));
    navLinks = allMenus
        .filter(link => !link.classList.contains('external'))
        .map(link => link.href);
    versionsLinks = Array.from(document.querySelectorAll('#versions > li > a'));

    buildPageToC();

    navigationFitScroll();
    buildJSCodeBlocksFromTS();
});
