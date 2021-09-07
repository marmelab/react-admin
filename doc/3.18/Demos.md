---
layout: default
title: "React-admin demos"
---

# React-admin Demos

If you want to see what react-admin is capable of, or if you want to learn from apps built by seasoned react-admin developers, check out these demos.

## E-commerce

The admin of a fictional poster shop, allowing to manage sales, products, customers and reviews. Built by the core team.

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://vimeo.com/474999017)

* Demo: [https://marmelab.com/react-admin-demo/](https://marmelab.com/react-admin-demo/)
* Source code: [https://github.com/marmelab/react-admin/tree/master/examples/demo](https://github.com/marmelab/react-admin/tree/master/examples/demo)

The source shows how to implement the following features:

- [Custom theme with white AppBar](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/layout/themes.ts)
- [d3.js chart with Recharts](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/dashboard/OrderChart.tsx)
- [List widget embedded in another page](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/dashboard/NewCustomers.tsx)
- [Tabbed Datagrid](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/orders/OrderList.tsx)
- [Row expand with a custom show view](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/invoices/InvoiceList.tsx)
- [Grid list showing a list of images](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/products/GridList.tsx)
- [Filter sidebar](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/products/Aside.tsx)
- [Custom form layout](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/visitors/VisitorEdit.tsx)
- [Custom page with static list](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/routes.tsx)
- [Edit view in a sidebar](https://github.com/marmelab/react-admin/blob/master/examples/demo/src/reviews/ReviewList.tsx)

## CRM

A complete CRM app allowing to manage contacts, companies, deals, notes, tasks, and tags. Built by the core team.

<video src="https://user-images.githubusercontent.com/99944/116970434-4a926480-acb8-11eb-8ce2-0602c680e45e.mp4" controls="controls" style="max-width: 100%"></video>

* Demo: [https://marmelab.com/react-admin-crm/](https://marmelab.com/react-admin-crm/)
* Source code: [https://github.com/marmelab/react-admin/tree/master/examples/crm](https://github.com/marmelab/react-admin/tree/master/examples/crm)

The source shows how to implement the following features:

- [Horizontal navigation](https://github.com/marmelab/react-admin/blob/7c60db09aea34a90607a4e7560e9e4b51bd7b9a3/examples/crm/src/Layout.tsx)
- [Custom d3.js / Nivo Chart in the dashboard](https://github.com/marmelab/react-admin/blob/7c60db09aea34a90607a4e7560e9e4b51bd7b9a3/examples/crm/src/dashboard/DealsChart.tsx)
- [Add or remove tags to a contact](https://github.com/marmelab/react-admin/blob/7c60db09aea34a90607a4e7560e9e4b51bd7b9a3/examples/crm/src/contacts/TagsListEdit.tsx)
- [Use dataProvider hooks to update notes](https://github.com/marmelab/react-admin/blob/7c60db09aea34a90607a4e7560e9e4b51bd7b9a3/examples/crm/src/notes/Note.tsx)
- [Custom grid layout for companies](https://github.com/marmelab/react-admin/blob/7c60db09aea34a90607a4e7560e9e4b51bd7b9a3/examples/crm/src/companies/GridList.tsx)
- [Filter by "my favorites" in the company list](https://github.com/marmelab/react-admin/blob/7c60db09aea34a90607a4e7560e9e4b51bd7b9a3/examples/crm/src/deals/OnlyMineInput.tsx)
- [Trello-like board for the deals pipeline](https://github.com/marmelab/react-admin/blob/7c60db09aea34a90607a4e7560e9e4b51bd7b9a3/examples/crm/src/deals/DealListContent.tsx)


## Blog

A simple application with posts, comments and users that we use for our e2e tests. Not designed to have a good UX, but to use most of the react-admin features. Built by the core team.

![Blog demo](./img/blog_demo.png)

* Demo: [https://iuxnw.sse.codesandbox.io/](https://iuxnw.sse.codesandbox.io/)
* Source code: [https://codesandbox.io/s/github/marmelab/react-admin/tree/master/examples/simple](https://codesandbox.io/s/github/marmelab/react-admin/tree/master/examples/simple)

## Other Apps

Check out [Issue #4027](https://github.com/marmelab/react-admin/issues/4027) on the react-admin GitHub for a list of apps built by other people.

### Navidrome

A Spotify clone, allowing to manage songs, artists, playlists, and favorites.

![Navidrome](./img/navidrome.png)

* Demo: [https://demo.navidrome.org/app/](https://demo.navidrome.org/app/)
* Source code: [https://github.com/navidrome/navidrome/](https://github.com/navidrome/navidrome/)

### Broadcom Layer 7 API Hub

A framework built on top of react-admin for building developer portals.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ecHsgNmug9E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* Source code: [https://github.com/CAAPIM/APIHub](https://github.com/CAAPIM/APIHub)

### Your App Here / showcase

Did you publish an app built with react-admin with open-source code? Open a PR on this page to add it to this list.
