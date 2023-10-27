import * as path from "path";
import * as fs from "fs";

import ZeroRenderer from "./ZeroRenderer";
import { __dirname } from "../config";

export default class ZeroServerUtils {
    constructor(server, req, res) {
        this.server = server;
        this.req = req;
        this.res = res;

        this.url = new URL(`http://localhost:${this.server.port}${req.url}`);
    }

    // set status code
    status(code) {
        this.res.statusCode = code;
        return this;
    }

    // set header
    header(key, value) {
        this.res.setHeader(key, value);
        return this;
    }

    // end response
    end(message, encoding = "utf-8") {
        this.res.end(message, encoding);
    }

    // send plain text
    send(message) {
        this.status(200)
            .header("Content-Type", ZeroServerUtils.getContentType(".txt"))
            .end(message);
    }

    // send JSON
    json(object) {
        this.status(200)
            .header("Content-Type", ZeroServerUtils.getContentType(".json"))
            .end(JSON.stringify(object));
    }

    // send error message
    error(code, message) {
        this.status(code)
            .header("Content-Type", ZeroServerUtils.getContentType(".txt"))
            .end(`[error] ${code} ${message}`);
    }

    // read a file & send it
    sendFile(filename) {
        this.status(200)
            .header("Content-Type", ZeroServerUtils.getContentType(filename))
            .end(ZeroServerUtils.readFile(filename));
    }

    // read a file & use custom templating engine
    renderFile(filename, data) {
        const renderer = new ZeroRenderer(
            ZeroServerUtils.readFile(filename),
            data
        );

        this.status(200)
            .header("Content-Type", ZeroServerUtils.getContentType(filename))
            .end(renderer.compile(), "utf-8");
    }

    // get post data
    static parseBody(req) {
        return new Promise((resolve, reject) => {
            const data = [];

            req.on("data", (chunk) => data.push(chunk));
            req.on("end", () => resolve(data.toString()));
        });
    }

    get body() {
        return ZeroServerUtils.parseBody(this.req);
    }

    // parse cookies
    static parseCookies(cookies = "") {
        return cookies.length === 0
            ? {}
            : cookies
                  .split(";")
                  .map((cookie) => cookie.trim())
                  .reduce((acc, curr) => {
                      const [key, value] = curr.split("=");
                      return {
                          ...acc,
                          [key]: decodeURIComponent(value),
                      };
                  }, {});
    }

    get cookies() {
        return ZeroServerUtils.parseCookies(req.headers.cookie);
    }

    // get all files in a directory
    static getAllFiles(directory) {
        const files = fs.readdirSync(directory);

        return files
            .map((file) => {
                const filepath = path.join(directory, file);
                const status = fs.statSync(filepath);

                // get all files in child directory or return file path
                if (status.isDirectory()) {
                    return ZeroServerUtils.getAllFiles(filepath);
                } else if (status.isFile()) {
                    return filepath;
                }
            })
            .flat(Infinity)
            .filter((file) => file)
            .map((pathname) => pathname.toString().replace("\\", "/"));
    }

    // get mime type from filename
    static getContentType(filename) {
        const extentionToType = {
            ".txt": "text/plain",
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".wav": "audio/wav",
            ".mp4": "video/mp4",
            ".woff": "application/font-woff",
            ".ttf": "application/font-ttf",
            ".eot": "application/vnd.ms-fontobject",
            ".otf": "application/font-otf",
            ".wasm": "application/wasm",
        };

        for (const [extension, type] of Object.entries(extentionToType)) {
            if (filename.endsWith(extension)) {
                return type;
            }
        }

        return extentionToType[".txt"];
    }

    // memoized readFile
    static readFileCache = {};
    static readFile(filename, rebuild = true) {
        filename = path.join(__dirname, filename);

        if (
            ZeroServerUtils.readFileCache.hasOwnProperty(filename) &&
            !rebuild
        ) {
            return ZeroServerUtils.readFileCache[filename];
        }

        try {
            const fileContent = fs.readFileSync(filename, "utf-8");
            ZeroServerUtils.readFileCache[filename] = fileContent;
            return fileContent;
        } catch (e) {
            return e;
        }
    }
}
