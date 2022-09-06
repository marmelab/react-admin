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
    title: 'ra-ui-materialui/customizable/Configurable',
};

const TextBlock = React.forwardRef<HTMLDivElement>((props, ref) => {
    const [color] = useStore('textBlock.color', '#ffffff');
    return (
        <Box
            border="solid 1px lightgrey"
            borderRadius={3}
            p={1}
            margin={1}
            width={200}
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
        </Box>
    );
});

const TextBlockInspector = () => {
    const [color, setColor] = useStore('textBlock.color', '#ffffff');
    useSetInspectorTitle('ra.inspector.textBlock', { _: 'Text block' });
    return (
        <>
            <label htmlFor="color">Background color</label>
            {/* uncontrolled component */}
            <input
                defaultValue={color}
                onBlur={e => setColor(e.target.value)}
                id="color"
            />
        </>
    );
};

const ConfigurableTextBlock = () => {
    const ref = React.useRef<HTMLDivElement>(null);
    return (
        <Configurable
            elementRef={ref}
            editor={<TextBlockInspector />}
            openButtonLabel="edit dummy"
        >
            <TextBlock ref={ref} />
        </Configurable>
    );
};

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

const SalesBlockInspector = () => {
    const [showDate, setShowDate] = useStore('salesBlock.showDate', true);
    useSetInspectorTitle('ra.inspector.salesBlock', { _: 'Sales block' });
    return (
        <>
            <label htmlFor="showDate">Show date</label>

            <input
                type="checkbox"
                checked={showDate}
                onClick={e => setShowDate(showDatz => !showDate)}
                id="showDate"
            />
        </>
    );
};

const ConfigurableSalesBlock = () => {
    const ref = React.useRef<HTMLDivElement>(null);
    return (
        <Configurable
            elementRef={ref}
            editor={<SalesBlockInspector />}
            openButtonLabel="edit dummy"
        >
            <SalesBlock ref={ref} />
        </Configurable>
    );
};

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
