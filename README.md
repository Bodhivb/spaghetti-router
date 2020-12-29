# spaghetti-router

A simple user-friendly router library for your [React](https://reactjs.org/) application. It is written in [TypeScript](https://www.typescriptlang.org/), but you can also use it in JavaScript projects.

## Installation

Install using [npm](https://www.npmjs.com/):

    npm install spaghetti-router

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```jsx
// TypeScript
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "spaghetti-router";

ReactDOM.render(<Router />, document.getElementById("root"));

// JavaScript
const React = require("react");
const SpaghettiRouter = require("spaghetti-router");

React.render(<SpaghettiRouter.Router />, document.getElementById("root"));
```

## Usage

The basic working router looks like this:

```jsx
// TypeScript
import React from "react";
import ReactDOM from "react-dom";
import { Router, IRoute } from "spaghetti-router";

const routePaths: Array<IRoute> = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/about",
    component: AboutView,
  },
  {
    path: "/user/:id", //work in progress
    component: UserView,
  },
];

class HomeView extends React.Component {
  render(): ReactNode {
    return <button onClick={() => Router.openView(<AboutView />)}>About</button>;
  }
}

ReactDOM.render(<Router routes={routePaths} />, document.getElementById("root"));
```

## Navigation

| Method                   | Description                                |
| ------------------------ | ------------------------------------------ |
| `Router.closeView()`     | Close the active view                      |
| `Router.openComponent()` | Open a new React component                 |
| `Router.openUrl()`       | Open a new component with url              |
| `Router.openView()`      | Open a new JSX Element (type safety props) |
