// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import rehypeCodeGroup from 'rehype-code-group';
import expressiveCode from 'astro-expressive-code';
import { pluginFullscreen } from 'expressive-code-fullscreen';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import rehypeAstroRelativeMarkdownLinks from 'astro-rehype-relative-markdown-links';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'ra-core',
            customCss: ['./src/styles/global.css'],
            favicon: '/favicon.ico',
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/marmelab/react-admin',
                },
            ],
            logo: {
                light: './public/logo-light.svg',
                dark: './public/logo-dark.svg',
                alt: 'ra-core',
            },
            head: [
                // add Umami analytics script tag.
                {
                    tag: 'script',
                    attrs: {
                        src: 'https://gursikso.marmelab.com/script.js',
                        'data-website-id':
                            '9d1797cc-8a8f-4600-a491-264e70d86654',
                        defer: true,
                        async: true,
                    },
                },
            ],
            sidebar: [
                {
                    label: 'Getting Started',
                    slug: 'getting-started',
                },
                {
                    label: 'Guides & Concepts',
                    items: [
                        'architecture',
                        'datafetchingguide',
                        'crud',
                        'forms',
                        'securityguide',
                        'routing',
                        'translation',
                        'store',
                        'features',
                    ],
                },
                {
                    label: 'App Configuration',
                    items: ['coreadmin', 'resource', 'customroutes'],
                },
                {
                    label: 'Data Fetching',
                    items: [
                        'dataproviders',
                        'actions',
                        'dataproviderlist',
                        'dataproviderwriting',
                        'fetchjson',
                        'usecreate',
                        'usedataprovider',
                        'usedelete',
                        'usedeletemany',
                        'usegetlist',
                        'usegetmany',
                        'usegetmanyreference',
                        'usegetone',
                        'useinfinitegetlist',
                        'useupdate',
                        'useupdatemany',
                        'withlifecyclecallbacks',
                    ],
                },
                {
                    label: 'Security',
                    items: [
                        'authentication',
                        'authproviderlist',
                        'authproviderwriting',
                        'permissions',
                        'authenticated',
                        'canaccess',
                        'useauthenticated',
                        'useauthprovider',
                        'useauthstate',
                        'usecanaccess',
                        'usegetidentity',
                        'uselogin',
                        'uselogout',
                        'usepermissions',
                        'addrefreshauthtoauthprovider',
                        'addrefreshauthtodataprovider',
                        enterpriseEntry('canAccessWithPermissions'),
                        enterpriseEntry('getPermissionsFromRoles'),
                    ],
                },
                {
                    label: 'List Page',
                    items: [
                        'listtutorial',
                        'filteringtutorial',
                        'listbase',
                        'infinitelistbase',
                        'recordsiterator',
                        'filterliveform',
                        'withlistcontext',
                        'uselist',
                        'uselistcontext',
                        'uselistcontroller',
                        'useunselect',
                        'useunselectall',
                    ],
                },
                {
                    label: 'Creation & Edition Pages',
                    items: [
                        'edittutorial',
                        'validation',
                        'createbase',
                        'editbase',
                        'form',
                        'usecreatecontext',
                        'usecreatecontroller',
                        'useeditcontext',
                        'useeditcontroller',
                        'userecordfromlocation',
                        'useregistermutationmiddleware',
                        'usesavecontext',
                        'useunique',
                    ],
                },
                {
                    label: 'Show Page',
                    items: ['showbase', 'useshowcontext', 'useshowcontroller'],
                },
                {
                    label: 'Common',
                    items: [
                        'withrecord',
                        'usegetrecordid',
                        'usenotify',
                        'userecordcontext',
                        'useredirect',
                        'userefresh',
                    ],
                },
                {
                    label: 'Fields',
                    items: [
                        'fields',
                        'fieldsforrelationships',
                        'referencearrayfieldbase',
                        'referencefieldbase',
                        'referencemanycountbase',
                        'referencemanyfieldbase',
                        enterpriseEntry(
                            'referencemanytomanyfieldbase',
                            '<ReferenceManyToManyFieldBase>'
                        ),
                        'referenceonefieldbase',
                        'usefieldvalue',
                    ],
                },
                {
                    label: 'Inputs',
                    items: [
                        'inputs',
                        'referenceinputbase',
                        'referencearrayinputbase',
                        enterpriseEntry(
                            'referencemanyinputbase',
                            '<ReferenceManyInputBase>'
                        ),
                        enterpriseEntry(
                            'referencemanytomanyinputbase',
                            '<ReferenceManyToManyInputBase>'
                        ),
                        enterpriseEntry(
                            'referenceoneinputbase',
                            '<ReferenceOneInputBase>'
                        ),
                        'formdataconsumer',
                        'usechoicescontext',
                        'useinput',
                        'usesourcecontext',
                    ],
                },
                {
                    label: 'Preferences',
                    items: [
                        'usestore',
                        'useremovefromstore',
                        'useresetstore',
                        'usestorecontext',
                    ],
                },
                {
                    label: 'I18N Provider & Translations',
                    items: [
                        'translationsetup',
                        'translationlocales',
                        'translationtranslating',
                        'translationwriting',
                        'translate',
                        'uselocalestate',
                        'usetranslate',
                    ],
                },
                {
                    label: 'Other Components & Hooks',
                    items: [
                        'recordrepresentation',
                        'usegetrecordrepresentation',
                    ],
                },
                {
                    label: 'Realtime',
                    items: [
                        enterpriseEntry('RealtimeFeatures', 'Setting Up'),
                        enterpriseEntry('<ListLiveUpdate>'),
                        enterpriseEntry('<LockOnMount>'),
                        enterpriseEntry('<LockStatusBase>'),
                        enterpriseEntry('<WithLocks>'),
                        enterpriseEntry('usePublish'),
                        enterpriseEntry('useSubscribe'),
                        enterpriseEntry('useSubscribeCallback'),
                        enterpriseEntry('useSubscribeToRecord'),
                        enterpriseEntry('useSubscribeToRecordList'),
                        enterpriseEntry('useLock'),
                        enterpriseEntry('useUnlock'),
                        enterpriseEntry('useGetLock'),
                        enterpriseEntry('useGetLockLive'),
                        enterpriseEntry('useGetLocks'),
                        enterpriseEntry('useGetLocksLive'),
                        enterpriseEntry('useLockCallbacks'),
                        enterpriseEntry('useLockOnMount'),
                        enterpriseEntry('useLockOnCall'),
                        enterpriseEntry('useGetListLive'),
                        enterpriseEntry('useGetOneLive'),
                    ],
                },
                {
                    label: 'Soft Delete',
                    items: [
                        enterpriseEntry('SoftDeleteDataProvider', 'Setting up'),
                        enterpriseEntry('<DeletedRecordsListBase>'),
                        enterpriseEntry('<ShowDeletedBase>'),
                        enterpriseEntry('<DeletedRecordRepresentation>'),
                        enterpriseEntry('addSoftDeleteBasedOnResource'),
                        enterpriseEntry('addSoftDeleteInPlace'),
                        enterpriseEntry('useSoftDelete'),
                        enterpriseEntry('useSoftDeleteMany'),
                        enterpriseEntry('useGetListDeleted'),
                        enterpriseEntry('useGetOneDeleted'),
                        enterpriseEntry('useRestoreOne'),
                        enterpriseEntry('useRestoreMany'),
                        enterpriseEntry('useHardDelete'),
                        enterpriseEntry('useHardDeleteMany'),
                        enterpriseEntry('useDeletedRecordsListController'),
                    ],
                },
                {
                    label: 'History',
                    items: [
                        enterpriseEntry('HistoryFeatures', 'Setting up'),
                        enterpriseEntry('useAddRevisionAfterMutation'),
                        enterpriseEntry('useApplyChangesBasedOnSearchParam'),
                        enterpriseEntry('useDeleteRevisions'),
                        enterpriseEntry('useGenerateChangeMessage'),
                        enterpriseEntry('useGetRevisions'),
                    ],
                },
                {
                    label: 'Recipes',
                    items: ['caching', 'unittesting'],
                },
            ],
            components: {
                Sidebar: './src/components/CustomSidebar.astro',
            },
        }),
        expressiveCode({
            plugins: [pluginFullscreen(), pluginCollapsibleSections()],
        }),
        react(),
        mdx(),
    ],
    markdown: {
        rehypePlugins: [
            rehypeCodeGroup,
            [
                rehypeAstroRelativeMarkdownLinks,
                {
                    base: '/ra-core/',
                    collectionBase: false,
                    trailingSlash: 'always',
                },
            ],
        ],
    },
    vite: {
        plugins: [tailwindcss()],
    },
    base: '/ra-core/',
    site: 'https://marmelab.com',
    build: {
        assets: 'assets',
    },
});

/**
 * @param {string} name
 * @returns {any}
 */
function enterpriseEntry(name, label = name) {
    return {
        link: `${name.toLowerCase().replace(/</g, '').replace(/>/g, '')}/`,
        label,
        attrs: { class: 'enterprise' },
        badge: {
            text: 'React Admin Enterprise',
            variant: 'default',
        },
    };
}
