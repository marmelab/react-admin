/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );


    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    return (
      <div className="wrapper">
        <HomeSplash siteConfig={siteConfig} language={language} />
        <iframe src="https://player.vimeo.com/video/268958716?byline=0&portrait=0" width="800" height="450" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen style={{ display: 'block', margin: '0 auto' }}></iframe>
        <h2 style={{ fontSize: '2rem' }}>Features</h2>
        <ul style={{marginBottom: '2rem'}}>
          <li>Adapts to any backend (REST, GraphQL, SOAP, etc.)</li>
          <li>Complete documentation</li>
          <li>Super-fast UI thanks to optimistic rendering (renders before the server returns)</li>
          <li>Undo updates and deletes for a few seconds</li>
          <li>Supports relationships (many to one, one to many)</li>
          <li>Internationalization (i18n)</li>
          <li>Conditional formatting</li>
          <li>Themeable</li>
          <li>Supports any authentication provider (REST API, OAuth, Basic Auth, ...)</li>
          <li>Full-featured Datagrid (sort, pagination, filters)</li>
          <li>Filter-as-you-type</li>
          <li>Supports any form layout (simple, tabbed, etc.)</li>
          <li>Data Validation</li>
          <li>Custom actions</li>
          <li>Large library of components for various data types: boolean, number, rich text, etc.</li>
          <li>WYSIWYG editor</li>
          <li>Customize dashboard, menu, layout</li>
          <li>Super easy to extend and override (it's just React components)</li>
          <li>Highly customizable interface</li>
          <li>Can connect to multiple backends</li>
          <li>Leverages the best libraries in the React ecosystem (Redux, redux-form, redux-saga, material-ui, recompose)</li>
          <li>Can be included in another React app</li>
          <li>Inspired by the popular <a href="https://github.com/marmelab/ng-admin">ng-admin</a> library (also by marmelab)</li>
        </ul>
      </div>
    );
  }
}

module.exports = Index;
