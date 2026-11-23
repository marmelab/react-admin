import * as React from 'react';
import { RecordContextProvider, useTimeout } from 'ra-core';
import dompurify from 'dompurify';
import { deepmerge } from '@mui/utils';
import { createTheme, ThemeOptions } from '@mui/material';

import { RichTextField, RichTextFieldProps } from './RichTextField';
import { SimpleShowLayout } from '../detail/SimpleShowLayout';
import { AdminContext } from '../AdminContext';

export default {
    title: 'ra-ui-materialui/fields/RichTextField',
};

const record = {
    id: 1,
    body: `
<p>
<strong>War and Peace</strong> is a novel by the Russian author <a href="https://en.wikipedia.org/wiki/Leo_Tolstoy">Leo Tolstoy</a>,
published serially, then in its entirety in 1869.
</p>
<p>
It is regarded as one of Tolstoy's finest literary achievements and remains a classic of world literature.
</p>
<img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Tolstoy_-_War_and_Peace_-_first_edition%2C_1869.jpg"  />
`,
};

export const Basic = () => (
    <Wrapper record={record}>
        <RichTextField source="body" />
    </Wrapper>
);

export const StripTags = () => (
    <Wrapper record={record}>
        <RichTextField source="body" stripTags />
    </Wrapper>
);

export const InSimpleShowLayout = () => (
    <Wrapper record={record}>
        <SimpleShowLayout>
            <RichTextField source="body" />
        </SimpleShowLayout>
    </Wrapper>
);

const DomPurifyInspector = () => {
    useTimeout(100); // force a redraw after the lazy loading of dompurify
    const dompurifyRemoved = dompurify.removed
        .map(removal =>
            'attribute' in removal
                ? `removed attribute ${
                      removal.attribute?.name
                  } from tag <${removal.from.tagName.toLowerCase()}>`
                : `removed tag <${removal.element.nodeName.toLowerCase()}>`
        )
        .join(', ');
    return <em>{dompurifyRemoved}</em>;
};

export const Secure = () => (
    <Wrapper
        record={{
            id: 1,
            body: `
<p>
<strong>War and Peace</strong> is a novel by the Russian author
<a href="https://en.wikipedia.org/wiki/Leo_Tolstoy" onclick="document.getElementById('stolendata').value='credentials';">Leo Tolstoy</a>,
published serially, then in its entirety in 1869.
</p>
<p onmouseover="document.getElementById('stolendata').value='credentials';">
It is regarded as one of Tolstoy's finest literary achievements and remains a classic of world literature.
</p>
<img src="x" onerror="document.getElementById('stolendata').value='credentials';" />
<style>p { color: red; }</style>
<form><input name="q" /><button>Search</button></form>
<dialog open><a href="https://evil.example/login">Session expired, please log in again</a></dialog>
`,
        }}
    >
        <RichTextField source="body" />
        <hr />
        <DomPurifyInspector />
        <div>
            <h4>Stolen data:</h4>
            <input id="stolendata" defaultValue="none" />
        </div>
    </Wrapper>
);

const TargetBlankEnabledRichTextField = (props: RichTextFieldProps) => {
    dompurify.addHook('afterSanitizeAttributes', function (node) {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener');
        }
    });
    return <RichTextField {...props} />;
};

export const TargetBlank = () => (
    <Wrapper
        record={{
            id: 1,
            body: `
<p>
<strong>War and Peace</strong> is a novel by the Russian author
<a href="https://en.wikipedia.org/wiki/Leo_Tolstoy" target="_blank">Leo Tolstoy</a>,
published serially, then in its entirety in 1869.
</p>
<p>
It is regarded as one of Tolstoy's finest literary achievements and remains a classic of world literature.
</p>
`,
        }}
    >
        <TargetBlankEnabledRichTextField source="body" />
    </Wrapper>
);

export const PurifyOptions = () => (
    <Wrapper
        record={{
            id: 1,
            body: `
<p>
<strong>War and Peace</strong> is a novel by the Russian author
<a href="https://en.wikipedia.org/wiki/Leo_Tolstoy" target="_blank">Leo Tolstoy</a>,
published serially, then in its entirety in 1869.
</p>
<p>
It is regarded as one of Tolstoy's finest literary achievements and remains a classic of world literature.
</p>
`,
        }}
    >
        <RichTextField source="body" purifyOptions={{ ADD_ATTR: ['target'] }} />
    </Wrapper>
);

export const AllowedTags = ({
    purifyOptions = { ADD_TAGS: ['input'] },
}: Pick<RichTextFieldProps, 'purifyOptions'>) => (
    <Wrapper
        record={{
            id: 1,
            body: `
<p>Reading list:</p>
<ul>
<li><input type="checkbox" checked disabled /> War and Peace</li>
<li><input type="checkbox" disabled /> Anna Karenina</li>
</ul>
`,
        }}
    >
        <RichTextField source="body" purifyOptions={purifyOptions} />
    </Wrapper>
);

const Wrapper = ({
    children,
    record,
    theme = undefined,
    defaultTheme = 'light',
}) => (
    <AdminContext defaultTheme={defaultTheme as any} theme={theme}>
        <RecordContextProvider value={record}>{children}</RecordContextProvider>
    </AdminContext>
);

export const Empty = ({ emptyText, body }) => (
    <Wrapper record={{ id: 1, body }}>
        <RichTextField source="body" emptyText={emptyText} />
    </Wrapper>
);
Empty.args = {
    emptyText: 'empty',
    body: '',
};
Empty.argTypes = {
    emptyText: {
        options: [undefined, 'empty'],
        control: { type: 'inline-radio' },
    },
    body: {
        options: [undefined, null, 'empty string', 'foo'],
        mapping: {
            undefined: undefined,
            null: null,
            'empty string': '',
            foo: 'foo',
        },
        control: { type: 'inline-radio' },
    },
};

export const Themed = () => (
    <Wrapper
        record={record}
        theme={deepmerge(createTheme(), {
            components: {
                RaRichTextField: {
                    defaultProps: {
                        'data-testid': 'themed',
                    },
                    styleOverrides: {
                        root: {
                            color: 'hotpink',
                        },
                    },
                },
            },
        } as ThemeOptions)}
    >
        <RichTextField source="body" />
    </Wrapper>
);
