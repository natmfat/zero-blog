import db from "../../database"
import { formatPage } from "../serviceUtils.js"

export default async (utils) => {
    if(utils.req.method === "POST" && utils.url.pathname === "/createPage") {
        const body = JSON.parse(await utils.body)

        if(body && body.page) {
            const page = formatPage(body.page)
            const exists = await db.get(page)

            // check if page already exists
            if(exists) {
                utils.json({
                    message: "resource already exists",
                    success: false
                })

                return true
            }

            // otherwise create new empty page
            await db.set(page, [])
            utils.json({
                message: `created ${body.page}`,
                success: true
            })

            return true
        }

        utils.json({
            message: "missing page in payload",
            success: false
        })

        return true
    }
}
