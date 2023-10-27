import { createServer } from "http";
import ZeroServerUtils from "./ZeroServerUtils";

export default class ZeroServer {
    constructor({ port = 5500, services = [] } = {}) {
        this.port = port;
        this.services = services.filter(s => typeof s === "function");

        this.server = this._createServer();
        this.server.listen(this.port);
    }

    // create actual server
    // as you can see, very simple
    _createServer() {
        const server = createServer(async (req, res) => {
            const utils = new ZeroServerUtils(this, req, res);

            if (req.method === "OPTIONS") {
                utils.status(200).end();
                return;
            }

            for (const service of this.services) {
                const responded = await Promise.resolve()
                    .then(() => service(utils))
                    .catch((e) => {
                        console.error(e);
                        utils.error(500, "internal server error");
                        return true;
                    });

                if (responded) {
                    return;
                }
            }

            utils.error(404, "not found");
        });

        return server;
    }
}
