import { supabaseDataProvider } from 'ra-supabase';

import {
    CreateParams,
    DataProvider,
    GetListParams,
    Identifier,
    UpdateParams,
    withLifecycleCallbacks,
} from 'react-admin';
import {
    Contact,
    ContactNote,
    Deal,
    DealNote,
    RAFile,
    Sale,
    SalesFormData,
    SignUpData,
} from '../../types';
import { getActivityLog } from '../commons/activity';
import { getCompanyAvatar } from '../commons/getCompanyAvatar';
import { getContactAvatar } from '../commons/getContactAvatar';
import { getIsInitialized } from './authProvider';
import { supabase } from './supabase';

if (import.meta.env.VITE_SUPABASE_URL === undefined) {
    throw new Error('Please set the VITE_SUPABASE_URL environment variable');
}
if (import.meta.env.VITE_SUPABASE_ANON_KEY === undefined) {
    throw new Error(
        'Please set the VITE_SUPABASE_ANON_KEY environment variable'
    );
}

const baseDataProvider = supabaseDataProvider({
    instanceUrl: import.meta.env.VITE_SUPABASE_URL,
    apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseClient: supabase,
});

const processCompanyLogo = async (params: any) => {
    let logo = params.data.logo;

    if (typeof logo !== 'object' || logo === null || !logo.src) {
        logo = await getCompanyAvatar(params.data);
    } else if (logo.rawFile instanceof File) {
        await uploadToBucket(logo);
    }

    return {
        ...params,
        data: {
            ...params.data,
            logo,
        },
    };
};

async function processContactAvatar(
    params: UpdateParams<Contact>
): Promise<UpdateParams<Contact>>;

async function processContactAvatar(
    params: CreateParams<Contact>
): Promise<CreateParams<Contact>>;

async function processContactAvatar(
    params: CreateParams<Contact> | UpdateParams<Contact>
): Promise<CreateParams<Contact> | UpdateParams<Contact>> {
    const { data } = params;
    if (!data.avatar && !data.email) {
        return params;
    }
    const avatarUrl = await getContactAvatar(data);

    // Clone the data and modify the clone
    const newData = { ...data, avatar: { src: avatarUrl || undefined } };

    return { ...params, data: newData };
}

const dataProviderWithCustomMethods = {
    ...baseDataProvider,
    async getList(resource: string, params: GetListParams) {
        if (resource === 'companies') {
            return baseDataProvider.getList('companies_summary', params);
        }
        if (resource === 'contacts') {
            return baseDataProvider.getList('contacts_summary', params);
        }

        return baseDataProvider.getList(resource, params);
    },
    async getOne(resource: string, params: any) {
        if (resource === 'companies') {
            return baseDataProvider.getOne('companies_summary', params);
        }
        if (resource === 'contacts') {
            return baseDataProvider.getOne('contacts_summary', params);
        }

        return baseDataProvider.getOne(resource, params);
    },

    async signUp({ email, password, first_name, last_name }: SignUpData) {
        const response = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name,
                    last_name,
                },
            },
        });

        if (!response.data?.user || response.error) {
            console.error('signUp.error', response.error);
            throw new Error('Failed to create account');
        }

        // Update the is initialized cache
        getIsInitialized._is_initialized_cache = true;

        return {
            id: response.data.user.id,
            email,
            password,
        };
    },
    async salesCreate(body: SalesFormData) {
        const { data, error } = await supabase.functions.invoke<Sale>('users', {
            method: 'POST',
            body,
        });

        if (!data || error) {
            console.error('salesCreate.error', error);
            throw new Error('Failed to create account manager');
        }

        return data;
    },
    async salesUpdate(
        id: Identifier,
        data: Partial<Omit<SalesFormData, 'password'>>
    ) {
        const { email, first_name, last_name, administrator, disabled } = data;

        const { data: sale, error } = await supabase.functions.invoke<Sale>(
            'users',
            {
                method: 'PATCH',
                body: {
                    sales_id: id,
                    email,
                    first_name,
                    last_name,
                    administrator,
                    disabled,
                },
            }
        );

        if (!sale || error) {
            console.error('salesCreate.error', error);
            throw new Error('Failed to update account manager');
        }

        return data;
    },
    async updatePassword(id: Identifier) {
        const { data: passwordUpdated, error } =
            await supabase.functions.invoke<boolean>('updatePassword', {
                method: 'PATCH',
                body: {
                    sales_id: id,
                },
            });

        if (!passwordUpdated || error) {
            console.error('passwordUpdate.error', error);
            throw new Error('Failed to update password');
        }

        return passwordUpdated;
    },
    async unarchiveDeal(deal: Deal) {
        // get all deals where stage is the same as the deal to unarchive
        const { data: deals } = await baseDataProvider.getList<Deal>('deals', {
            filter: { stage: deal.stage },
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'index', order: 'ASC' },
        });

        // set index for each deal starting from 1, if the deal to unarchive is found, set its index to the last one
        const updatedDeals = deals.map((d, index) => ({
            ...d,
            index: d.id === deal.id ? 0 : index + 1,
            archived_at: d.id === deal.id ? null : d.archived_at,
        }));

        return await Promise.all(
            updatedDeals.map(updatedDeal =>
                baseDataProvider.update('deals', {
                    id: updatedDeal.id,
                    data: updatedDeal,
                    previousData: deals.find(d => d.id === updatedDeal.id),
                })
            )
        );
    },
    async getActivityLog(companyId?: Identifier) {
        return getActivityLog(baseDataProvider, companyId);
    },
    async isInitialized() {
        return getIsInitialized();
    },
} satisfies DataProvider;

