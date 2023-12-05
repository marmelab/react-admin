import raMessages from 'ra-language-english';

export default {
    ...raMessages,
    resources: {
        posts: {
            name_one: 'Post',
            name_other: 'Posts',
            fields: {
                id: 'Id',
                title: 'Title',
            },
        },
        comments: {
            name_one: 'Comment',
            name_other: 'Comments',
            fields: {
                id: 'Id',
                body: 'Message',
            },
        },
    },
};
