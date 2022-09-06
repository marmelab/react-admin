import * as React from 'react';
import {
    PreferencesEditorContextProvider,
    useSetInspectorTitle,
    useStore,
    I18nContextProvider,
} from 'ra-core';
import { Box, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';

import { InspectorButton } from './InspectorButton';
import { Inspector } from './Inspector';
import { Configurable } from './Configurable';

export default {
    title: 'ra-ui-materialui/configurable/Configurable',
};

const TextBlock = React.forwardRef<
    HTMLDivElement,
    { editorKey?: string; children?: any }
>(({ children, editorKey }, ref) => {
    const [color] = useStore(`textBlock.${editorKey}.color`, '#ffffff');
    return (
        <Box
            border="solid 1px lightgrey"
            borderRadius={3}
            p={1}
            margin={1}
            width={300}
            bgcolor={color}
            ref={ref}
        >
            <Typography variant="h6">Lorem ipsum</Typography>
            <Typography>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui,
                quia rem? Nulla asperiores ea beatae iure, dignissimos ut
                perferendis nemo reiciendis reprehenderit, consequuntur debitis
                maiores! Quaerat dolor unde dolorum qui.
            </Typography>
            {children}
        </Box>
    );
});

const TextBlockEditor = ({ editorKey }: { editorKey?: string }) => {
    const [color, setColor] = useStore(
        `textBlock.${editorKey}.color`,
        '#ffffff'
    );
    useSetInspectorTitle('ra.inspector.textBlock', { _: 'Text block' });
    return (
        <div>
            <label htmlFor="color">Background color</label>
            {/* uncontrolled component */}
            <input
                defaultValue={color}
                onBlur={e => setColor(e.target.value)}
                id="color"
            />
        </div>
    );
};

const ConfigurableTextBlock = ({ editorKey, ...props }: any) => (
    <Configurable editor={<TextBlockEditor />} editorKey={editorKey}>
        <TextBlock {...props} />
    </Configurable>
);

const SalesBlock = React.forwardRef<HTMLDivElement>((props, ref) => {
    const [showDate] = useStore('salesBlock.showDate', true);
    return (
        <Box
            display="flex"
            border="solid 1px lightgrey"
            borderRadius={3}
            p={1}
            margin={1}
            width={200}
            ref={ref}
        >
            <Box flex="1" mr={1}>
                <Typography variant="h6">Sales</Typography>
                {showDate && <Typography variant="caption">Today</Typography>}
                <Typography variant="h4" textAlign="right" mt={2}>
                    $4,452
                </Typography>
            </Box>
            <Box bgcolor="lightgrey" display="flex" alignItems="center" p={1}>
                <TimelineIcon />
            </Box>
        </Box>
    );
});

const SalesBlockEditor = () => {
    const [showDate, setShowDate] = useStore('salesBlock.showDate', true);
    useSetInspectorTitle('ra.inspector.salesBlock', { _: 'Sales block' });
    return (
        <>
            <label htmlFor="showDate">Show date</label>

            <input
                type="checkbox"
                defaultChecked={showDate}
                onChange={e => setShowDate(showDatz => !showDate)}
                id="showDate"
            />
        </>
    );
};

const ConfigurableSalesBlock = props => (
    <Configurable editor={<SalesBlockEditor />}>
        <SalesBlock {...props} />
    </Configurable>
);

export const Basic = () => (
    <PreferencesEditorContextProvider>
        <Inspector />
        <InspectorButton />
        <hr />
        <Box display="flex" alignItems="flex-start">
            <ConfigurableTextBlock />
            <ConfigurableSalesBlock />
        </Box>
    </PreferencesEditorContextProvider>
);

export const Nested = () => (
    <PreferencesEditorContextProvider>
        <Inspector />
        <InspectorButton />
        <hr />
        <Box display="flex" alignItems="flex-start">
            <ConfigurableTextBlock>
                <ConfigurableSalesBlock />
            </ConfigurableTextBlock>
        </Box>
    </PreferencesEditorContextProvider>
);

export const MultipleInstances = () => (
    <PreferencesEditorContextProvider>
        <Inspector />
        <InspectorButton />
        <hr />
        <Box display="flex" alignItems="flex-start">
            <ConfigurableTextBlock editorKey="foo" />
            <ConfigurableTextBlock editorKey="bar" />
        </Box>
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

export const NotInContext = () => <ConfigurableTextBlock />;
