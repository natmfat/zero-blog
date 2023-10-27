import Zero, { ZeroUtils } from "/lib/Zero.js";
import globalStyles from "/globalStyles.js";

const h = ZeroUtils.jsh;
const styles = {
    articleWrapper: {
        ...globalStyles.layoutWidthSmall,
        marginTop: "3rem",
        marginBottom: "3rem",
    },
    articleHeading: {
        margin: 0,
        fontSize: "1.75rem",
        fontWeight: 700,
    },
    articleGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem",
        marginTop: "1.5rem",
    },
};

Zero.define(
    "z-articles",
    class ZArticles extends Zero {
        style = `
            @media (max-width: 70rem) {
                .articleGrid {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }

            @media (max-width: 55rem) {
                .articleGrid {
                    grid-template-columns: 1fr !important;
                }
            }
        `;

        render() {
            return h.div(
                { style: styles.articleWrapper },
                h.h2({ style: styles.articleHeading }, "Articles"),
                h.div(
                    { style: styles.articleGrid, class: "articleGrid" },
                    h.slot()
                )
            );
        }
    }
);
