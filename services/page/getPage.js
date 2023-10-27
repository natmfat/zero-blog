import db from "../../database"
import { formatPage } from "../serviceUtils.js"

export default async (utils) => {
    if(utils.req.method === "GET" && utils.url.pathname === "/getPage") {
        const params = utils.url.searchParams
        const page = params.get("page")

        if(params && page) {
            const comments = await db.get(formatPage(page))

            // send comments
            if(comments) {
                utils.json({
                    comments,
                    message: "retrieved comments",
                    success: true
                })

                return true
            }

            // page must be created first
            utils.json({
                comments: [],
                message: `resource ${page} does not exist`,
                success: false
            })

            return true
        }

        // page param is required
        utils.json({
            comments: [],
            message: "missing page param",
            success: false
        })

        return true
    }
}
