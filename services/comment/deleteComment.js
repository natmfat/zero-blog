import db from "../../database"
import { formatPage } from "../serviceUtils.js"

export default async (utils) => {
    if(utils.req.method === "DELETE" && utils.url.pathname === "/deleteComment") {
        const body = JSON.parse(await utils.body)
        const username = utils.req.headers["x-replit-user-name"]

        if(!username) {
            utils.json({
                message: "not authenticated",
                success: false
            })
            
            return true
        }

        if(body && body.page && body.commentId) {
            const page = formatPage(body.page)
            const comments = await db.get(page)
            
            /*
            delete methods fail silently because
            either the resource is there or not lmao and it will be not there at the end of the day
            */

            comments = comments.filter(comment => (
                !(comment.username === username && comment.id.toString() === body.commentId.toString())
            ))
            await db.set(page, comments)
            
            utils.json({
                message: `deleted comment ${body.commentId}`,
                success: true                    
            })

            return true
        }

        utils.json({
            message: "missing page or commentId in payload",
            success: false
        })
        
        return true
    }
}
