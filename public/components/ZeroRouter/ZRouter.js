import Zero, { ZeroUtils } from "/lib/Zero.js";
import globalStore, { types } from "/globalStore.js";

export default class ZRouter extends Zero {
    store = globalStore;
    ref = {
        prevHash: location.hash,
    };

    static pathToRegex(path) {
        return new RegExp(
            "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
        );
    }

    static getParams(match) {
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
            (result) => result[1]
        );

        return Object.fromEntries(
            keys.map((key, i) => {
                return [key, values[i]];
            })
        );
    }

    static setTitle(title = "Home") {
        document.title = `Zero Framework Blog | ${title}`;
    }

    static getMatch(routes) {
        let match = routes
            .map((route) => ({
                route,
                result: location.pathname.match(
                    ZRouter.pathToRegex(route.path)
                ),
            }))
            .filter((route) => route.result)[0];

        if (!match) {
            match = {
                route: routes[0],
                result: [location.pathname],
            };
        }

        if (match.route.title) {
            ZRouter.setTitle(match.route.title);
        }

        return match;
    }

    static navigateTo(url) {
        if (url && url !== location.pathname) {
            history.pushState(null, null, url);
        }

        const match = ZRouter.getMatch(globalStore.state.routes);
        globalStore.dispatch({
            type: types.routerNavigateTo,
            payload: {
                path: match.route.path,
                params: ZRouter.getParams(match),
            },
        });
    }

    mount() {
        globalStore.state.routes = this.props.children
            .filter((child) => child.tagName === "Z-ROUTE")
            .map((route) => ({
                path: route.getAttribute("path"),
                title: route.getAttribute("title"),
            }));

        ZRouter.navigateTo();
        window.addEventListener("popstate", () => {
            if (this.ref.prevHash !== location.hash) {
                this.ref.prevHash = location.hash;
                return false;
            }
            ZRouter.navigateTo();
        });
    }

    render() {
        return ZeroUtils.jsh.fragment({}, ZeroUtils.jsh.slot());
    }
}

Zero.define("z-router", ZRouter);
