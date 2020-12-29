import React from "react";
import { Component, ReactNode, createElement, ReactElement } from "react";
import { IRoute } from "./interfaces/routeProps";
import { UrlProcessor } from "./urlProcessor";

interface IProps {
  routes?: readonly IRoute[];
}

interface IState {
  history: Array<IRoute>;
  currentIndex: number;
}

export class Router extends Component<IProps, IState> {
  private static instance: Router;

  state: IState = {
    history: [UrlProcessor.Process(this.props.routes ?? [])],
    currentIndex: 0,
  };

  /** Initialize the singelton */
  public constructor(props: Readonly<IProps>) {
    super(props);
    Router.instance = this;

    window.addEventListener("popstate", this.historyChangeListener);
    window.history.replaceState({ page: 0 }, "Homepage");
  }

  /** Check if the back or forward button is pressed */
  private historyChangeListener(event: PopStateEvent) {
    if (event.state) {
      //You can forward if you go out and back in website, then the website has no history list while the browser has it.
      //So we check if the website forward page exits.
      if (Router.instance.state.history.length > event.state.page) {
        Router.instance.setState({ currentIndex: event.state.page });
      } else {
        //TODO Look for better code instead of history.back
        history.back();
      }
    }
  }

  /** Push new route to router display */
  private static push(route: IRoute) {
    const instance = Router.instance;
    const { history, currentIndex } = instance.state;

    //Check if you can forward history
    if (history.length - 1 > currentIndex) {
      //Delete forward history
      history.splice(currentIndex + 1);
    }

    window.scrollTo(0, 0);
    history.push(route);
    instance.setState({ history, currentIndex: history.length - 1 });
    window.history.pushState({ page: history.length - 1 }, "", route.path);
  }

  /**
   * Open a new view
   * @param view
   */
  public static openView(view: JSX.Element): void {
    const newView: IRoute = { path: "/", component: view.type, props: view.props };
    this.push(newView);
  }

  /**
   * Open a new component
   * @param component
   * @param props
   */
  public static openComponent<P = any>(component: React.ComponentType, props?: P) {
    const newView: IRoute = { path: "/", component: component, props: props };
    this.push(newView);
  }

  /**
   * Open a new page with url
   * @param url
   */
  //public static openUrl(url: string) {}

  /** Close the active view */
  public static closeView(): void {
    history.back();
    //window.scrollTo(0, 0);
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
    const { history, currentIndex } = this.state;

    return createElement(
      history[currentIndex].component,
      { ...history[currentIndex].props } as any,
      null
    );
  }
}
