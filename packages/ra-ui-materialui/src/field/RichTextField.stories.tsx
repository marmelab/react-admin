import * as React from 'react';
import { RecordContextProvider, useTimeout } from 'ra-core';
import dompurify from 'dompurify';

import { RichTextField, RichTextFieldProps } from './RichTextField';
import { SimpleShowLayout } from '../detail/SimpleShowLayout';

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
    <RecordContextProvider value={record}>
        <RichTextField source="body" />
    </RecordContextProvider>
);

export const StripTags = () => (
    <RecordContextProvider value={record}>
        <RichTextField source="body" stripTags />
    </RecordContextProvider>
);

export const InSimpleShowLayout = () => (
    <RecordContextProvider value={record}>
        <SimpleShowLayout>
            <RichTextField source="body" />
        </SimpleShowLayout>
    </RecordContextProvider>
);

const DomPurifyInspector = () => {
    useTimeout(100); // force a redraw after the lazy loading of dompurify
    const dompurifyRemoved = dompurify.removed
        .map(
            removal =>
                `removed attribute ${
                    removal.attribute.name
                } from tag <${removal.from.tagName.toLowerCase()}>`
        )
        .join(', ');
    return <em>{dompurifyRemoved}</em>;
};

export const Secure = () => (
    <RecordContextProvider
        value={{
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
    </RecordContextProvider>
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
    <RecordContextProvider
        value={{
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
    </RecordContextProvider>
);

export const PurifyOptions = () => (
    <RecordContextProvider
        value={{
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
    </RecordContextProvider>
);
