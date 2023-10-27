import Zero, { ZeroUtils, ZeroStore } from "/lib/Zero.js";
import BootlegAuth from "/lib/BootlegAuth.js";

import globalStyles from "/globalStyles.js";
import globalStore from "/globalStore.js";

const { jsh: h } = ZeroUtils;
const styles = {
    commentWrapper: {
        ...globalStyles.postContainer,
        marginTop: "2rem"
    }
}

Zero.define(
    "z-comment",
    class ZComment extends Zero {
        store = {
            globalStore,
            localStore: new ZeroStore({
                comments: []
            })
        };

        fetch(route, method, payload = {}) {
            const body = method === "GET" ? null : JSON.stringify(payload);

            return fetch(`${this.props.api}${route}`, {
                headers: {
                    Origin: this.props.api,
                    Referrer: this.props.api,
                },
                method,
                body,
            });
        }

        getCredentials() {
            this.fetch("/getCredentials", "GET")
                .then((res) => res.json())
                .then(({ success, userName }) => globalStore.setState({ authenticated: success, username: userName }));
        }

        mount() {
            // the problem with REST
            this.fetch("/createPage", "POST", { page: location.href });
            this.getCredentials();
            
            this.fetch(`/getPage?page=${location.href}`, "GET")
                .then((res) => res.json())
                .then(({ comments = [] }) => {
                    this.store.localStore.setState({ comments });
                });
        }

        style = `
            .commentWrapper {
                padding: 2rem;
            }

            .commentLogin h1 {
                margin: 0;
            }

            .commentLogin p {
                margin: 0.5rem 0 0 0;
            }

            .commentLogin a {
                color: var(--c-primary);
                text-decoration: none;
            }
            
            .commentLogin a:hover {
                text-decoration: underline;
            }

            .commentTextarea {
                width: 100%;
                min-height: 5rem;
                resize: vertical;
                padding: 1rem;
                border-radius: 0.5rem;
                box-sizing: border-box;
                font-family: Inter, sans-serif;
                outline: none;
                border: 1px solid #eee;
                font-size: 1rem;
            }

            .commentTextarea:focus {
                border-color: var(--c-primary);
            }

            .commentButton {
                border-radius: 0.5rem;
                outline: none;
                border: none;
                background-color: var(--c-primary);
                padding: 0.75rem 1rem;
                font-size: 1rem;
                cursor: pointer;
                margin-top: 1rem;
            }

            .commentButton:hover {
                background-color: var(--c-primary-hover);
            }

            .comments .comment:first-child {
                margin-top: 2rem;
            }

            .comment {
                margin-top: 1rem;
            }

            .commentHeader,
            .commentHeader span {
                margin: 0;
                line-height: 1rem;
                vertical-align: top;
            }

            .commentHeader span {
                color: gray;
                font-size: 0.9rem;
            }

            .commentBody {
                margin: 0;
                margin-top: 0.5rem;
                word-break: break-all;
            }

            @media (max-width: 70rem) {
                .commentWrapper {
                    padding: 1rem !important;
                }
            }
        `;

        render() {
            const comments = this.store.localStore.getState().comments

            return h.div(
                { 
                    style: styles.commentWrapper,
                    class: "commentWrapper"
                },
                globalStore.getState().authenticated
                    ? h.div({ },
                        h.textarea({ placeholder: "Add a comment", class: "commentTextarea" }),
                        h.button({ 
                            class: "commentButton", 
                            onClick: (e) => {
                                const textarea = e.target.parentNode.querySelector("textarea")
                                const comment = textarea.value.trim()

                                if(comment.length > 0) {
                                    this.fetch("/createComment", "PUT", {
                                        page: location.href,
                                        comment
                                    })

                                    this.store.localStore.setState(state => ({
                                        comments: state.comments.concat([
                                            {
                                                comment,
                                                date: (new Date()).toString(),
                                                username: globalStore.getState().username
                                            }
                                        ])
                                    }))

                                    textarea.value = ""
                                }
                            }
                        }, "Comment"),

                        h.div({ class: "comments" }, 
                            comments.reverse().map(({ comment, username, date }) => (
                                h.div({ class: "comment" },
                                    h.p({ class: "commentHeader" }, `${username} • `, 
                                        h.span({}, new Date(date).toLocaleDateString("en-US").toString())
                                    ),
                                    h.p({ class: "commentBody" }, comment)     
                                )
                            ))
                        )
                    )
                    : h.div(
                          { class: "commentLogin" },
                          h.h1({}, "Comments"),
                          h.p(
                              {},
                              h.a(
                                  {
                                      href: "#",
                                      onClick: (e) => {
                                          e.preventDefault()

                                          const auth = new BootlegAuth()
                                          auth.openWindow()
                                          auth.onAuthComplete(() => {
                                              this.getCredentials()
                                          })
                                      }
                                  },
                                  "Log in"
                              ),
                              " to join the discussion."
                          )
                      )
            );
        }
    }
);
