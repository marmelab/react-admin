import * as React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import {
    Form,
    I18nContextProvider,
    StoreContextProvider,
    TestMemoryRouter,
    memoryStore,
} from 'ra-core';
import {
    defaultLightTheme,
    defaultDarkTheme,
    nanoDarkTheme,
    nanoLightTheme,
    radiantDarkTheme,
    radiantLightTheme,
    houseDarkTheme,
    houseLightTheme,
    bwLightTheme,
    bwDarkTheme,
    RaThemeOptions,
    ThemeProvider,
    ThemesContext,
    useTheme,
} from './';
import {
    Alert,
    Box,
    ButtonGroup,
    Chip,
    Paper,
    Snackbar,
    Stack,
    type StackProps,
    Typography,
} from '@mui/material';
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material/styles';
import {
    Button,
    CreateButton,
    DeleteButton,
    EditButton,
    ListButton,
    ShowButton,
} from '../button';
import {
    TextInput,
    DateInput,
    SelectInput,
    RadioButtonGroupInput,
    CheckboxGroupInput,
    BooleanInput,
    PasswordInput,
    SearchInput,
} from '../input';

export default {
    title: 'ra-ui-materialui/theme/ThemeTester',
};

interface Theme {
    name: string;
    light: RaThemeOptions;
    dark?: RaThemeOptions;
}
const themes: Theme[] = [
    { name: 'Default', light: defaultLightTheme, dark: defaultDarkTheme },
    {
        name: 'B&W',
        light: bwLightTheme,
        dark: bwDarkTheme,
    },
    { name: 'Nano', light: nanoLightTheme, dark: nanoDarkTheme },
    { name: 'Radiant', light: radiantLightTheme, dark: radiantDarkTheme },
    { name: 'House', light: houseLightTheme, dark: houseDarkTheme },
];

const store = memoryStore();

const Wrapper = ({ children, themeName, themeType }) => {
    const lightTheme = themes.find(theme => theme.name === themeName)?.light;
    const darkTheme = themes.find(theme => theme.name === themeName)?.dark;
    return (
        <I18nContextProvider
            value={polyglotI18nProvider(() => englishMessages)}
        >
            <QueryClientProvider client={new QueryClient()}>
                <TestMemoryRouter>
                    <StoreContextProvider value={store}>
                        <ThemesContext.Provider
                            value={{
                                lightTheme,
                                darkTheme,
                                defaultTheme: themeType,
                            }}
                        >
                            <ThemeProvider>{children}</ThemeProvider>
                        </ThemesContext.Provider>
                    </StoreContextProvider>
                </TestMemoryRouter>
            </QueryClientProvider>
        </I18nContextProvider>
    );
};

