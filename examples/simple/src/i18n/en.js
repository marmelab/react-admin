import englishMessages from 'ra-language-english';
import treeEnglishMessages from 'ra-tree-language-english';
import { mergeTranslations } from 'react-admin';

export const messages = {
    simple: {
        action: {
            close: 'Close',
            resetViews: 'Reset views',
        },
        'create-post': 'New post',
    },
    ...mergeTranslations(englishMessages, treeEnglishMessages),
    resources: {
        posts: {
            name: 'Post |||| Posts',
            fields: {
                average_note: 'Average note',
                body: 'Body',
                comments: 'Comments',
                commentable: 'Commentable',
                commentable_short: 'Com.',
                created_at: 'Created at',
                notifications: 'Notifications recipients',
                nb_view: 'Nb views',
                password: 'Password (if protected post)',
                pictures: 'Related Pictures',
                published_at: 'Published at',
                teaser: 'Teaser',
                tags: 'Tags',
                title: 'Title',
                views: 'Views',
                authors: 'Authors',
            },
        },
        comments: {
            name: 'Comment |||| Comments',
            fields: {
                body: 'Body',
                created_at: 'Created at',
                post_id: 'Posts',
                author: {
                    name: 'Author',
                },
            },
        },
        users: {
            name: 'User |||| Users',
            fields: {
                name: 'Name',
                role: 'Role',
            },
        },
    },
    post: {
        list: {
            search: 'Search',
        },
        form: {
            summary: 'Summary',
            body: 'Body',
            miscellaneous: 'Miscellaneous',
            comments: 'Comments',
        },
        edit: {
            title: 'Post "%{title}"',
        },
        action: {
            save_and_add: 'Save and Add',
            save_and_show: 'Save and Show',
            save_with_average_note: 'Save with Note',
        },
    },
    comment: {
        list: {
            about: 'About',
        },
    },
    user: {
        list: {
            search: 'Search',
        },
        form: {
            summary: 'Summary',
            security: 'Security',
        },
        edit: {
            title: 'User "%{title}"',
        },
        action: {
            save_and_add: 'Save and Add',
            save_and_show: 'Save and Show',
        },
    },
};

export default messages;
