import { ZeroStore } from "/lib/Zero.js";

// global store, mainly for ZeroRouter
const globalStore = new ZeroStore(
    {
        routes: [],
        page: {
            path: "",
            params: {},
        },
        authenticated: false,
        username: ""
    },
    (state, action) => {
        switch (action.type) {
            case types.routerNavigateTo:
                return {
                    page: action.payload,
                };

            default:
                return state;
        }
    }
);

// redux-like pattern
// generally I didn't use this pattern because state wasn't really shared that much
const types = {
    routerNavigateTo: "router/navigateTo",
};

export default globalStore;
export { types };
