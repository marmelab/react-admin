import { useCallback, useMemo } from 'react';
import { useDataProvider, useGetIdentity } from 'react-admin';
import { Company, Tag } from '../types';

export type ContentImportSchema = {
    first_name: string;
    last_name: string;
    gender: string;
    title: string;
    company: string;
    email: string;
    phone_number1: string;
    phone_number2: string;
    background: string;
    acquisition: string;
    avatar: string;
    first_seen: string;
    last_seen: string;
    has_newsletter: string;
    status: string;
    tags: string;
};

export function useContactImport() {
    const user = useGetIdentity();
    const dataProvider = useDataProvider();

    // Sales cache to avoid creating the same tag multiple times and costly roundtrips
    // Cache is dependent of dataProvider, so it's safe to use it as a dependency
    const companiesCache = useMemo(
        () => new Map<string, Company>(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataProvider]
    );

    const getCompany = useCallback(
        async (name: string) => {
            const trimmedName = name.trim();
            if (companiesCache.has(trimmedName)) {
                return companiesCache.get(trimmedName);
            }

            const companies = await dataProvider.getList('companies', {
                filter: { name: trimmedName },
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'first_name', order: 'ASC' },
            });

            if (companies.data.length === 1) {
                companiesCache.set(trimmedName, companies.data[0]);
                return companies.data[0];
            }

            const createdCompany = await dataProvider.create('companies', {
                data: {
                    name: trimmedName,
                    created_at: new Date(),
                    sales_id: user?.identity?.id,
                },
            });
            companiesCache.set(trimmedName, createdCompany.data);
            return createdCompany.data;
        },
        [dataProvider, companiesCache, user?.identity?.id]
    );

    // Tags cache to avoid creating the same tag multiple times and costly roundtrips
    // Cache is dependent of dataProvider, so it's safe to use it as a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const tagsCache = useMemo(() => new Map<string, Tag>(), [dataProvider]);

    const getTags = useCallback(
        async (tagNames: string[]) => {
            const missingTagNames = tagNames.filter(
                tagName => !tagsCache.has(tagName)
            );

            const uncachedTags = await dataProvider.getList('tags', {
                filter: { name: missingTagNames },
                pagination: { page: 1, perPage: missingTagNames.length },
                sort: { field: 'name', order: 'ASC' },
            });

            for (const tag of uncachedTags.data) {
                tagsCache.set(tag.name, tag);
            }

            for await (const tagName of missingTagNames) {
                if (!tagsCache.has(tagName)) {
                    const createdTag = await dataProvider.create('tags', {
                        data: { name: tagName, color: '#f9f9f9' },
                    });
                    tagsCache.set(tagName, createdTag.data);
                }
            }

            return tagNames
                .map(tagName => tagsCache.get(tagName))
                .filter((tag): tag is Tag => tag != null);
        },
        [dataProvider, tagsCache]
    );

    return {
        getTags,
        getCompany,
    };
}
