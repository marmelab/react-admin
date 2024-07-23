import fakeRestDataProvider from 'ra-data-fakerest';
import {
    CreateParams,
    DataProvider,
    ResourceCallbacks,
    UpdateParams,
    withLifecycleCallbacks,
} from 'react-admin';
import {
    COMPANY_CREATED,
    CONTACT_CREATED,
    CONTACT_NOTE_CREATED,
    DEAL_CREATED,
} from './consts';
import generateData from './dataGenerator';
import { getCompanyAvatar } from './misc/getCompanyAvatar';
import { getContactAvatar } from './misc/getContactAvatar';
import { Company, Contact, ContactNote, Deal, Task } from './types';

const baseDataProvider = fakeRestDataProvider(generateData(), true, 300);

const TASK_MARKED_AS_DONE = 'TASK_MARKED_AS_DONE';
const TASK_MARKED_AS_UNDONE = 'TASK_MARKED_AS_UNDONE';
const TASK_DONE_NOT_CHANGED = 'TASK_DONE_NOT_CHANGED';
let taskUpdateType = TASK_DONE_NOT_CHANGED;

const processLogo = async (params: any) => {
    if (typeof params.data.logo !== 'object' || params.data.logo === null) {
        return getCompanyAvatar(params.data);
    }
    const logo = params.data.logo;
    if (logo.rawFile instanceof File) {
        const base64Logo = await convertFileToBase64(logo);
        return {
            src: base64Logo,
            title: logo.title,
        };
    }

    return logo;
};

async function beforeContactUpsert(
    params: UpdateParams<Contact>,
    dataProvider: DataProvider
): Promise<UpdateParams<Contact>>;

async function beforeContactUpsert(
    params: CreateParams<Contact>,
    dataProvider: DataProvider
): Promise<CreateParams<Contact>>;

async function beforeContactUpsert(
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
            return { id: 0, first_name: 'Jane', last_name: 'Doe' };
        }

        const sale = sales.data.find(sale => sale.email === email);
        if (!sale) {
            return { id: 0, first_name: 'Jane', last_name: 'Doe' };
        }
        return sale;
    },
};

export const dataProvider = withLifecycleCallbacks(
    dataProviderWithCustomMethod,
    [
        {
            resource: 'contacts',
            beforeCreate: async (params, dataProvider) => {
                return beforeContactUpsert(params, dataProvider);
            },
            beforeUpdate: async params => {
                return beforeContactUpsert(params, dataProvider);
            },
            afterCreate: async (result, dataProvider) => {
                await dataProvider.create('activityLogs', {
                    data: {
                        date: new Date().toISOString(),
                        type: CONTACT_CREATED,
                        company_id: result.data.company_id,
                        contact_id: result.data.id,
                    },
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
                await dataProvider.create('activityLogs', {
                    data: {
                        date: new Date().toISOString(),
                        type: CONTACT_NOTE_CREATED,
                        company_id: contact.company_id,
                        contact_note_id: result.data.id,
                    },
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
                const logo = await processLogo(params);
                return {
                    ...params,
                    data: {
                        ...params.data,
                        logo,
                    },
                };
            },
            afterCreate: async (result, dataProvider) => {
                await dataProvider.create('activityLogs', {
                    data: {
                        date: new Date().toISOString(),
                        type: COMPANY_CREATED,
                        company_id: result.data.id,
                    },
                });
                return result;
            },
            beforeUpdate: async params => {
                const logo = await processLogo(params);
                return {
                    ...params,
                    data: {
                        ...params.data,
                        logo,
                    },
                };
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

                await dataProvider.create('activityLogs', {
                    data: {
                        date: new Date().toISOString(),
                        type: DEAL_CREATED,
                        company_id: result.data.company_id,
                        deal_id: result.data.id,
                    },
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
