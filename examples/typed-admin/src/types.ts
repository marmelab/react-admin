/**
 * @Resource
 */
export type Post = {
    id: number;
    title: string;
    content: string;
};

/**
 * @Resource
 */
export type Comment = {
    id: number;
    postId: number;
    content: string;
};
