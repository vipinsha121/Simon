import { RouteReuseStrategy, Route } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CacheRouteReuseStrategy implements RouteReuseStrategy {
  handlers: {[path: string]: DetachedRouteHandle} = {};

  // Determines if this route (and its subtree) should be detached to be reused later
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const config: Route = route.routeConfig;
    if (!config || config.loadChildren) {
      return;
    }
    return config && !config.loadChildren;
  }

  // Stores the detached route.
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path: string = this.getRoutePath(route);
    if (handle) {
      this.handlers[path] = handle;
    }

    const config: Route = route.routeConfig;
    if (!config || config.loadChildren) {
      return;
    }
    if (config) {
      const childRoute: ActivatedRouteSnapshot = route.firstChild;
      const futureRedirectTo = childRoute ? childRoute.url.map((urlSegment) => {
        return urlSegment.path;
      }).join('/') : '';
      const childRouteConfigs: Route[] = config.children;
      if (childRouteConfigs) {
        let redirectConfigIndex: number;
        const redirectConfig: Route = childRouteConfigs.find((childRouteConfig, index) => {
          if (childRouteConfig.path === '' && !!childRouteConfig.redirectTo) {
            redirectConfigIndex = index;
            return true;
          }
          return false;
        });
        // Redirect route exists
        if (redirectConfig) {
          if (futureRedirectTo !== '') {
            // Current activated route has child routes, update redirectTo
            redirectConfig.redirectTo = futureRedirectTo;
          } else {
            // Current activated route has no child routes, remove the redirect (otherwise retrieval will always fail for this route)
            childRouteConfigs.splice(redirectConfigIndex, 1);
          }
        } else if (futureRedirectTo !== '') {
          childRouteConfigs.push({
            path: '',
            redirectTo: futureRedirectTo,
            pathMatch: 'full'
          });
        }
      }
    }
  }

  // Determines if this route (and its subtree) should be reattached
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const config: Route = route.routeConfig;
    if (!config || config.loadChildren) {
      return;
    }

    return !!this.handlers[this.getRoutePath(route)];
  }

  // Retrieves the previously stored route
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const config: Route = route.routeConfig;
    if (!config || config.loadChildren) {
      return false;
    }

    return this.handlers[this.getRoutePath(route)];
  }

  // Determines if a route should be reused
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return this.getRoutePath(future) === this.getRoutePath(curr) && future.routeConfig === curr.routeConfig;
  }

  private getRoutePath(route: ActivatedRouteSnapshot): string {
    let next = route;
    // Since navigation is usually relative
    // we go down to find out the child to be shown.
    while (next.firstChild) {
      next = next.firstChild;
    }
    const segments = [];
    // Then build a unique key-path by going to the root.
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent;
    }
    return segments.reverse().filter(Boolean).join('/');
  }
}
