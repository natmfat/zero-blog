import Zero, { ZeroUtils } from "/lib/Zero.js";

const h = ZeroUtils.jsh;
const styles = {
    article: {
        borderRadius: "0.75rem",
        backgroundColor: "var(--c-bg)",
        overflow: "hidden",
    },
    articleLink: {
        textDecoration: "none",
        color: "var(--c-body)",
        cursor: "pointer",
    },
    articleEmoji: {
        fontSize: "2.5rem",
        textAlign: "center",
        padding: "1.5rem 0",
        backgroundColor: "var(--c-article-bg)",
    },
    articleContent: {
        padding: "1rem",
        minHeight: "5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1rem",
    },
    articleContentHeading: {
        margin: 0,
        fontSize: "1.125rem",
        fontWeight: 700,
    },
    articleContentDate: {
        margin: 0,
        fontSize: "0.9rem",
        color: "var(--c-gray)",
    },
};

Zero.define(
    "z-article",
    class ZArticle extends Zero {
        static getDaysAgo(date) {
            return Math.abs(
                Math.ceil(
                    (new Date(date).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                )
            );
        }

        render() {
            const daysAgo = ZArticle.getDaysAgo(this.props.date);

            return h.article(
                { style: styles.article },
                h.a(
                    { style: styles.articleLink },
                    h.zLink(
                        { href: this.props.href },
                        h.div({ style: styles.articleEmoji }, this.props.emoji),
                        h.div(
                            { style: styles.articleContent },
                            h.h3(
                                { style: styles.articleContentHeading },
                                this.props.title
                            ),
                            h.date(
                                { style: styles.articleContentDate },
                                daysAgo === 0
                                    ? "Hot off the press"
                                    : `${daysAgo} day${
                                          daysAgo === 1 ? "" : "s"
                                      } ago`
                            )
                        )
                    )
                )
            );
        }
    }
);
