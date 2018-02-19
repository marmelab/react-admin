---
layout: default
title: "Examples"
---

# Examples

## Adding a Create button linked to a ReferenceManyField

This example demonstrate how you can add a `Create` button visually linked to a `ReferenceManyField` and redirecting to a Create view for the referenced resource with some data already filled.

For example, an `Edit` or `Show` view for a post might have a `ReferenceManyField` for its comments and we could add a button below it to create a comment for the current post.

The relevant code parts are:

* the `CreateCommentButton` component inside `src/posts.js`
* the `CommentCreate` component inside `src/comments.js` (note how we set the `defaultValue` prop on `SimpleForm`)

CodeSandbox: [https://codesandbox.io/s/pp0o4x40p0](https://codesandbox.io/s/pp0o4x40p0)
