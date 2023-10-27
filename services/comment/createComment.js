import db from "../../database"
import { formatPage, uid } from "../serviceUtils.js"


export default async (utils) => {
    // put method because technically we are updating a resource (page)
    if(utils.req.method === "PUT" && utils.url.pathname === "/createComment") {
        const body = JSON.parse(await utils.body)
        const username = utils.req.headers["x-replit-user-name"]

        if(!username) {
            utils.json({
                message: "not authenticated",
                success: false
            })
            
            return true
        }
        
        if(body && body.comment && body.page) {
            const page = formatPage(body.page)
            const comments = await db.get(page)

            // check if page already exists
            if(comments) {
                comments.push({
                    // probably should apply some basic sanitizing but I figure
                    // text content will deal with it
                    
                    comment: body.comment.trim(), 
                    date: new Date(),
                    username,
                    id: uid()
                })

                await db.set(page, comments)
                utils.json({
                    message: "left a comment",
                    success: true                    
                })

                return true
            }

            utils.json({
                message: `resource ${body.page} does not exist`,
                success: false
            })

            return true
        }

        utils.json({
            message: "missing comment or page in payload"
        })

        return true
    }
}
