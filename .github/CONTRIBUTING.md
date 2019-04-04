# Contributing

So you want to contribute to react-admin? Awesome! Thank you in advance for your contribution. Here are a few guidelines that will help you along the way.

## Asking Questions

For how-to questions and other non-issues, please use [StackOverflow](http://stackoverflow.com/questions/tagged/react-admin) instead of Github issues. There is a StackOverflow tag called "react-admin" that you can use to tag your questions.

## Opening an Issue

If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported or fixed](https://github.com/marmelab/react-admin/issues?q=is%3Aissue+is%3Aclosed). You can search through existing issues and PRs to see if someone has reported one similar to yours.

Next, create a new issue that briefly explains the problem, and provides a bit of background as to the circumstances that triggered it, and steps to reproduce it.

For code issues please include:
* React-admin version
* React version
* Browser version
* A code example or link to a repo, gist or running site. (hint: fork [this sandbox](https://codesandbox.io/s/github/marmelab/react-admin/tree/master/examples/simple) to create a reproducible version of your bug)

For visual or layout problems, images or animated gifs can help explain your issue.
It's even better with a live reproduction test case.

### Issue Guidelines

Please use a succinct description. "doesn't work" doesn't help others find similar issues.

Please don't group multiple topics into one issue, but instead each should be its own issue.

And please don't just '+1' an issue. It spams the maintainers and doesn't help move the issue forward.

## Submitting a Pull Request

React-admin is a community project, so pull requests are always welcome, but before working on a large change, it is best to open an issue first to discuss it with the maintainers. In that case, prefix it with "[RFC]" (Request for Comments)

When in doubt, keep your pull requests small. To give a PR the best chance of getting accepted, don't bundle more than one feature or bug fix per pull request. It's always best to create two smaller PRs than one big one.

The core team prefix their PRs width "[WIP]" (Work in Progress) or "[RFR]" (ready for Review), don't hesitate to do the same to explain how far you are from completion.

When adding new features or modifying existing, please attempt to include tests to confirm the new behaviour.

### Patches or hotfix: PR on `master`

Bug fixes that don't break existing apps can be PRed against `master`. Hotfix versions are released usually within days. 

### New Features or BC breaks: PR on `next`

At any given time, `next` represents the latest development version of the library. It is merged to master and released on a monthly basis.

### Coding style

You must follow the coding style of the existing files. React-admin uses eslint and [prettier](https://github.com/prettier/prettier). You can reformat all the project files automatically by calling

```sh
make prettier
```

**Tip**: If possible, enable linting in your editor to get realtime feedback and/or fixes.

## License

By contributing your code to the marmelab/react-admin GitHub repository, you agree to license your contribution under the MIT license.
