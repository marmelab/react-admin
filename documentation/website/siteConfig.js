/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.


const siteConfig = {
  title: 'React-Admin', // Title for your website.
  tagline: 'A frontend Framework for building admin applications running in the browser on top of REST/GraphQL APIs, using ES6, React and Material Design.',
  url: 'https://marmelab.github.io',
  baseUrl: '/react-admin/',

  // Used for publishing and more
  projectName: 'react-admin',
  organizationName: 'marmelab',

  algolia: {
    apiKey: process.env.ALGOLIA_REACT_ADMIN_API_KEY,
    indexName: 'react-admin',
    algoliaOptions: {
      facetFilters: [ "version:next" ]
    }
  },

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'readme', label: 'Documentation'},
    {href: 'https://marmelab.com/fr/blog#react-admin', label: 'Blog'},
    {href: 'https://github.com/marmelab/react-admin', label: 'Github'},
    { search: true }
  ],


  /* path to images for header/footer */
  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#20232a',
    secondaryColor: '#20232a',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Marmelab`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  docsSideNavCollapsible: false,
  // No .html extensions for paths.
  cleanUrl: true,
  scrollToTop: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/logo.png',
  twitterImage: 'img/logo.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/marmelab/react-admin',
};

module.exports = siteConfig;
