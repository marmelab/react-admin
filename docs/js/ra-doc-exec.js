/* global Prism */
import { transpileModule } from 'https://esm.sh/typescript@5.7.3';
import * as prettier from 'https://esm.sh/prettier@3.5.1/standalone';
import * as babel from 'https://esm.sh/prettier@3.5.1/plugins/babel';
import * as estree from 'https://esm.sh/prettier@3.5.1/plugins/estree';
import { marked } from 'https://esm.sh/marked@15.0.7';

export const showTip = async () => {
    const tipContainer = document.getElementById('tip-container');
    const tipElement = document.getElementById('tip');
    if (!tipElement) return;

    const tips = await getContents('/assets/tips.md');
    const features = await getContents('/assets/features.md');
    const all = tips.concat(features);

    const content = all[Math.floor(Math.random() * all.length)]
        .replace('{% raw %}', '')
        .replace('{% endraw %}', '');
    tipElement.innerHTML = marked.parse(content);
    // First highlight the code blocks so that Prism generates the HTML we need for TS transpilation
    const codeBlock = tipElement.querySelector('pre > code');
    if (codeBlock) {
        Prism.highlightElement(codeBlock);
    }
    tipContainer.style.visibility = 'visible';
};

const getContents = async file => {
    try {
        const response = await fetch(file);
        if (response.ok) {
            const text = await response.text();
            return text.split('---');
        }
        return [];
    } catch {
        return [];
    }
};

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
    const transpilation = transpileModule(
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
            plugins: [babel, estree],
            parser: 'babel',
            tabWidth: 4,
            printWidth: 120,
        }
    );

    return jsCode;
};

export const buildJSCodeBlocksFromTS = async (
    selector = 'div.language-tsx'
) => {
    const tsBlocks = document.querySelectorAll(selector);

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

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/documentation.html') {
        showTip();
    }
    buildJSCodeBlocksFromTS();
});
