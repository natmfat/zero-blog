import Zero, { ZeroUtils } from "/lib/Zero.js";
import globalStyles from "/globalStyles.js";

const h = ZeroUtils.jsh;
const styles = {
    headerDiv: {
        ...globalStyles.layoutWidthLarge,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "var(--c-bg)",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        position: "relative",
    },
    headerLink: {
        fontSize: "1.75rem",
        cursor: "pointer",
        margin: 0,
        color: "var(--c-head)",
    },
};

Zero.define(
    "z-header",
    class ZHeader extends Zero {
        render() {
            return h.header(
                { style: globalStyles.bgWrapper },
                h.div(
                    { style: styles.headerDiv },
                    h.a(
                        {},
                        h.zLink(
                            { href: "/" },
                            h.h1({ style: styles.headerLink }, "📦 Zero Blog")
                        )
                    ),
                    h.zSearch()
                )
            );
        }
    }
);
