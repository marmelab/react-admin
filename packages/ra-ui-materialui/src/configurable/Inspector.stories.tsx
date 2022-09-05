import * as React from 'react';
import { PreferencesEditorContextProvider } from 'ra-core';
import { InspectorButton } from './InspectorButton';
import { Inspector } from './Inspector';
import { Configurable } from './Configurable';

export default {
    title: 'ra-ui-materialui/customizable/Inspector',
};

const EditableDiv = () => {
    const [editableEl, setEditableEl] = React.useState<HTMLDivElement | null>();
    return (
        <Configurable
            editableEl={editableEl}
            openButtonLabel="edit component"
            editor={<div>editorA</div>}
        >
            <div ref={element => setEditableEl(element)} style={{ width: 200 }}>
                Hello
            </div>
        </Configurable>
    );
};

export const Basic = () => (
    <PreferencesEditorContextProvider>
        <Inspector />
        <InspectorButton />
        <div>
            Configurable elements:
            <EditableDiv />
        </div>
    </PreferencesEditorContextProvider>
);
