import {
    Divider,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    ArrayInput,
    ReferenceInput,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    required,
    useRecordContext,
} from 'react-admin';
import { isLinkedinUrl } from '../misc/isLinkedInUrl';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { Company, Sale } from '../types';
import { sizes } from './sizes';
import ImageEditorField from '../misc/ImageEditorField';

const isUrl = (url: string) => {
    if (!url) return;
    const UrlRegex = new RegExp(
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
    );
    if (!UrlRegex.test(url)) {
        return 'Must be a valid URL';
    }
};

export const CompanyInputs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack gap={4} p={1}>
            <CompanyDisplayInputs />
            <Stack gap={4} direction={isMobile ? 'column' : 'row'}>
                <Stack gap={4} flex={1}>
                    <CompanyContactInputs />
                    <CompanyContextInputs />
                </Stack>
                <Divider
                    orientation={isMobile ? 'horizontal' : 'vertical'}
                    flexItem
                />
                <Stack gap={4} flex={1}>
                    <CompanyAddressInputs />
                    <CompanyAdditionalInformationInputs />
                    <CompanyAccountManagerInput />
                </Stack>
            </Stack>
        </Stack>
    );
};

const CompanyDisplayInputs = () => {
    const record = useRecordContext<Company>();
    return (
        <Stack gap={2} flex={1} direction="row">
            <ImageEditorField
                source="logo"
                type="avatar"
                width={60}
                height={60}
                emptyText={record?.name.charAt(0)}
                linkPosition="bottom"
            />
            <TextInput
                source="name"
                validate={required()}
                helperText={false}
                sx={{
                    mt: 0,
                }}
            />
        </Stack>
    );
};

const CompanyContactInputs = () => {
    return (
        <Stack>
            <Typography variant="h6">Contact</Typography>
            <TextInput source="website" helperText={false} validate={isUrl} />
            <TextInput
                source="linkedin_url"
                helperText={false}
                validate={isLinkedinUrl}
            />
            <TextInput source="phone_number" helperText={false} />
        </Stack>
    );
};

const CompanyContextInputs = () => {
    const { companySectors } = useConfigurationContext();
    return (
        <Stack>
            <Typography variant="h6">Context</Typography>
            <SelectInput
                source="sector"
                choices={companySectors.map(sector => ({
                    id: sector,
                    name: sector,
                }))}
                helperText={false}
            />
            <SelectInput source="size" choices={sizes} helperText={false} />
            <TextInput source="revenue" helperText={false} />
            <TextInput source="tax_identifier" helperText={false} />
        </Stack>
    );
};

const CompanyAddressInputs = () => {
    return (
        <Stack>
            <Typography variant="h6">Address</Typography>
            <TextInput source="address" helperText={false} />
            <TextInput source="city" helperText={false} />
            <TextInput source="zipcode" helperText={false} />
            <TextInput source="stateAbbr" helperText={false} />
            <TextInput source="country" helperText={false} />
        </Stack>
    );
};

const CompanyAdditionalInformationInputs = () => {
    return (
        <Stack>
            <Typography variant="h6">Additional information</Typography>
            <TextInput source="description" multiline helperText={false} />
            <ArrayInput source="context_links" helperText={false}>
                <SimpleFormIterator
                    disableReordering
                    fullWidth
                    getItemLabel={false}
                    sx={{
                        m: 0,
                    }}
                >
                    <TextInput
                        source=""
                        hiddenLabel
                        helperText={false}
                        validate={isUrl}
                    />
                </SimpleFormIterator>
            </ArrayInput>
        </Stack>
    );
};

const CompanyAccountManagerInput = () => {
    return (
        <Stack>
            <Typography variant="h6">Account manager</Typography>
            <ReferenceInput
                source="sales_id"
                reference="sales"
                filter={{
                    'disabled@neq': true,
                }}
            >
                <SelectInput
                    label="Account manager"
                    helperText={false}
                    optionText={saleOptionRenderer}
                    validate={required()}
                />
            </ReferenceInput>
        </Stack>
    );
};

const saleOptionRenderer = (choice: Sale) =>
    `${choice.first_name} ${choice.last_name}`;
