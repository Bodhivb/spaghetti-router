import { Component, ReactNode } from "react";

interface IProps {
  startView: JSX.Element;
}

interface IState {
  history: Array<JSX.Element>;
}

export class Router extends Component<IProps, IState> {
  private static instance: Router;

  state: IState = {
    history: [this.props.startView],
  };

  /** Initialize the singelton */
  public constructor(props: Readonly<IProps>) {
    super(props);

    Router.instance = this;

    window.addEventListener("popstate", this.backPressedListener);
    window.history.pushState(
      {},
      "page: " + this.state.history[this.state.history.length - 1].type
    );
  }

  /**
   * Check if the back button is pressed */
  private backPressedListener() {
    const instance = Router.instance;

    if (instance.state.history.length > 1) {
      Router.closeView();
    } else {
      console.log("app could close here");
      history.back();
    }

    window.history.pushState(
      {},
      "page: " + instance.state.history[instance.state.history.length - 1]
    );
  }

  /**
   * Open a new view
   * @param view
   */
  public static openView(view: JSX.Element, force: boolean = false): void {
    const instance = Router.instance;

    if (Router.instance.checkView(view) && force === false) {
      return;
    }

    instance.setState({
      history: [...instance.state.history, view],
    });
  }

  /**
   * Close the active view
   */
  public static closeView(): void {
    const instance = Router.instance;

    if (instance.state.history.length > 1) {
      let tempHistory = instance.state.history;
      tempHistory.splice(tempHistory.length - 1, 1);

      instance.setState({
        history: tempHistory,
      });
    } else {
      console.log("Cannot open previous page because it does not exist");
    }
  }

  /**
   * Back to old view with new props
   */
  public static openLastView(view: JSX.Element): void {
    const instance = Router.instance;
    const i = instance.state.history.findIndex((h) => h.type === view.type);

    if (i < 0) {
      this.openView(view);
    } else {
      let tempHistory = instance.state.history;
      tempHistory.splice(i, tempHistory.length - i);

      instance.setState({
        history: [...tempHistory, view],
      });
    }
  }

  /**
   * Get props from current view
   */
  public static getProps(): any {
    return Router.instance.state.history[Router.instance.state.history.length - 1].props;
  }

  /**
   * Replace the history of the router
   * @param history
   */
  public static replaceHistory(newHistory: Array<JSX.Element>): void {
    if (Router.instance.checkView(newHistory[newHistory.length - 1])) {
      return;
    }

    const instance = Router.instance;
    instance.state.history.map((element, i, array) => {
      if (newHistory[i] === undefined) return;

      if (element.type === newHistory[i].type) {
        newHistory[i] = array[i];
      }
    });

    Router.instance.setState({ history: newHistory });
  }

  private checkView(view: JSX.Element): boolean {
    const activeView: JSX.Element =
      Router.instance.state.history[Router.instance.state.history.length - 1];

    return (
      view.type === activeView.type &&
      JSON.stringify(view.props) === JSON.stringify(activeView.props)
    );
  }

  /**
   * Fill in all pages that can be rendered */
  public render(): ReactNode {
    return this.state.history[this.state.history.length - 1];
  }
}
