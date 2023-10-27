import Zero, { ZeroUtils, ZeroStore } from "/lib/Zero.js";
import globalStyles from "/globalStyles.js";

const { jsh: h, $ } = ZeroUtils;
const styles = {
    postSummary: {
        ...globalStyles.postContainer,
        padding: "1rem",
        marginTop: "2rem",
    },
    postSummaryHeading: {
        margin: 0,
        fontSize: "1rem",
        fontWeight: 600,
    },
};

Zero.define(
    "z-dynamic-summary",
    class ZDynamicSummary extends Zero {
        store = new ZeroStore({
            sticky: false,
        });

        style() {
            return `
                .sticky-active {
                    position: fixed;
                    top: 0;
                    width: ${
                        this.store.state.sticky ? `calc(17.5rem - 2rem)` : ""
                    };
                }

                .summaryList {
                    --bullet-size: 0.75rem;
                    --padding-left: 2rem;

                    list-style: none;
                    padding: 0 0 0 var(--padding-left);
                    margin: 1rem 0 0 0;
                    position: relative;
                    max-height: calc(100vh - 4rem);
                }

                .summaryList::before {
                    content: "";
                    display: block;
                    position: absolute;
                    z-index: 0;
                    height: 100%;
                    width: 2px;
                    top: 0;
                    transform: translateX(calc(-1 * var(--padding-left) / 2 - 50%));
                    background-color: var(--c-article-bg);
                }

                .summaryList li {
                    position: relative;
                    cursor: pointer;
                    color: var(--c-gray);
                }
            
                .summaryList h1,
                .summaryList h2 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0.75rem 0 0 0;
                }
            
                .summaryList h2 {
                    font-weight: 400;
                }
            
                .summaryList h2::before {
                    --bullet-size: 0.5rem;
                }
            
                .summaryList h1::before,
                .summaryList h2::before {
                    content: "";
                    display: block;
                    height: var(--bullet-size);
                    width: var(--bullet-size);
                    background-color: var(--c-article-bg);
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%)
                        translateX(calc(-1 * var(--padding-left) / 2 - 50%));
                    z-index: 1;
                    border-radius: 100%;
                    border: 1px solid var(--c-bg);
                }
            
                .summaryList li.active {
                    color: var(--c-body);
                }
            
                .summaryList li.active h1::before,
                .summaryList li.active h2::before {
                    background-color: var(--c-primary);
                }
            `;
        }

        // make table of contents "sticky", it will scroll and then stay fixed when it is just about to leave the view
        stickyPolyfill() {
            const sticky = $(this.shadowRoot, ".sticky");
            const body = this.shadowRoot.host.parentNode;

            this.store.state.sticky = false;
            body.style.paddingTop = 0;

            if (window.scrollY >= sticky.offsetTop + 64) {
                this.store.state.sticky = true;
                body.style.paddingTop = sticky.offsetTop;
            }
        }

        onScroll() {
            this.stickyPolyfill();
        }

        mount() {
            window.addEventListener("scroll", this.onScroll.bind(this));
        }

        unmount() {
            window.removeEventListener("scroll", this.onScroll.bind(this));
        }

        render() {
            const headings = JSON.parse(this.props.headings);

            return h.div(
                {
                    class:
                        "sticky" +
                        (this.store.state.sticky ? " sticky-active" : ""),
                    style: styles.postSummary,
                },
                h.h1(
                    { style: styles.postSummaryHeading },
                    "Table of Contents",
                    h.ul(
                        {
                            class: "summaryList",
                        },
                        headings.map(({ type, content, active }, i) =>
                            h.li(
                                {
                                    class: active ? "active" : "",
                                    onClick: () => {
                                        location.hash = content;
                                    },
                                },
                                h[type]({}, content)
                            )
                        )
                    )
                )
            );
        }
    }
);
