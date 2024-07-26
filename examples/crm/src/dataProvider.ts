import fakeRestDataProvider from 'ra-data-fakerest';
import {
    CreateParams,
    DataProvider,
    Identifier,
    ResourceCallbacks,
    UpdateParams,
    withLifecycleCallbacks,
} from 'react-admin';
import { DEFAULT_USER } from './authProvider';
import generateData from './dataGenerator';
import { getActivityLog } from './dataProvider/activity';
import { getCompanyAvatar } from './misc/getCompanyAvatar';
import { getContactAvatar } from './misc/getContactAvatar';
import { Company, Contact, ContactNote, Deal, Sale, Task } from './types';

const baseDataProvider = fakeRestDataProvider(generateData(), true, 300);

const TASK_MARKED_AS_DONE = 'TASK_MARKED_AS_DONE';
const TASK_MARKED_AS_UNDONE = 'TASK_MARKED_AS_UNDONE';
const TASK_DONE_NOT_CHANGED = 'TASK_DONE_NOT_CHANGED';
let taskUpdateType = TASK_DONE_NOT_CHANGED;

const processCompanyLogo = async (params: any) => {
    let logo = params.data.logo;

    if (typeof logo !== 'object' || logo === null) {
        logo = getCompanyAvatar(params.data);
    } else if (logo.rawFile instanceof File) {
        const base64Logo = await convertFileToBase64(logo);
        logo = { src: base64Logo, title: logo.title };
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
    params: UpdateParams<Contact>,
    dataProvider: DataProvider
): Promise<UpdateParams<Contact>>;

async function processContactAvatar(
    params: CreateParams<Contact>,
    dataProvider: DataProvider
): Promise<CreateParams<Contact>>;

async function processContactAvatar(
    params: CreateParams<Contact> | UpdateParams<Contact>,
    dataProvider: DataProvider
): Promise<CreateParams<Contact> | UpdateParams<Contact>> {
    const { data } = params;
    const avatarUrl = await getContactAvatar(data);

    // Clone the data and modify the clone
    const newData = { ...data, avatar: avatarUrl || null };

    if (!newData.company_id) {
        return { ...params, data: newData };
    }

    const { data: company } = await dataProvider.getOne('companies', {
        id: newData.company_id,
    });

    if (!company) {
        return { ...params, data: newData };
    }

    newData.company_name = company.name;
    return { ...params, data: newData };
}

const dataProviderWithCustomMethod = {
    ...baseDataProvider,
    login: async ({ email }: { email: string }) => {
        const sales = await baseDataProvider.getList('sales', {
            pagination: { page: 1, perPage: 200 },
            sort: { field: 'name', order: 'ASC' },
        });

        if (!sales.data.length) {
            return { ...DEFAULT_USER };
        }

        const sale = sales.data.find(sale => sale.email === email);
        if (!sale) {
            return { ...DEFAULT_USER };
        }
        return sale;
    },
    transferAdministratorRole: async (from: Identifier, to: Identifier) => {
        const { data: sales } = await baseDataProvider.getList('sales', {
            filter: { id: [from, to] },
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'name', order: 'ASC' },
        });

        const fromSale = sales.find(sale => sale.id === from);
        const toSale = sales.find(sale => sale.id === to);

        if (!fromSale || !toSale) {
            return null;
        }

        await baseDataProvider.update('sales', {
            id: to,
            data: {
                administrator: true,
            },
            previousData: toSale,
        });

        const updatedUser = await baseDataProvider.update('sales', {
            id: from,
            data: {
                administrator: false,
            },
            previousData: fromSale,
        });
        return updatedUser.data;
    },
    unarchiveDeal: async (deal: Deal) => {
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
    // We simulate a remote endpoint that is in charge of returning activity log
    getActivityLog: async (companyId?: Identifier) => {
        return getActivityLog(baseDataProvider, companyId);
    },
};

export type CustomDataProvider = typeof dataProviderWithCustomMethod;

export const dataProvider = withLifecycleCallbacks(
    dataProviderWithCustomMethod,
    [
        {
            resource: 'sales',
            beforeCreate: async params => {
                const { data } = params;
                // If administrator role is not set, we simply set it to false
                if (data.administrator == null) {
                    data.administrator = false;
                }
                return params;
            },
            beforeUpdate: async params => {
                const { data } = params;
                if (data.new_password) {
                    data.password = data.new_password;
                    delete data.new_password;
                }

                return params;
            },
            beforeDelete: async params => {
                if (params.meta?.identity?.id == null) {
                    throw new Error('Identity MUST be set in meta');
                }

                const newSaleId = params.meta.identity.id as Identifier;

                const [companies, contacts, contactNotes, deals] =
                    await Promise.all([
                        dataProvider.getList('companies', {
                            filter: { sales_id: params.id },
                            pagination: {
                                page: 1,
                                perPage: 10_000,
                            },
                            sort: { field: 'id', order: 'ASC' },
                        }),
                        dataProvider.getList('contacts', {
                            filter: { sales_id: params.id },
                            pagination: {
                                page: 1,
                                perPage: 10_000,
                            },
                            sort: { field: 'id', order: 'ASC' },
                        }),
                        dataProvider.getList('contactNotes', {
                            filter: { sales_id: params.id },
                            pagination: {
                                page: 1,
                                perPage: 10_000,
                            },
                            sort: { field: 'id', order: 'ASC' },
                        }),
                        dataProvider.getList('deals', {
                            filter: { sales_id: params.id },
                            pagination: {
                                page: 1,
                                perPage: 10_000,
                            },
                            sort: { field: 'id', order: 'ASC' },
                        }),
                    ]);

                await Promise.all([
                    dataProvider.updateMany('companies', {
                        ids: companies.data.map(company => company.id),
                        data: {
                            sales_id: newSaleId,
                        },
                    }),
                    dataProvider.updateMany('contacts', {
                        ids: contacts.data.map(company => company.id),
                        data: {
                            sales_id: newSaleId,
                        },
                    }),
                    dataProvider.updateMany('contactNotes', {
                        ids: contactNotes.data.map(company => company.id),
                        data: {
                            sales_id: newSaleId,
                        },
                    }),
                    dataProvider.updateMany('deals', {
                        ids: deals.data.map(company => company.id),
                        data: {
                            sales_id: newSaleId,
                        },
                    }),
                ]);

                return params;
            },
        } satisfies ResourceCallbacks<Sale>,
        {
            resource: 'contacts',
            beforeCreate: async (params, dataProvider) => {
                return processContactAvatar(params, dataProvider);
            },
            afterCreate: async (result, dataProvider) => {
                const { data: company } = await dataProvider.getOne<Company>(
                    'companies',
                    {
                        id: result.data.company_id,
                    }
                );
                await dataProvider.update('companies', {
                    id: company.id,
                    data: {
                        nb_contacts: (company.nb_contacts ?? 0) + 1,
                    },
                    previousData: company,
                });

                return result;
            },
            beforeUpdate: async params => {
                return processContactAvatar(params, dataProvider);
            },
            afterDelete: async (result, dataProvider) => {
                const { data: company } = await dataProvider.getOne<Company>(
                    'companies',
                    {
                        id: result.data.company_id,
                    }
                );
                await dataProvider.update('companies', {
                    id: company.id,
                    data: {
                        nb_contacts: (company.nb_contacts ?? 1) - 1,
                    },
                    previousData: company,
                });

                return result;
            },
        } satisfies ResourceCallbacks<Contact>,
        {
            resource: 'contactNotes',
            afterCreate: async (result, dataProvider) => {
                // update the notes count in the related contact
                const { contact_id } = result.data;
                const { data: contact } = await dataProvider.getOne<Contact>(
                    'contacts',
                    {
                        id: contact_id,
                    }
                );
                await dataProvider.update('contacts', {
                    id: contact_id,
                    data: {
                        nb_notes: (contact.nb_notes ?? 0) + 1,
                    },
                    previousData: contact,
                });
                return result;
            },
            afterDelete: async (result, dataProvider) => {
                // update the notes count in the related contact
                const { contact_id } = result.data;
                const { data: contact } = await dataProvider.getOne(
                    'contacts',
                    {
                        id: contact_id,
                    }
                );
                await dataProvider.update('contacts', {
                    id: contact_id,
                    data: {
                        nb_notes: (contact.nb_notes ?? 0) - 1,
                    },
                    previousData: contact,
                });
                return result;
            },
        } satisfies ResourceCallbacks<ContactNote>,
        {
            resource: 'tasks',
            afterCreate: async (result, dataProvider) => {
                // update the task count in the related contact
                const { contact_id } = result.data;
                const { data: contact } = await dataProvider.getOne(
                    'contacts',
                    {
                        id: contact_id,
                    }
                );
                await dataProvider.update('contacts', {
                    id: contact_id,
                    data: {
                        nb_tasks: (contact.nb_tasks ?? 0) + 1,
                    },
                    previousData: contact,
                });
                return result;
            },
            beforeUpdate: async params => {
                const { data, previousData } = params;
                if (previousData.done_date !== data.done_date) {
                    taskUpdateType = data.done_date
                        ? TASK_MARKED_AS_DONE
                        : TASK_MARKED_AS_UNDONE;
                } else {
                    taskUpdateType = TASK_DONE_NOT_CHANGED;
                }
                return params;
            },
            afterUpdate: async (result, dataProvider) => {
                // update the contact: if the task is done, decrement the nb tasks, otherwise increment it
                const { contact_id } = result.data;
                const { data: contact } = await dataProvider.getOne(
                    'contacts',
                    {
                        id: contact_id,
                    }
                );
                if (taskUpdateType !== TASK_DONE_NOT_CHANGED) {
                    await dataProvider.update('contacts', {
                        id: contact_id,
                        data: {
                            nb_tasks:
                                taskUpdateType === TASK_MARKED_AS_DONE
                                    ? (contact.nb_tasks ?? 0) - 1
                                    : (contact.nb_tasks ?? 0) + 1,
                        },
                        previousData: contact,
                    });
                }
                return result;
            },
            afterDelete: async (result, dataProvider) => {
                // update the task count in the related contact
                const { contact_id } = result.data;
                const { data: contact } = await dataProvider.getOne(
                    'contacts',
                    {
                        id: contact_id,
                    }
                );
                await dataProvider.update('contacts', {
                    id: contact_id,
                    data: {
                        nb_tasks: (contact.nb_tasks ?? 0) - 1,
                    },
                    previousData: contact,
                });
                return result;
            },
        } satisfies ResourceCallbacks<Task>,
        {
            resource: 'companies',
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
            afterUpdate: async (result, dataProvider) => {
                // get all contacts of the company and for each contact, update the company_name
                const { id, name } = result.data;
                const { data: contacts } = await dataProvider.getList(
                    'contacts',
                    {
                        filter: { company_id: id },
                        pagination: { page: 1, perPage: 1000 },
                        sort: { field: 'id', order: 'ASC' },
                    }
                );

                const contactIds = contacts.map(contact => contact.id);
                await dataProvider.updateMany('contacts', {
                    ids: contactIds,
                    data: {
                        company_name: name,
                    },
                });
                return result;
            },
        } satisfies ResourceCallbacks<Company>,
        {
            resource: 'deals',
            beforeCreate: async params => {
                return {
                    ...params,
                    data: {
                        ...params.data,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                };
            },
            afterCreate: async (result, dataProvider) => {
                const { data: company } = await dataProvider.getOne<Company>(
                    'companies',
                    {
                        id: result.data.company_id,
                    }
                );
                await dataProvider.update('companies', {
                    id: company.id,
                    data: {
                        nb_deals: (company.nb_deals ?? 0) + 1,
                    },
                    previousData: company,
                });

                return result;
            },
            beforeUpdate: async params => {
                return {
                    ...params,
                    data: {
                        ...params.data,
                        updated_at: new Date().toISOString(),
                    },
                };
            },
            afterDelete: async (result, dataProvider) => {
                const { data: company } = await dataProvider.getOne<Company>(
                    'companies',
                    {
                        id: result.data.company_id,
                    }
                );
                await dataProvider.update('companies', {
                    id: company.id,
                    data: {
                        nb_deals: (company.nb_deals ?? 1) - 1,
                    },
                    previousData: company,
                });

                return result;
            },
        } satisfies ResourceCallbacks<Deal>,
    ]
);

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of dataprovider decoration.
 */
const convertFileToBase64 = (file: { rawFile: Blob }) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file.rawFile);
    });
