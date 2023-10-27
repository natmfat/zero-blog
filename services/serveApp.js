import ZeroServerUtils from "../lib/ZeroServerUtils";
import ZeroMarkdown from "../lib/ZeroMarkdown";
import config from "../config";

const postsDirectory = "posts";
const postFiles = ZeroServerUtils.getAllFiles(postsDirectory)
    .map((filename) => {
        const zeroMarkdown = new ZeroMarkdown(
            ZeroServerUtils.readFile(filename)
        );

        return {
            url: filename.replace(".md", ""),
            markdown: zeroMarkdown,
            content: zeroMarkdown.render(),
        };
    })
    .sort(
        (postA, postB) =>
            new Date(postB.markdown.metadata.date) -
            new Date(postA.markdown.metadata.date)
    );

// get the title if pathname starts with posts
const getTitle = (pathname) => {
    if (pathname.startsWith("/posts")) {
        const post = postFiles.find((post) => `/${post.url}` === pathname);

        if (post) {
            return post.markdown.metadata.title;
        }
    }
};

export default (utils) => {
    if (utils.req.method === "GET") {
        utils.renderFile("templates/index.html", {
            author: config.author,
            posts: postFiles,
            title: getTitle(utils.url.pathname),
        });

        return true;
    }
};
