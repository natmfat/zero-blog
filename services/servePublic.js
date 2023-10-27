import ZeroServerUtils from "../lib/ZeroServerUtils";

const publicDirectory = "public";
const publicFiles = ZeroServerUtils.getAllFiles(publicDirectory);

export default (utils) => {
    const pathname = publicDirectory + utils.url.pathname;

    if (utils.req.method === "GET" && publicFiles.includes(pathname)) {
        utils.sendFile(pathname);
        return true;
    }
};
