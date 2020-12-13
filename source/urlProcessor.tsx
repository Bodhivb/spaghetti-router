import React from "react";
import { IRoute } from "./interfaces/routeProps";

export class UrlProcessor {
  /**
   * Process the url to see what view should be opened
   */
  public static Process(routes: readonly IRoute[]): IRoute {
    const path: string[] = window.location.pathname.split("/").slice(1);

    //Is the routes empty
    if (routes.length === 0) return { path: "/", component: React.Fragment };

    //Remove last empty path
    if (path[path.length - 1] === "") path.pop();

    //Is the url specific
    if (path.length === 0) return routes[0];

    //Url is specific enough, start processing

    //Check every route paths
    for (let routePath of routes) {
      const valuePath = routePath.path.split("/");

      //Remove first slash letter
      if (valuePath[0] === "") valuePath.shift();
      //Remove last slash letter
      if (valuePath[valuePath.length - 1] === "") valuePath.pop();

      for (let i = 0; i < valuePath.length; i++) {
        //When route paths is longer than current path - Out of range
        if (i >= path.length) break;

        //Match the path
        if (valuePath[i] === path[i]) {
          //Is this check the last? and is the url ending?
          if (i === valuePath.length - 1 && i === path.length - 1) {
            return routePath;
          }

          //Next path word

          //Else if :custom_url
        } else if (valuePath[i].charAt(0) === ":") {
          //Convert url value to props
          if (!routePath.props) routePath.props = {};
          routePath.props[valuePath[i].substr(1)] = decodeURI(path[i]);

          //Is this check the last? and is the url ending?
          if (i === valuePath.length - 1 && i === path.length - 1) {
            return routePath;
          }
        } else {
          //Does not match
          break;
        }
      }
    }

    //All paths do not match
    return routes[0];
  }
}
