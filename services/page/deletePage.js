import db from "../../database"
import { formatPage } from "../serviceUtils.js"


export default async (utils) => {
    if(utils.req.method === "DELETE" && utils.url.pathname === "/deletePage") {
        const body = JSON.parse(await utils.body)

        if(body && body.page) {
            await db.delete(formatPage(page))
            utils.json({
                message: `deleted ${body.page}`,
                success: true
            })
            
            return true
        }

        utils.json({
            message: "missing page to delete",
            success: false
        })

        return true
    }
}
