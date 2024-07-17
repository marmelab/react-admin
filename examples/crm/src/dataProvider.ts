import fakeRestDataProvider from 'ra-data-fakerest';
import {
    CreateParams,
    DataProvider,
    UpdateParams,
    withLifecycleCallbacks,
} from 'react-admin';

import generateData from './dataGenerator';
import { getContactAvatar } from './misc/getContactAvatar';
import { getCompanyAvatar } from './misc/getCompanyAvatar';

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

const beforeContactUpsert = async (
    params: CreateParams<any> | UpdateParams<any>,
    dataProvider: DataProvider
) => {
    const { data } = params;
    const avatarUrl = await getContactAvatar(data);
    data.avatar = avatarUrl || null;

    if (!data.company_id) {
        return params;
    }

    const { data: company } = await dataProvider.getOne('companies', {
        id: data.company_id,
    });

    if (!company) {
        return params;
    }

    data.company_name = company.name;
    return params;
};

const dataProviderWithCustomMethode = {
    ...baseDataProvider,
    login: async ({ email }: { email: string }) => {
        const users = await baseDataProvider.getList('users', {
            pagination: { page: 1, perPage: 200 },
            sort: { field: 'name', order: 'ASC' },
        });

        if (!users.data.length) {
            return null;
        }

        const user = users.data.find(user => user.email === email);
        if (!user) {
            return null;
        }
        return user;
    },
};

export const dataProvider = withLifecycleCallbacks(
    dataProviderWithCustomMethode,
    [
        {
            resource: 'contacts',
            beforeCreate: async (params, dataProvider) => {
                const { data } = params;
                const avatarUrl = await getContactAvatar(data);
                data.avatar = avatarUrl || null;
                return beforeContactUpsert(params, dataProvider);
            },
            beforeUpdate: async params => {
                const { data } = params;
                const avatarUrl = await getContactAvatar(data);
                data.avatar = avatarUrl || null;
                const result = await beforeContactUpsert(params, dataProvider);
                return {
                    ...params,
                    data: result.data,
                };
            },
        },
        {
            resource: 'contactNotes',
            afterCreate: async (result, dataProvider) => {
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
        },
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
        },
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
                // get all users of the company and for each user, update the company_name
                const { id, name } = result.data;
                const { data: contacts } = await dataProvider.getList(
                    'contacts',
                    {
                        filter: { company_id: id },
                        pagination: { page: 1, perPage: 1000 },
                        sort: { field: 'id', order: 'ASC' },
                    }
                );
                await Promise.all(
                    contacts.map(contact =>
                        dataProvider.update('contacts', {
                            id: contact.id,
                            data: {
                                company_name: name,
                            },
                            previousData: contact,
                        })
                    )
                );
                return result;
            },
        },
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
