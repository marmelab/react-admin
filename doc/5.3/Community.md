---
layout: default
title: "Community"
---

<style>
    .iframe-wrapper {
        float: none;
        clear: both;
        max-width: 92.25%;
        position: relative;
        padding-bottom: 56.25%;
        padding-top: 25px;
        height: 0;
    }

    .iframe-wrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

# Community

Thousands of new react-admin applications are created every month. [Many developers](https://github.com/marmelab/react-admin/network/dependents) use react-admin on a day-to-day basis. We're excited that you're a part of this large and friendly community.

We're doing our best to keep it a convivial place where people want to hang out and help/be helped.

## Newsletter

{% include newsletter.html %}

## Discord

The [React-admin Discord Server](https://discord.gg/GeZF9sqh3N) is a great place to have conversations, answer and ask questions, all about react-admin.

<iframe src="https://discord.com/widget?id=830711057643208724&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>

## Youtube

On our [Youtube channel](https://www.youtube.com/@react-admin), you can find some beginner, intermediate and advanced tutorials.

<div class="iframe-wrapper">
    <iframe
        src="https://www.youtube.com/embed?listType=playlist&list=UUx-g3k3eDFyy-3E7vxWVN-Q">
    </iframe>
</div>

## Support

If you're stuck with a problem in your react-admin code, you can get help from various channels:

### Paid Support

Get **support by the core team** in less than 24h on weekdays by subscribing to the [Enterprise Edition](https://react-admin-ee.marmelab.com) of react-admin. There are more than 200 pages of documentation, this team knows them all. And they also know the codebase, so they can help you with tricky problems.

This subscription also gives you access to the [Private modules](https://react-admin-ee.marmelab.com/#private-modules)<img class="premium" src="./img/premium.svg" style="width: 15px;margin: 0 0px;box-shadow: none;vertical-align:middle"/>, and helps us keep react-admin free and open-source. Plus it's cheap, so don't stay stuck on a problem for too long!

### StackOverflow

The [#react-admin](https://stackoverflow.com/questions/tagged/react-admin) tag counts a large number of questions and answers by the community, so it's a good place to search for answers.

### Discord Server

See the [Discord](#discord) section above.

### Dependencies

If your problem is related to a library used by react-admin, you should ask for help on the dependency's support channel:

* Material UI: [Documentation](https://mui.com/material-ui/getting-started/), [Support](https://mui.com/material-ui/getting-started/support/)
* react-router: [Documentation](https://reactrouter.com/en/main), [Discord](https://rmx.as/discord)
* react-query: [Documentation](https://tanstack.com/query/v5/docs/react/overview), [Discord](https://tlinz.com/discord)
* react-hook-form: [Documentation](https://react-hook-form.com/get-started), [Discord](https://discord.gg/yYv7GZ8)
* emotion: [Documentation](https://emotion.sh/docs/introduction), [Slack](https://join.slack.com/t/emotion-slack/shared_invite/zt-rmtwsy74-2uvyFdz5uxa8OiMguJJeuQ), [Community](https://emotion.sh/docs/community)

## Articles

The Marmelab blog has more than 70 articles about react-admin:

* [https://marmelab.com/en/blog/#react-admin](https://marmelab.com/en/blog/#react-admin)

You'll find tutorials, tips and tricks, version highlights, real-world use cases, and more. Come back often, we publish new articles every week!

## Learn With Examples

Check out [the Demos page](./Demos.md) for a list of open-source react-admin applications with real-world features.

## Reporting a Bug

If you think you've found a bug, please [open an issue on the GitHub repository](https://github.com/marmelab/react-admin/issues).

Make sure you follow the issue template and provide a way to reproduce the bug. The more information you provide, the easier it is for us to fix it.

Please note that we don't provide support via GitHub issues - use them only for bug reports.

## Contributing

If you want to give a hand: Thank you! There are many things you can do to help make react-admin better.

The easiest task is **bug triaging**. Check that new issues on GitHub follow the issue template and give a way to reproduce the issue. If not, comment on the issue to ask for precisions. Then, try and reproduce the issue following the description. If you managed to reproduce the issue, add a comment to say it. Otherwise, add a comment to say that something is missing.

The second way to contribute is to **answer support questions on [StackOverflow](https://stackoverflow.com/questions/tagged/react-admin) and [Discord](https://discord.com/channels/830711057643208724/1022443113391853578)**. There are many beginner questions there, so even if you're not super experienced with react-admin, your contribution will be appreciated.

Pull requests for **bug fixes** are welcome on the [GitHub repository](https://github.com/marmelab/react-admin). There is always a bunch of [issues labeled "Good First Issue"](https://github.com/marmelab/react-admin/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) in the bug tracker - start with these.

If you want to **add a feature**, you can open a Pull request on the `next` branch. We don't accept all features - we try to keep the react-admin code small and manageable. Try and see if your feature can't be built as an additional `npm` package. If you're in doubt, open a "Feature Request" issue to see if the core team would accept your feature before developing it.

For all Pull requests, you must follow the coding style of the existing files (based on [prettier](https://github.com/prettier/prettier)), and include unit tests and documentation. Be prepared for a thorough code review, and be patient for the merge - this is an open-source initiative.

**Tip**: Most of the commands used by the react-admin developers are automated in the `makefile`. Feel free to type `make` without argument to see a list of the available commands.
