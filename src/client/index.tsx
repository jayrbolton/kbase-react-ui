import React, { Component } from 'react';
import { render } from 'react-dom';

// Imports for page-specific components
// path: /dashboard
import { Dashboard } from './components/dashboard/index';
// path: /object_relations
import { ObjectRelations } from './components/object_relations/index';
import './components/dashboard_antd';

import { Header } from './components/header/Header';

import { Header } from '../client/components/Header/Header';

// Utils
import { getUsername } from './utils/auth';

// Constants
const PATHNAME = document.location.pathname
  .replace(new RegExp('^' + window._env.url_prefix), '') // Remove global url prefix
  .replace(/\/$/, ''); // Remove trailing slash
const CONTAINER = document.getElementById('react-root');

// change background of the current item in the top-nav. Plain JS. Uses tachyons classes.
document.querySelectorAll('[data-hl-nav]').forEach(node => {
  let HTMLEle: HTMLElement = node as HTMLElement;
  HTMLEle.style;
  if (PATHNAME === node.getAttribute('data-hl-nav')) {
    // to add style, it has to be HTMLElement and not node or Element
    HTMLEle.style.backgroundColor = '#e4e3e4';
  }
});

// Set the signed-in username in the global env
getUsername().then((username: string | null) => {
  if (username) {
    window._env.username = username;
  }
});

interface Props {
  root: typeof Dashboard | typeof ObjectRelations;
}

interface State {}
// Global page wrapper
class Page extends Component<Props, State> {
  render() {
    return <this.props.root />;
  }
}

// Header
if (document.getElementById('header')) {
  const headerEle = document.getElementById('header');
  let pageTitle: string;
  headerEle.getAttribute('pageTitle')
    ? (pageTitle = headerEle.getAttribute('pageTitle'))
    : '';
  if (document.getElementById('react-header')) {
    render(
      <Header headerTitle={pageTitle} />,
      document.getElementById('react-header')
    );
  }
}

// Render the page component based on pathname
if (CONTAINER) {
  // Simple routing by looking at pathname
  const routes: {
    [key: string]: { [key: string]: typeof Dashboard | typeof ObjectRelations };
  } = {
    '/dashboard': { component: Dashboard },
    '/iframe/dashboard': { component: Dashboard },
    '/iframe/object_relations': { component: ObjectRelations },
  };

  if (PATHNAME in routes) {
    const topComponent = routes[PATHNAME].component;
    render(<Page root={topComponent} />, CONTAINER);
  } else {
    console.error(
      `Unable to find a React component for this page. Path: ${PATHNAME}. Routes: ${Object.keys(
        routes
      )}`
    ); // eslint-disable-line
  }
}

// Render the Header component
let pageTitle = '';
const pageTitleElm = document.getElementById('header');
if (pageTitleElm) {
  pageTitle = pageTitleElm.getAttribute('pageTitle') || '';
}
const headerElm = document.getElementById('react-header');
if (headerElm) {
  render(
    <Header headerTitle={pageTitle} />,
    document.getElementById('react-header')
  );
}
