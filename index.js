import ZeroServer from "./lib/ZeroServer";
import config from "./config";

// import services
import servePublic from "./services/servePublic";
import serveApp from "./services/serveApp";

import createPage from "./services/page/createPage";
import deletePage from "./services/page/deletePage";
import getPage from "./services/page/getPage";

import createComment from "./services/comment/createComment";
import deleteComment from "./services/comment/deleteComment";

import serveLogin from "./services/serveLogin";

import serveGenesis from "./services/serveGenesis";

/*
create a new server
relies on a simple principle: you have a bunch of "services"
services return "true" if they send a response and will prevent other services from running

unfortunately, my implementation of ZeroServer & the Zero frontend does not yet support errors, like a 404 page
(although ZeroServerUtils support these responses)
*/
new ZeroServer({
    port: config.port,
    services: [
        servePublic,
        serveGenesis,

        serveLogin,
        createPage,
        // deletePage, // disabled cause I don't want users deleting - could have added a thing to check for my username but whatever
        getPage,

        createComment,
        deleteComment, // didn't actually add UI to this, figured we should immortalize people's mistakes >:) also it's tied to their username so if they spam they can be screwed :)

        serveApp,
    ],
});
