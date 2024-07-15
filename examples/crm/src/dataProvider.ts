import fakeRestDataProvider from 'ra-data-fakerest';
import { withLifecycleCallbacks } from 'react-admin';

import generateData from './dataGenerator';
import { getAvatarUrl } from './misc/getContactAvatar';

const baseDataProvider = fakeRestDataProvider(generateData(), true, 300);

const TASK_MARKED_AS_DONE = 'TASK_MARKED_AS_DONE';
const TASK_MARKED_AS_UNDONE = 'TASK_MARKED_AS_UNDONE';
const TASK_DONE_NOT_CHANGED = 'TASK_DONE_NOT_CHANGED';
let taskUpdateType = TASK_DONE_NOT_CHANGED;

export const dataProvider = withLifecycleCallbacks(baseDataProvider, [
    {
        resource: 'contacts',
        beforeCreate: async params => {
            const { data } = params;
            const avatarUrl = await getAvatarUrl(data);
            data.avatar = avatarUrl || null;
            return params;
        },
        beforeUpdate: async params => {
            const { data } = params;
            const avatarUrl = await getAvatarUrl(data);
            data.avatar = avatarUrl || null;
            return params;
        },
    },
    {
        resource: 'contactNotes',
        afterCreate: async (result, dataProvider) => {
            // update the notes count in the related contact
            const { contact_id } = result.data;
            const { data: contact } = await dataProvider.getOne('contacts', {
                id: contact_id,
            });
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
            const { data: contact } = await dataProvider.getOne('contacts', {
                id: contact_id,
            });
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
            const { data: contact } = await dataProvider.getOne('contacts', {
                id: contact_id,
            });
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
            const { data: contact } = await dataProvider.getOne('contacts', {
                id: contact_id,
            });
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
            const { data: contact } = await dataProvider.getOne('contacts', {
                id: contact_id,
            });
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
]);
