import * as React from 'react';
import {
    PreferencesEditorContextProvider,
    useSetInspectorTitle,
    I18nContextProvider,
    memoryStore,
    StoreContextProvider,
    usePreference,
} from 'ra-core';
import { Box, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';

import { LocalesMenuButton } from '../button/LocalesMenuButton';
import { InspectorButton } from './InspectorButton';
import { Inspector } from './Inspector';
import { Configurable } from './Configurable';

export default {
    title: 'ra-ui-materialui/preferences/Configurable',
};

const TextBlock = ({
    color,
    children,
}: {
    color?: string;
    children?: React.ReactNode;
}) => {
    return (
        <Box
            border="solid 1px lightgrey"
            borderRadius={3}
            p={1}
            width={300}
            bgcolor={color}
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
};

const TextBlockWithPreferences = props => {
    const [color] = usePreference('color', '#ffffff');
    return <TextBlock color={color} {...props} />;
};

const TextBlockEditor = () => {
    const [color, setColor] = usePreference('color', '#ffffff');
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

const ConfigurableTextBlock = ({
    preferenceKey = 'textBlock',
    ...props
}: any) => (
    <Configurable editor={<TextBlockEditor />} preferenceKey={preferenceKey}>
        <TextBlockWithPreferences {...props} />
    </Configurable>
);

const SalesBlock = ({ showDate }: { showDate?: boolean }) => (
    <Box
        display="flex"
        border="solid 1px lightgrey"
        borderRadius={3}
        p={1}
        width={200}
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

const SalesBlockWithPreferences = props => {
    const [showDate] = usePreference('showDate', true);
    return <SalesBlock showDate={showDate} {...props} />;
};

const SalesBlockEditor = () => {
    const [showDate, setShowDate] = usePreference('showDate', true);
    useSetInspectorTitle('ra.inspector.salesBlock', { _: 'Sales block' });
    return (
        <>
            <label htmlFor="showDate">Show date</label>

            <input
                type="checkbox"
                defaultChecked={showDate}
                onChange={() => setShowDate(v => !v)}
                id="showDate"
            />
        </>
    );
};

const ConfigurableSalesBlock = ({ preferenceKey = 'salesBlock', ...props }) => (
    <Configurable editor={<SalesBlockEditor />} preferenceKey={preferenceKey}>
        <SalesBlockWithPreferences {...props} />
    </Configurable>
);

export const Basic = () => (
    <StoreContextProvider value={memoryStore()}>
        <PreferencesEditorContextProvider>
            <Inspector />
            <InspectorButton />
            <hr />
            <Box display="flex" alignItems="flex-start" gap="1em" padding="1em">
                <ConfigurableTextBlock />
                <ConfigurableSalesBlock />
            </Box>
        </PreferencesEditorContextProvider>
    </StoreContextProvider>
);

export const Nested = () => (
    <PreferencesEditorContextProvider>
        <Inspector />
        <InspectorButton />
        <hr />
        <Box display="flex" alignItems="flex-start" gap="1em" padding="1em">
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
        <Box display="flex" alignItems="flex-start" gap="1em" padding="1em">
            <ConfigurableTextBlock preferenceKey="foo" />
            <ConfigurableTextBlock preferenceKey="bar" />
        </Box>
    </PreferencesEditorContextProvider>
);

export const Unmount = () => {
    const [isTextBlockVisible, setTextBlockVisible] = React.useState(true);
    const [isSalesBlockVisible, setSalesBlockVisible] = React.useState(true);
    return (
        <PreferencesEditorContextProvider>
            <Inspector />
            <InspectorButton />
            <hr />
            <Box display="flex" alignItems="flex-start" gap="1em" padding="1em">
                <Box flex="1" display="flex" flexDirection="column" gap="1em">
                    <button
                        onClick={() => setTextBlockVisible(!isTextBlockVisible)}
                    >
                        toggle text block
                    </button>
                    {isTextBlockVisible && <ConfigurableTextBlock />}
                </Box>
                <Box flex="1" display="flex" flexDirection="column" gap="1em">
                    <button
                        onClick={() =>
                            setSalesBlockVisible(!isSalesBlockVisible)
                        }
                    >
                        toggle sales block
                    </button>
                    {isSalesBlockVisible && <ConfigurableSalesBlock />}
                </Box>
            </Box>
        </PreferencesEditorContextProvider>
    );
};
export const I18n = () => {
    const translations = { en, fr };
    const i18nProvider = polyglotI18nProvider(
        locale => translations[locale],
        'en'
    );
    return (
        <I18nContextProvider value={i18nProvider}>
            <LocalesMenuButton
                languages={[
                    { locale: 'en', name: 'English' },
                    { locale: 'fr', name: 'Français' },
                ]}
            />
            <Basic />
        </I18nContextProvider>
    );
};

export const NotInContext = () => <TextBlock />;
