/**
 * AppRouter is a lightweight client-side router using the URL hash.
 *
 * It enables single-page application navigation by listening to hash changes
 * and invoking registered callback functions for each route.
 *
 * Example:
 * AppNavigator.registerPath('home', renderHome);
 * AppNavigator.registerPath('404', renderNotFound);
 * AppNavigator.goTo('home');
 */
class AppRouter {
    constructor() {
        this.paths = {};
        window.addEventListener('hashchange', () => this.processPathChange());
    }

    registerPath(path, callback) {
        this.paths[path] = callback;
    }

    processPathChange() {
        const path = window.location.hash.slice(1);
        if (this.paths[path]) {
            this.paths[path]();
        } else if (this.paths['404']) {
            this.paths['404']();
        }
    }

    goTo(path) {
        window.location.hash = path;
    }
}

export const AppNavigator = new AppRouter();