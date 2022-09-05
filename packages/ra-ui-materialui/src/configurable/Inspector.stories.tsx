import * as React from 'react';
import {
    PreferencesEditorContextProvider,
    useSetInspectorTitle,
    useStore,
    I18nContextProvider,
} from 'ra-core';
import { InspectorButton } from './InspectorButton';
import { Inspector } from './Inspector';
import { Configurable } from './Configurable';

export default {
    title: 'ra-ui-materialui/customizable/Inspector',
};

const Dummy = React.forwardRef<HTMLDivElement>((props, ref) => {
    const [value] = useStore('dummy', '1767');
    return (
        <div
            style={{
                border: 'solid 1px lightgrey',
                padding: '0 10px',
                margin: 10,
                width: 200,
            }}
            ref={ref}
        >
            <h5>Captain's log</h5>
            <p>stardate {value}</p>
        </div>
    );
});

const DummyInspector = () => {
    const [value, setValue] = useStore('dummy', '1767');
    useSetInspectorTitle('ra.inspector.dummy.title', { _: 'Dummy inspector' });
    return <input value={value} onChange={e => setValue(e.target.value)} />;
};

const ConfigurableDummy = () => {
    const ref = React.useRef<HTMLDivElement>(null);
    return (
        <Configurable
            elementRef={ref}
            editor={<DummyInspector />}
            openButtonLabel="edit dummy"
        >
            <Dummy ref={ref} />
        </Configurable>
    );
};

export const Basic = () => (
    <PreferencesEditorContextProvider>
        <Inspector />
        <InspectorButton />
        <hr />
        <ConfigurableDummy />
    </PreferencesEditorContextProvider>
);

export const I18n = () => {
    const i18nProvider = {
        translate: (key: string, options: any) => options?._ ?? key,
        changeLocale: () => Promise.resolve(),
        getLocale: () => 'en',
    };
    return (
        <I18nContextProvider value={i18nProvider}>
            <Basic />
        </I18nContextProvider>
    );
};
