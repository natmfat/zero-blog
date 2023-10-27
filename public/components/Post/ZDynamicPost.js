import Zero, { ZeroUtils, ZeroStore } from "/lib/Zero.js";
import ZRouter from "/components/ZeroRouter/ZRouter.js";
import globalStyles from "/globalStyles.js";
import globalStore from "/globalStore.js";

const h = ZeroUtils.jsh;
const styles = {
    postWrapper: {
        ...globalStyles.layoutWidthLarge,
        marginBottom: "3rem",
        marginTop: "3rem",
        position: "relative",
    },

    postEmoji: {
        width: "100%",
        textAlign: "center",
    },
    postEmojiImage: {
        fontSize: "5rem",
        margin: "2rem 0 0 0",
    },
    postEmojiTitle: {
        fontSize: "3rem",
        fontWeight: "800",
        margin: "1rem 0 0 0",
        color: "var(--c-head)",
    },

    markdownContentWrapper: {
        display: "flex",
        gap: "2rem",
        marginTop: "2rem",
    },
    markdownContent: {
        padding: "2rem",
        flex: "1 1 100%",
    },

    postMetadata: {
        width: "100%",
        flex: "0 0 17.5rem",
    },
    postDivider: {
        margin: "2rem 0 0 0",
        border: "1px solid var(--c-secondary-bg)",
    },
};

Zero.define(
    "z-dynamic-post",
    class ZDynamicPost extends Zero {
        store = {
            globalStore,
            localStore: new ZeroStore({
                activeHeading: 0,
            }),
        };

        style = `
            .markdownTag {
                padding: 0.5rem 0.75rem;
                border: 1px solid var(--c-secondary-bg);
                border-radius: 10rem;
                font-size: 0.9rem;
                cursor: pointer;
                margin-right: 0.75rem;
                text-decoration: none;
            }

            .markdownTag:hover {
                background-color: var(--c-secondary-bg);
            }

            .markdownHtml {
                line-height: 1.5;
            }

            .markdownHtml img {
                max-width: 100%;
                border-radius: 0.75rem;
            }

            .markdownHtml code[data-type="inline"] {
                border-radius: 0.25rem;
                background-color: var(--c-article-bg);
                padding: 0 0.25rem;
                color: var(--c-primary-hover);
                font-size: 1rem;
            }

            .markdownHtml a {
                color: var(--c-primary);
                text-decoration: none;
            }

            .markdownHtml a:hover {
                text-decoration: underline;
            }

            .markdownHtml pre {
                border-radius: 0.75rem;
                padding: 1rem;
                background-color: var(--c-replit-editor);
                color: #fff;
                max-width: 100%;
                overflow-x: auto;
                white-space: pre-wrap;
                word-break: break-all;
            }

            .markdownHtml blockquote {
                border-left: 0.25rem solid var(--c-article-bg);
                padding-left: 1rem;
            }

            @media (max-width: 70rem) {
                .postMetadata {
                    display: none;
                }

                .markdownContent {
                    box-shadow: none !important;
                    padding: 1rem !important;
                }
            }
        `;

        get headings() {
            return ZeroUtils.$$(this.shadowRoot, ".markdownHtml > *").filter(
                (node) => ["h1", "h2"].includes(node.tagName.toLowerCase())
            );
        }

        jumpPolyfill() {
            for (const heading of this.headings) {
                if (location.hash === `#${encodeURI(heading.textContent)}`) {
                    heading.scrollIntoView({
                        behavior: "smooth",
                    });
                }
            }
        }

        onScroll() {
            const headings = this.headings;
            for (let i = 0; i < headings.length; i++) {
                const heading = headings[i];

                if (
                    Math.abs(heading.getBoundingClientRect().top) <
                    heading.offsetHeight
                ) {
                    this.store.localStore.state.activeHeading = i;
                    return;
                }
            }
        }

        mount() {
            // man js be making me recreate everything cause it won't auto jump to shadow dom ids
            window.addEventListener("hashchange", this.jumpPolyfill.bind(this));
            window.addEventListener("scroll", this.onScroll.bind(this));

            // delay and wait for first render I guess
            setTimeout(() => {
                this.jumpPolyfill();
            }, 100);
        }

        unmount() {
            window.removeEventListener(
                "hashchange",
                this.jumpPolyfill.bind(this)
            );

            window.removeEventListener("scroll", this.onScroll.bind(this));
        }

        render() {
            const postId = globalStore.state.page.params.id;
            const postPath = `posts/${postId}`;

            const post = APP_POSTS.find((post) => post.url === postPath);

            if (!(postId && post)) {
                return null;
            }

            ZRouter.setTitle(post.markdown.metadata.title);

            const markdownHtml = h.div({
                class: "markdownHtml",
                __innerHTML: post.content,
            });

            // force all internal links to open in new tab
            ZeroUtils.$$(markdownHtml, "a").forEach((node) => {
                node.setAttribute("target", "_blank");
                node.setAttribute("rel", "noreferrer");
            });

            return h.main(
                { style: styles.postWrapper },
                h.div(
                    { style: styles.postEmoji },
                    h.h1(
                        { style: styles.postEmojiImage },
                        post.markdown.metadata.emoji
                    ),
                    h.h2(
                        { style: styles.postEmojiTitle },
                        post.markdown.metadata.title
                    )
                ),
                h.div(
                    { style: styles.markdownContentWrapper },
                    h.div({},
                        h.div(
                            {
                                style: {
                                    ...styles.markdownContent,
                                    ...globalStyles.postContainer,
                                },
                                class: "markdownContent",
                            },
                            post.markdown.metadata.tags.length > 0
                                ? post.markdown.metadata.tags
                                      .split(",")
                                      .map((tag) =>
                                          h.span({ class: "markdownTag" }, tag)
                                      )
                                : [],
                            markdownHtml,
                            h.hr({ style: styles.postDivider }),
                            h.zProfile(
                                {
                                    ...APP_AUTHOR,
                                    variant: "post",
                                },
                                h.zProfileSocials({
                                    ...APP_AUTHOR.links,
                                })
                            ),
                        ),
                        h.zComment({
                            api: location.origin
                        })
                    ),
                    h.div(
                        { style: styles.postMetadata, class: "postMetadata" },
                        h.zDynamicMetadata({
                            name: APP_AUTHOR.name,
                            date: post.markdown.metadata.date,
                            words:
                                Math.ceil(post.content.split(" ").length / 10) *
                                10,
                        }),
                        h.zDynamicSummary({
                            headings: JSON.stringify(
                                post.markdown.tokens
                                    .filter(({ type }) =>
                                        ["h1", "h2"].includes(type)
                                    )
                                    .map((token, i) => ({
                                        ...token,
                                        active:
                                            this.store.localStore.state
                                                .activeHeading === i,
                                    }))
                            ),
                        })
                    )
                )
            );
        }
    }
);
