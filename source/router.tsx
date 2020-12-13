import React from "react";
import { Component, ReactNode, createElement, ReactElement } from "react";
import { IRoute } from "./interfaces/routeProps";
import { UrlProcessor } from "./urlProcessor";

interface IProps {
  routes?: readonly IRoute[];
}

interface IState {
  history: Array<IRoute>;
}

export class Router extends Component<IProps, IState> {
  private static instance: Router;

  state: IState = {
    history: [UrlProcessor.Process(this.props.routes ?? [])],
  };

  /** Initialize the singelton */
  public constructor(props: Readonly<IProps>) {
    super(props);
    Router.instance = this;

    window.addEventListener("popstate", this.backPressedListener);
    window.history.pushState(
      {},
      "page: " + this.state.history[this.state.history.length - 1].path
    );
  }

  /** Check if the back button is pressed */
  private backPressedListener() {
    const instance = Router.instance;

    if (instance.state.history.length <= 1) {
      history.back();
    } else {
      Router.closeView();
    }

    window.history.pushState(
      {},
      "page: " + instance.state.history[instance.state.history.length - 1].path
    );
  }

  /**
   * Open a new view
   * @param view
   */
  public static openView(view: JSX.Element): void {
    const instance = Router.instance;

    const newView: IRoute = { path: "/", component: view.type, props: view.props };

    window.scrollTo(0, 0);
    instance.setState({
      history: [...instance.state.history, newView],
    });
  }

  /**
   * Open a new component
   * @param component
   * @param props
   */
  public static openComponent<P = any>(component: React.ComponentType, props?: P) {
    const instance = Router.instance;

    const newView: IRoute = { path: "/", component: component, props: props };

    window.scrollTo(0, 0);
    instance.setState({ history: [...instance.state.history, newView] });
  }

  /**
   * Open a new page with url
   * @param url
   */
  //public static openUrl(url: string) {}

  /** Close the active view */
  public static closeView(): void {
    const instance = Router.instance;

    if (instance.state.history.length > 1) {
      let tempHistory = instance.state.history;
      tempHistory.splice(tempHistory.length - 1, 1);

      window.scrollTo(0, 0);
      instance.setState({
        history: tempHistory,
      });
    } else {
      console.log("Cannot open previous page because it does not exist");
    }
  }

  /**
   * Replace the history of the router
   * @param history
   */
  public static replaceHistory(newHistory: IRoute[]): void {
    window.scrollTo(0, 0);
    Router.instance.setState({ history: newHistory });
  }

  /** Get props from current view */
  public static getProps(): any {
    return Router.instance.state.history[Router.instance.state.history.length - 1].props;
  }

  /** Fill in all pages that can be rendered */
  public render(): ReactNode {
    return createElement(
      this.state.history[this.state.history.length - 1].component,
      { ...this.state.history[this.state.history.length - 1].props } as any,
      null
    );
  }
}
