var allMenus, navLinks, versionsLinks;

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
    var docBlock = document.querySelector('.docBlocks');
    if (!docBlock) return;
    docBlock.style.display = status ? 'grid' : 'none';
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
        .then(replaceContent);
    // change the URL
    window.history.pushState(null, null, href);
    changeSelectedMenu();
});

// make back button work again
window.addEventListener('popstate', event => {
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
            .then(replaceContent);
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
});