export const ThemeTester = ({ themeName, themeType }) => (
    <Wrapper themeName={themeName} themeType={themeType}>
        <Snackbar
            open
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <Alert severity="info" variant="outlined">
                Use the story controls to change the theme
            </Alert>
        </Snackbar>

        <Paper sx={{ p: 2 }}>
            <Section title="Base Buttons">
                <Typography>Variant</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button label="Default" />
                    <Button label="Outlined" variant="outlined" />
                    <Button label="Contained" variant="contained" />
                    <Button label="Text" variant="text" />
                </Stack>
                <Typography>Color</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button label="Default" />
                    <Button label="Primary" color="primary" />
                    <Button label="Secondary" color="secondary" />
                    <Button label="Error" color="error" />
                    <Button label="Warning" color="warning" />
                    <Button label="Success" color="success" />
                    <Button label="Info" color="info" />
                    <Button label="Disabled" disabled />
                </Stack>
                <Typography>Size</Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: 'flex-start' }}
                >
                    <Button label="Default" />
                    <Button label="Small" size="small" />
                    <Button label="Medium" size="medium" />
                    <Button label="Large" size="large" />
                </Stack>
            </Section>
            <Section title="Navigation Buttons" direction="row" spacing={1}>
                <ListButton resource="posts" />
                <EditButton resource="posts" record={{ id: 1 }} />
                <ShowButton resource="posts" record={{ id: 1 }} />
                <CreateButton resource="posts" />
                <DeleteButton resource="posts" record={{ id: 1 }} />
            </Section>
            <Section title="Form Inputs">
                <Form>
                    <TextInput source="text" />
                    <DateInput source="date" />
                    <SelectInput
                        source="select"
                        choices={[
                            { id: 1, name: 'One' },
                            { id: 2, name: 'Two' },
                        ]}
                    />
                    <RadioButtonGroupInput
                        source="radio"
                        choices={[
                            { id: 1, name: 'One' },
                            { id: 2, name: 'Two' },
                        ]}
                    />
                    <CheckboxGroupInput
                        source="checkbox"
                        choices={[
                            { id: 1, name: 'One' },
                            { id: 2, name: 'Two' },
                        ]}
                    />
                    <BooleanInput source="boolean" />
                    <PasswordInput source="password" />
                    <SearchInput source="search" />
                </Form>
            </Section>
            <Section title="Chips">
                <Typography>Color</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label="Default" />
                    <Chip label="Primary" color="primary" />
                    <Chip label="Secondary" color="secondary" />
                    <Chip label="Error" color="error" />
                    <Chip label="Warning" color="warning" />
                    <Chip label="Success" color="success" />
                    <Chip label="Info" color="info" />
                    <Chip label="Disabled" disabled />
                </Stack>
                <Typography>Variant</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label="Default" />
                    <Chip label="Filled" variant="filled" />
                    <Chip label="Outlined" variant="outlined" />
                </Stack>
                <Typography>Size</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label="Default" />
                    <Chip label="Small" size="small" />
                    <Chip label="Medium" size="medium" />
                </Stack>
            </Section>
        </Paper>
    </Wrapper>
);

ThemeTester.args = {
    themeName: 'Default',
    themeType: 'light',
};
ThemeTester.argTypes = {
    themeName: {
        control: 'select',
        options: themes.map(theme => theme.name),
    },
    themeType: {
        control: 'select',
        options: ['light', 'dark'],
    },
};

const ThemeSelector = ({ themeName, setThemeName }) => {
    const handleChange = (_: React.MouseEvent<HTMLElement>, index: number) => {
        const newTheme = themes[index];
        setThemeName(newTheme.name);
    };
    const [theme, setter] = useTheme();

    return (
        <MuiThemeProvider theme={createTheme()}>
            <Stack sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Theme</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2}>
                            <ButtonGroup>
                                {themes.map((theme, index) => (
                                    <Button
                                        key={theme.name}
                                        label={theme.name}
                                        variant={
                                            theme.name === themeName
                                                ? 'contained'
                                                : 'outlined'
                                        }
                                        onClick={event =>
                                            handleChange(event, index)
                                        }
                                    />
                                ))}
                            </ButtonGroup>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Type</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2}>
                            <ButtonGroup>
                                <Button
                                    label="Light"
                                    variant={
                                        theme === 'light'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onClick={() => setter('light')}
                                />
                                <Button
                                    label="Dark"
                                    variant={
                                        theme === 'dark'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onClick={() => setter('dark')}
                                />
                            </ButtonGroup>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </MuiThemeProvider>
    );
};

const Separator = () => (
    <Box
        sx={{
            marginX: -2,
            marginTop: 1,
            marginBottom: 1.5,
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            '&:last-child': { borderBottom: 'none', margin: 0 },
        }}
    />
);

interface SectionProps extends Omit<StackProps, 'title'> {
    title: React.ReactNode;
    children: React.ReactNode;
}
const Section = ({ title, children, ...rest }: SectionProps) => (
    <>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Typography sx={{ width: 200 }}>{title}</Typography>
            <Stack {...rest} sx={{ p: 0, maxWidth: 1000 }}>
                {children}
            </Stack>
        </Stack>
        <Separator />
    </>
);
