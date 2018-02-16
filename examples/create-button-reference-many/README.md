# create-button-reference-many

This example shows how to add a create button related to a resource and which can specify default values for the new referenced resource which will be created.

The relevant code parts are:
- the `CreateCommentButton` component inside `src/posts.js`
- the `CommentCreate` component inside `src/comments.js` (note how we set the `defaultValue` prop on `SimpleForm`)

## How to run

After having cloned the react-admin repository, run the following commands:

```sh
make install

make run-create-button-reference-many
```
