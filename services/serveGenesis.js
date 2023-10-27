import ZeroServerUtils from "../lib/ZeroServerUtils"
import configInternals from "../configInternals.json"

import * as fs from "fs"
import * as path from "path"

import { __dirname } from "../config"

const configCopy = { ...configInternals }

const saveConfig = (data) => {
    const filename = path.join(__dirname, "./configInternals.json")
    fs.writeFileSync(filename, JSON.stringify(data, null, 4))
}

export default async (utils) => {
    if(!configCopy.genesis) {
        return
    }

    if(utils.req.method === "POST" && utils.url.pathname === "/genesis") {
        const params = new URLSearchParams(await utils.body)

        configCopy.genesis = false
        if(configInternals.demo) {
            saveConfig({
                ...configInternals,
                genesis: false
            })
        } else {
            saveConfig({
                ...configInternals,
                genesis: false,
                author: {
                    avatar: params.get("avatar"),
                    name: params.get("name"),
                    bio: params.get("bio"),
                    links: {
                        github: params.get("github"),
                        twitter: params.get("twitter"),
                        personal: params.get("personal")
                    }
                }
            })
        }
        
        utils.status(303).header("Location", "/").end()
        return true
    }

    utils.sendFile("templates/genesis.html")
    return true
}