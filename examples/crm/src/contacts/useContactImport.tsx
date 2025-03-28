import { useCallback, useMemo } from 'react';
import { useDataProvider, useGetIdentity } from 'react-admin';
import type { DataProvider } from 'react-admin';
import type { Company, Tag } from '../types';

export type ContactImportSchema = {
    first_name: string;
    last_name: string;
    gender: string;
    title: string;
    company: string;
    email: string;
    phone_1_number: string;
    phone_1_type: string;
    phone_2_number: string;
    phone_2_type: string;
    background: string;
    avatar: string;
    first_seen: string;
    last_seen: string;
    has_newsletter: string;
    status: string;
    tags: string;
    linkedin_url: string;
};

export function useContactImport() {
    const today = new Date().toISOString();
    const user = useGetIdentity();
    const dataProvider = useDataProvider();

    // company cache to avoid creating the same company multiple times and costly roundtrips
    // Cache is dependent of dataProvider, so it's safe to use it as a dependency
    const companiesCache = useMemo(
        () => new Map<string, Company>(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataProvider]
    );
    const getCompanies = useCallback(
        async (names: string[]) =>
            fetchRecordsWithCache<Company>(
                'companies',
                companiesCache,
                names,
                name => ({
                    name,
                    created_at: new Date().toISOString(),
                    sales_id: user?.identity?.id,
                }),
                dataProvider
            ),
        [companiesCache, user?.identity?.id, dataProvider]
    );

    // Tags cache to avoid creating the same tag multiple times and costly roundtrips
    // Cache is dependent of dataProvider, so it's safe to use it as a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const tagsCache = useMemo(() => new Map<string, Tag>(), [dataProvider]);
    const getTags = useCallback(
        async (names: string[]) =>
            fetchRecordsWithCache<Tag>(
                'tags',
                tagsCache,
                names,
                name => ({
                    name,
                    color: '#f9f9f9',
                }),
                dataProvider
            ),
        [tagsCache, dataProvider]
    );

    const processBatch = useCallback(
        async (batch: ContactImportSchema[]) => {
            const [companies, tags] = await Promise.all([
                getCompanies(
                    batch
                        .map(contact => contact.company?.trim())
                        .filter(name => name)
                ),
                getTags(batch.flatMap(batch => parseTags(batch.tags))),
            ]);

            await Promise.all(
                batch.map(
                    async ({
                        first_name,
                        last_name,
                        gender,
                        title,
                        email,
                        phone_1_number,
                        phone_1_type,
                        phone_2_number,
                        phone_2_type,
                        background,
                        first_seen,
                        last_seen,
                        has_newsletter,
                        status,
                        company: companyName,
                        tags: tagNames,
                        linkedin_url,
                    }) => {
                        const singleEmail = email.split(',')[0];
                        const company = companyName?.trim()
                            ? companies.get(companyName.trim())
                            : undefined;
                        const tagList = parseTags(tagNames)
                            .map(name => tags.get(name))
                            .filter((tag): tag is Tag => !!tag);

                        return dataProvider.create('contacts', {
                            data: {
                                first_name,
                                last_name,
                                gender,
                                title,
                                email: singleEmail,
                                phone_1_number,
                                phone_1_type,
                                phone_2_number,
                                phone_2_type,
                                background,
                                first_seen: first_seen
                                    ? new Date(first_seen).toISOString()
                                    : today,
                                last_seen: last_seen
                                    ? new Date(last_seen).toISOString()
                                    : today,
                                has_newsletter,
                                status,
                                company_id: company?.id,
                                tags: tagList.map(tag => tag.id),
                                sales_id: user?.identity?.id,
                                linkedin_url,
                            },
                        });
                    }
                )
            );
        },
        [dataProvider, getCompanies, getTags, user?.identity?.id, today]
    );

    return processBatch;
}

const fetchRecordsWithCache = async function <T>(
    resource: string,
    cache: Map<string, T>,
    names: string[],
    getCreateData: (name: string) => Partial<T>,
    dataProvider: DataProvider
) {
    const trimmedNames = [...new Set(names.map(name => name.trim()))];
    const uncachedRecordNames = trimmedNames.filter(name => !cache.has(name));

    // check the backend for existing records
    if (uncachedRecordNames.length > 0) {
        const response = await dataProvider.getList(resource, {
            filter: {
                'name@in': `(${uncachedRecordNames.map(name => `"${name}"`).join(',')})`,
            },
            pagination: { page: 1, perPage: trimmedNames.length },
            sort: { field: 'id', order: 'ASC' },
        });
        for (const record of response.data) {
            cache.set(record.name.trim(), record);
        }
    }

    // create missing records in parallel
    await Promise.all(
        uncachedRecordNames.map(async name => {
            if (cache.has(name)) return;
            const response = await dataProvider.create(resource, {
                data: getCreateData(name),
            });
            cache.set(name, response.data);
        })
    );

    // now all records are in cache, return a map of all records
    return trimmedNames.reduce((acc, name) => {
        acc.set(name, cache.get(name) as T);
        return acc;
    }, new Map<string, T>());
};

const parseTags = (tags: string) =>
    tags
        ?.split(',')
        ?.map((tag: string) => tag.trim())
        ?.filter((tag: string) => tag) ?? [];
