---
layout: default
title: "React-admin demos"
---

# React-admin Demos

If you want to see what react-admin is capable of, or if you want to learn from apps built by seasoned react-admin developers, check out these demos.

<style>
    .demos-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 10px;
    }

    @media (max-width: 600px) {
        .demos-list {
            grid-template-columns: repeat(1, 1fr);
        }
        .iframe-wrapper {
            max-width: 100%;
        }
    }

    .card {
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        background-color: rgba(243, 246, 249, 0.4);
        border: 1px solid rgba(0,0,0,0.25);
        border-radius: 10px;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .card:hover {
        box-shadow: 0 3px 6px 0 rgba(0,0,0,0.2);
    }

    .card > img, .card > video {
        border-radius: 5px;
        max-width: 100%;
    }

    .mardown-section > video, .markdown-section, img {
        max-width: 100%;
    }

    .content-card {
        padding: 2px;
        margin-left: 1rem;
        margin-right: 1rem;
        text-decoration: none !important;
    }

    .title-card {
        margin-bottom: 0.4rem !important;
        font-size: 1.75em;
        color: black;
    }

    .description-card {
        color: rgb(100,100,100);
    }

    .card-footer {
        flex-grow: 1;
        display: flex;
        flex-direction: column-reverse;
    }

    .links-container {
        padding: 2px;
        margin-left: calc(1rem - 10px);
        margin-right: calc(1rem - 10px);
        display: flex;
        justify-content: space-between;
    }

    .link {
        color: rgb(0, 127, 255) !important;
        padding: 10px;
        border-radius: 5px
    }

    .link:hover {
        background-color: rgba(0, 127, 255, 0.07) !important;
    }

    .no-decoration, .link {
        text-decoration: none !important;
    }

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

<div class="demos-list">
    <div class="card">
        <a href="#e-commerce" class="no-decoration"><img src="./img/demo-ecommerce-oss.png" alt="ecommerce-oss"></a>
        <div class="content-card">
            <a href="#e-commerce" class="no-decoration">
                <p class="title-card"><b>E-commerce</b></p>
                <p  class="description-card">The admin of a fictional poster shop, allowing to manage sales, products, customers and reviews. Built by the core team.</p>
            </a>
        </div>
        <div class="card-footer">
            <div class="links-container">
                <p><b><a href="https://marmelab.com/react-admin-demo/" class="demo link">Demo</a></b></p>
                <p><b><a href="https://github.com/marmelab/react-admin/tree/master/examples/demo" class="source-code link">Source code</a></b></p>
            </div>
        </div>
    </div>
    <div class="card">
        <a href="#crm" class="no-decoration"><img src="./img/demo-CRM.png" alt="CRM"></a>
        <div class="content-card">
            <a href="#crm" class="no-decoration">
                <p class="title-card"><b>CRM</b></p>
                <p  class="description-card">A complete CRM app allowing to manage contacts, companies, deals, notes, tasks, and tags. Uses Supabase as backend. Built by the core team.</p>
            </a>
        </div>
        <div class="card-footer">
            <div class="links-container">
                <p><b><a href="https://marmelab.com/react-admin-crm/" class="demo link">Demo</a></b></p>
                <p><b><a href="https://github.com/marmelab/atomic-crm" class="source-code link">Source code</a></b></p>
            </div>
        </div>
    </div>
    <div class="card">
        <a href="#help-desk" class="no-decoration"><img src="./img/demo-help-desk.png" alt="help-desk"></a>
        <div class="content-card">
            <a href="#help-desk" class="no-decoration">
                <p class="title-card"><b>Help Desk</b></p>
                <p  class="description-card">A ticketing app with realtime collaboration and site-wide search. Built by the core team.</p>
            </a>
        </div>
        <div class="card-footer">
            <div class="links-container">
                <p><b><a href="https://marmelab.com/react-admin-helpdesk/" class="demo link">Demo</a></b></p>
                <p><b><a href="https://github.com/marmelab/react-admin-helpdesk" class="source-code link">Source code</a></b></p>
            </div>
        </div>
    </div>
    <div class="card">
        <a href="#note-taking-app" class="no-decoration"><img src="./img/writers-delight.png" alt="Music Player"></a>
        <div class="content-card">
            <a href="#note-taking-app" class="no-decoration">
                <p class="title-card"><b>Note-taking app</b></p>
                <p  class="description-card">Writer's Delight lets you write notes, essays, and stories with an AI assistant. Built by the core team.</p>
            </a>
        </div>
        <div class="card-footer">
            <div class="links-container">
                <p><b><a href="https://marmelab.com/writers-delight/" class="demo link">Demo</a></b></p>
                <p><b><a href="https://github.com/marmelab/writers-delight/" class="source-code link">Source code</a></b></p>
            </div>
        </div>
    </div>
    <div class="card">
        <a href="#blog-admin" class="no-decoration"><img src="./img/blog_demo.png" alt="Blog"></a>
        <div class="content-card">
            <a href="#blog-admin" class="no-decoration">
                <p class="title-card"><b>Blog admin</b></p>
                <p  class="description-card">A simple application with posts, comments and users that we use for our e2e tests. Designed to use most of the react-admin features. Built by the core team.</p>
            </a>
        </div>
        <div class="card-footer">
            <div class="links-container">
                <p><b><a href="https://stackblitz.com/github/marmelab/react-admin/tree/master/examples/simple" class="demo link">Demo</a></b></p>
                <p><b><a href="https://github.com/marmelab/react-admin/tree/master/examples/simple" class="source-code link">Source code</a></b></p>
            </div>
        </div>
    </div>
    <div class="card">
        <a href="#music-player" class="no-decoration"><img src="./img/navidrome.png" alt="Music Player"></a>
        <div class="content-card">
            <a href="#music-player" class="no-decoration">
                <p class="title-card"><b>Music Player</b></p>
                <p  class="description-card">Navidrome is a Spotify clone allowing to manage songs, artists, playlists, and favorites.</p>
            </a>
        </div>
        <div class="card-footer">
            <div class="links-container">
                <p><b><a href="https://demo.navidrome.org/app/" class="demo link">Demo</a></b></p>
                <p><b><a href="https://github.com/navidrome/navidrome/" class="source-code link">Source code</a></b></p>
            </div>
        </div>
    </div>
</div>

## E-commerce

The admin of a fictional poster shop, allowing to manage sales, products, customers and reviews. Built by the core team.

<div style="padding:56.25% 0 0 0;position:relative;">
<iframe src="https://www.youtube-nocookie.com/embed/bJEo1O1oT6o" title="react admin e commerce demo" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
<br>

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

A modified version of this demo uses the React Admin Enterprise features.

<div style="padding:56.93% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/884005183?h=7f12a85dcf&title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
<br>

* Demo: [https://marmelab.com/ra-enterprise-demo/](https://marmelab.com/ra-enterprise-demo/)
* Source code: [https://github.com/marmelab/ra-enterprise-demo](https://github.com/marmelab/ra-enterprise-demo)

The source shows example implementation of the following features:

- [Solar Layout](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/layout/Layout.tsx)
- [Breadcrumb](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/layout/Breadcrumb.tsx)
- [Editable Datagrid](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/stores/StoreList.tsx)
- [Accordion Form](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/products/ProductEdit.tsx)
- [Locks](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/products/GridList.tsx)
- [Live List](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/orders/OrderList.tsx)
- [Realtime Data Provider](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/dataProvider/addRealtimeMethodsWithFakeTransport.ts)
- [Calendar](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/visits/VisitList.tsx)
- [Audit Log](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/i18n/en.ts)
- [Search Sub Menu](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/layout/SearchSubMenu.tsx)
- [Category List with Hierarchical Structure](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/categories/CategoryList.tsx)
- [Markdown Input](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/products/ProductCreate.tsx)
- [Markdown Field](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/products/ProductPreview.tsx)
- [Guided Tours](https://github.com/marmelab/ra-enterprise-demo/blob/master/src/tours/TourList.tsx)

## CRM

Atomic CRM is a complete CRM app allowing to manage contacts, companies, deals, notes, tasks, and tags. Built by the core team. You can use it as a template to build your own CRM.

<video src="https://user-images.githubusercontent.com/99944/116970434-4a926480-acb8-11eb-8ce2-0602c680e45e.mp4" controls="controls"></video>

* Demo: [https://marmelab.com/react-admin-crm/](https://marmelab.com/react-admin-crm/)
* Source code: [https://github.com/marmelab/atomic-crm](https://github.com/marmelab/atomic-crm)

The source shows how to implement the following features:

- [Horizontal navigation](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/layout/Layout.tsx)
- [Custom exporter](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/contacts/ContactList.tsx)
- [Trello-like Kanban board for the deals pipeline](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/deals/DealListContent.tsx)
- [Custom d3.js / Nivo Chart in the dashboard](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/dashboard/DealsChart.tsx)
- [Add or remove tags to a contact](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/contacts/TagsListEdit.tsx)
- [Use dataProvider hooks to update notes](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/notes/Note.tsx)
- [Custom grid layout for companies](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/companies/GridList.tsx)
- [Filter by "my favorites" in the company list](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/deals/OnlyMineInput.tsx)

## Help Desk

A simple help desk app allowing to manage issues, users, and tags. ZenDesk / Linear clone, built by the core team.

<video src="https://user-images.githubusercontent.com/99944/212743583-a4ee135f-f55b-4305-86c4-a3da1c49bb98.mov" controls="controls"></video>

* Demo: [https://marmelab.com/react-admin-helpdesk/](https://marmelab.com/react-admin-helpdesk/)
* Source code: [https://github.com/marmelab/react-admin-helpdesk](https://github.com/marmelab/react-admin-helpdesk)

The source shows how to implement the following features:

* [Real-time notifications](https://github.com/marmelab/react-admin-helpdesk/blob/main/src/ConnectionWatcher.tsx)
* [Real-time reads and locks](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/tickets/ActivityField.tsx)
* [Site search](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/App.tsx#L22)
* [Reference counting](https://github.com/marmelab/react-admin-helpdesk/blob/main/src/products/ProductList.tsx)
* [Show Aside](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/customers/CustomerShowAside.tsx#L10-L20)
* [Lifecycle callbacks](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/dataProvider/dataProvider.tsx#L32-L71)
* [Tabs with count](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/products/ProductShow.tsx#L30)
* [Custom list layout with side filters](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/tickets/TicketList.tsx)
* [Custom List layout for messages](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/tickets/MessageList.tsx)
* [Custom creation form](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/tickets/NewMessageForm.tsx)
* [Latest Reference Field](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/tickets/SubjectField.tsx#L14-L21)
* [Mark as read on visit](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/tickets/TicketShow.tsx#L18)
* [List with live updates](https://github.com/marmelab/react-admin-helpdesk/blob/6208ab49597544f0e8d7e238c5c676f73f30c114/src/tickets/useGetTicketReadsForRecord.ts)

## Note-taking App

Writer's Delight lets you write notes, essays, and stories with an AI assistant. Built by the core team.

<iframe src="https://www.youtube-nocookie.com/embed/XytdFN1Oqg8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

* Demo: [https://marmelab.com/writers-delight/](https://marmelab.com/writers-delight/)
* Source code: [https://github.com/marmelab/writers-delight/](https://github.com/marmelab/writers-delight/)

The source shows how to implement the following features:

* [Predictive Text Input](https://github.com/marmelab/writers-delight/blob/main/src/compositions/CompositionEdit.tsx#L34)
* [AutoSave](https://github.com/marmelab/writers-delight/blob/main/src/compositions/CompositionEdit.tsx#L30)
* [Infinite List](https://github.com/marmelab/writers-delight/blob/main/src/compositions/CompositionList.tsx#L56)
* [Edit with List sidebar](https://github.com/marmelab/writers-delight/blob/main/src/compositions/CompositionList.tsx#L43)
* [Offline-first data provider](https://github.com/marmelab/writers-delight/blob/main/src/dataProvider.ts#L26)
* [Custom Layout](https://github.com/marmelab/writers-delight/blob/main/src/Layout.tsx)
* [Custom theme](https://github.com/marmelab/writers-delight/blob/main/src/App.tsx#L8-L12)
* [Splash Screen](https://github.com/marmelab/writers-delight/blob/main/src/SplashScreen.tsx)
* [Headless Delete](https://github.com/marmelab/writers-delight/blob/main/src/compositions/MoreActionsButton.tsx#L24)
* [useCreate](https://github.com/marmelab/writers-delight/blob/main/src/compositions/CreateCompositionButton.tsx#L6)
* [useStore](https://github.com/marmelab/writers-delight/blob/main/src/compositions/AISwitch.tsx#L23)

## Blog Admin

A simple application with posts, comments and users that we use for our e2e tests. Not designed to have a good UX, but to use most of the react-admin features. Built by the core team.

![Blog demo](./img/blog_demo.png)

* Demo: available on [Stackblitz](https://stackblitz.com/github/marmelab/react-admin/tree/master/examples/simple) or on [Codesandbox](https://codesandbox.io/p/devbox/github/marmelab/react-admin/tree/master/examples/simple)
* Source code: [https://github.com/marmelab/react-admin/tree/master/examples/simple](https://github.com/marmelab/react-admin/tree/master/examples/simple)

## Music Player

Navidrome is a Spotify clone allowing to manage songs, artists, playlists, and favorites.

![Navidrome](./img/navidrome.png)

* Demo: [https://demo.navidrome.org/app/](https://demo.navidrome.org/app/)
* Source code: [https://github.com/navidrome/navidrome/](https://github.com/navidrome/navidrome/)

## Broadcom Layer 7 API Hub

A framework built on top of react-admin for building developer portals.

<div class="iframe-wrapper"><iframe src="https://www.youtube.com/embed/ecHsgNmug9E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

* Source code: [https://github.com/CAAPIM/APIHub](https://github.com/CAAPIM/APIHub)

## Other Apps

Check out [Issue #4027](https://github.com/marmelab/react-admin/issues/4027) on the react-admin GitHub for a list of apps built by other people.

## Your App Here / showcase

Did you publish an app built with react-admin with open-source code? Open a PR on this page to add it to this list.

<script src="https://player.vimeo.com/api/player.js"></script>