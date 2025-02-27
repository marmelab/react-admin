let allMenus, navLinks, versionsLinks;

function hideTips() {
    const tipElement = document.getElementById('tip');
    const tipContainer = document.getElementById('tip-container');

    if (tipElement) {
        tipElement.remove();
    }
    if (tipContainer) {
        tipContainer.remove();
    }
}

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
    const scrollIntoView = window.sessionStorage.getItem('scrollIntoView');
    if (scrollIntoView !== 'false') {
        const activeMenu = document.querySelector('.sidenav li.active');
        if (activeMenu) activeMenu.parentNode.scrollIntoView();
    }
    window.sessionStorage.removeItem('scrollIntoView');
}

function buildPageToC() {
    const M = window.M;
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    // Initialize version selector
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));

    const Prism = window.Prism;
    Prism.highlightAll();

    /* Generate table of contents */
    if (document.querySelector('.toc') != null) {
        const tocbot = window.tocbot;
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
    const tocContainer = document.querySelector('.toc-container');
    let tmpElement;
    if (tocContainer) {
        tocContainer.className =
            text.trim() !== ''
                ? 'toc-container col hide-on-small-only m3'
                : 'toc-container';

        tmpElement = document.createElement('div');
        tmpElement.innerHTML = text;
    }

    const content = document.querySelector('.container');
    const tmpContent = tmpElement.querySelector('.container');
    if (content && tmpContent) {
        content.innerHTML = tmpContent.innerHTML;
    }

    window.scrollTo(0, 0);

    buildPageToC();

    navigationFitScroll();
}

function changeSelectedMenu() {
    const activeMenu = document.querySelector(`.sidenav li.active`);
    activeMenu && activeMenu.classList.remove('active');
    const newActiveMenu = allMenus.find(
        menuEl => menuEl.href === window.location.href
    );
    newActiveMenu && newActiveMenu.parentNode.classList.add('active');
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

function loadNewsletterScript() {
    /* Load the script only of the form is in the DOM */
    if (document.querySelector('#sib-form') != null) {
        const script = document.createElement('script');
        script.src = 'https://sibforms.com/forms/end-form/build/main.js';
        script.type = 'text/javascript';
        script.id = 'newsletter_script';
        document.head.appendChild(script);
    } else {
        document.getElementById('newsletter_script')?.remove();
    }
}

/**
 * Beginner mode
 */

let beginnerMode = window.localStorage.getItem('beginner-mode') === 'true';

function hideNonBeginnerDoc() {
    const chapters = document.querySelectorAll('.sidenav > ul  li');
    chapters.forEach(chapter => {
        if (!chapter.classList.contains('beginner')) {
            chapter.style.display = 'none';
        }
    });
    document.querySelectorAll('.beginner-mode-on').forEach(el => {
        el.style.display = 'block';
    });
}

function showNonBeginnerDoc() {
    const chapters = document.querySelectorAll('.sidenav > ul  li');
    chapters.forEach(chapter => {
        chapter.style.display = 'list-item';
    });
    document.querySelectorAll('.beginner-mode-on').forEach(el => {
        el.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const beginnerModeTrigger = document.getElementById(
        'beginner-mode-trigger'
    );

    if (window.location.pathname === '/documentation.html') {
    }

    if (beginnerModeTrigger) {
        beginnerModeTrigger.addEventListener('click', () => {
            beginnerMode = !beginnerMode;
            if (beginnerMode) {
                window.localStorage.setItem('beginner-mode', 'true');
                hideNonBeginnerDoc();
            } else {
                window.localStorage.removeItem('beginner-mode');
                showNonBeginnerDoc();
            }
        });

        beginnerModeTrigger.checked = beginnerMode;
        if (beginnerMode) {
            hideNonBeginnerDoc();
        }
    }
});

// Replace full page reloads by a fill of the content area
// so that the side navigation keeps its state
// use a global event listener to also catch links inside the content area
document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) {
        return; // click not on a link
    }
    const location = document.location.href.split('#')[0];
    const href = link.href;
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
    const currentPage = href.split('/').pop();
    versionsLinks.forEach(link => {
        link.href =
            link.href.substr(0, link.href.lastIndexOf('/') + 1) + currentPage;
    });
    // fetch the new content
    fetch(href)
        .then(res => res.text())
        .then(replaceContent)
        .then(() => import('./ra-doc-exec.js'))
        .then(docExecModule => {
            if (href.includes('documentation.html')) {
                docExecModule.showTip();
            } else {
                hideTips();
            }
            docExecModule.buildJSCodeBlocksFromTS();
        })
        .then(loadNewsletterScript);
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
        fetch(window.location.pathname)
            .then(res => res.text())
            .then(replaceContent)
            .then(() => import('./ra-doc-exec.js'))
            .then(docExecModule => {
                document.querySelector('.DocSearch-content').innerHTML = '';
                toggleDockBlocks(true);
                docExecModule.showTip();
            });
    } else {
        // fetch the new content
        fetch(window.location.pathname)
            .then(res => res.text())
            .then(replaceContent)
            .then(() => {
                toggleDockBlocks(false);
            })
            .then(hideTips)
            .then(() => import('./ra-doc-exec.js'))
            .then(docExecModule => docExecModule.buildJSCodeBlocksFromTS())
            .then(loadNewsletterScript);
    }
    changeSelectedMenu();
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    allMenus = Array.from(document.querySelectorAll(`.sidenav a.nav-link`));
    navLinks = allMenus
        .filter(link => !link.classList.contains('external'))
        .map(link => link.href);
    versionsLinks = Array.from(document.querySelectorAll('#versions > li > a'));

    buildPageToC();
    navigationFitScroll();
    loadNewsletterScript();

    if (window.location.pathname === '/documentation.html') {
        import('./ra-doc-exec.js').then(docExecModule => {
            document.querySelector('.DocSearch-content').innerHTML = '';
            toggleDockBlocks(true);
            docExecModule.showTip();
        });
    }
});