export type CrmDataProvider = typeof dataProviderWithCustomMethods;

export const dataProvider = withLifecycleCallbacks(
    dataProviderWithCustomMethods,
    [
        {
            resource: 'contactNotes',
            beforeSave: async (data: ContactNote, _, __) => {
                if (data.attachments) {
                    for (const fi of data.attachments) {
                        await uploadToBucket(fi);
                    }
                }
                return data;
            },
        },
        {
            resource: 'dealNotes',
            beforeSave: async (data: DealNote, _, __) => {
                if (data.attachments) {
                    for (const fi of data.attachments) {
                        await uploadToBucket(fi);
                    }
                }
                return data;
            },
        },
        {
            resource: 'sales',
            beforeSave: async (data: Sale, _, __) => {
                if (data.avatar) {
                    await uploadToBucket(data.avatar);
                }
                return data;
            },
        },
        {
            resource: 'contacts',
            beforeCreate: async params => {
                return processContactAvatar(params);
            },
            beforeUpdate: async params => {
                return processContactAvatar(params);
            },
            beforeGetList: async params => {
                return applyFullTextSearch([
                    'first_name',
                    'last_name',
                    'company_name',
                    'title',
                    'email',
                    'phone_1_number',
                    'phone_2_number',
                    'background',
                ])(params);
            },
        },
        {
            resource: 'companies',
            beforeGetList: async params => {
                return applyFullTextSearch([
                    'name',
                    'phone_number',
                    'website',
                    'zipcode',
                    'city',
                    'stateAbbr',
                ])(params);
            },
            beforeCreate: async params => {
                const createParams = await processCompanyLogo(params);

                return {
                    ...createParams,
                    data: {
                        ...createParams.data,
                        created_at: new Date().toISOString(),
                    },
                };
            },
            beforeUpdate: async params => {
                return await processCompanyLogo(params);
            },
        },
        {
            resource: 'contacts_summary',
            beforeGetList: async params => {
                return applyFullTextSearch(['first_name', 'last_name'])(params);
            },
        },
        {
            resource: 'deals',
            beforeGetList: async params => {
                return applyFullTextSearch(['name', 'type', 'description'])(
                    params
                );
            },
        },
    ]
);

const applyFullTextSearch = (columns: string[]) => (params: GetListParams) => {
    if (!params.filter?.q) {
        return params;
    }
    const { q, ...filter } = params.filter;
    return {
        ...params,
        filter: {
            ...filter,
            '@or': columns.reduce(
                (acc, column) => ({
                    ...acc,
                    [`${column}@ilike`]: q,
                }),
                {}
            ),
        },
    };
};

const uploadToBucket = async (fi: RAFile) => {
    if (!fi.src.startsWith('blob:') && !fi.src.startsWith('data:')) {
        // Sign URL check if path exists in the bucket
        if (fi.path) {
            const { error } = await supabase.storage
                .from('attachments')
                .createSignedUrl(fi.path, 60);

            if (!error) {
                return;
            }
        }
    }

    const dataContent = fi.src
        ? await fetch(fi.src).then(res => res.blob())
        : fi.rawFile;

    const file = fi.rawFile;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, dataContent);

    if (uploadError) {
        console.error('uploadError', uploadError);
        throw new Error('Failed to upload attachment');
    }

    const { data } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

    fi.path = filePath;
    fi.src = data.publicUrl;

    // save MIME type
    const mimeType = file.type;
    fi.type = mimeType;

    return fi;
};
