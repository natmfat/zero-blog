export default (utils) => {
    if(utils.req.method === "GET" && utils.url.pathname === "/getCredentials") {
        utils.json({
            userId: utils.req.headers["x-replit-user-id"],
            userName: utils.req.headers["x-replit-user-name"],
            userRoles: utils.req.headers["x-replit-user-roles"],

            success: !!utils.req.headers["x-replit-user-id"],
        })
        
        return true
    }
}
