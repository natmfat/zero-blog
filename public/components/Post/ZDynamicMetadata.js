import Zero, { ZeroUtils } from "/lib/Zero.js";
import globalStyles from "/globalStyles.js";
import globalStore from "/globalStore.js";

const h = ZeroUtils.jsh;
const styles = {
    postDetails: {
        ...globalStyles.postContainer,
        padding: "0.25rem 1rem",
    },
    postDetailsTable: {
        borderCollapse: "collapse",
        width: "100%",
    },
    postDetailsRow: {
        borderTop: "1px solid var(--c-secondary-bg)",
        width: "100%",
    },
    postDetailsRowLeft: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "var(--c-gray)",
        padding: "0.75rem 0",
    },
    postDetailsRowRight: {
        textAlign: "right",
        padding: "0.75rem 0",
    },
};

const ZRow = ({ icon, key, value }) =>
    h.tr(
        { style: styles.postDetailsRow },
        h.td(
            { style: styles.postDetailsRowLeft },
            h.zRadixIcon({ type: icon, class: "none" }),
            key
        ),
        h.td({ style: styles.postDetailsRowRight }, value)
    );

Zero.define(
    "z-dynamic-metadata",
    class ZDynamicMetadata extends Zero {
        store = globalStore;

        style = `
            table tr:first-child {
                border-top: none !important;
            }
        `;

        render() {
            return h.div(
                { style: styles.postDetails },
                h.table(
                    { style: styles.postDetailsTable },
                    ZRow({
                        icon: "person",
                        key: "author",
                        value: this.props.name,
                    }),
                    ZRow({
                        icon: "calendar",
                        key: "published",
                        value: this.props.date,
                    }),
                    ZRow({
                        icon: "file",
                        key: "words",
                        value: `approx. ${this.props.words}`,
                    })
                )
            );
        }
    }
);
