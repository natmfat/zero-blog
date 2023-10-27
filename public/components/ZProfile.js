import Zero, { ZeroUtils } from "/lib/Zero.js";
import globalStyles from "/globalStyles.js";

const h = ZeroUtils.jsh;
const styles = {
    profile: {
        ...globalStyles.layoutWidthSmall,
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        paddingTop: "2rem",
        paddingBottom: "2rem",
    },
    profileAvatar: {
        width: "8rem",
        height: "8rem",
        borderRadius: "50%",
        border: "1px solid var(--c-secondary-bg)",
    },
    profileName: {
        fontSize: "1.5rem",
        fontWeight: "600",
        lineHeight: 1,
        margin: 0,
    },
    profileBio: {
        margin: "0.75rem 0",
        maxWidth: "80%",
        color: "var(--c-body)",
    },
};

Zero.define(
    "z-profile",
    class ZProfile extends Zero {
        style = `
            @media (max-width: 55rem) {
                .profile {
                    flex-direction: column;
                    align-items: flex-start !important;
                }
            }
        `;

        render() {
            const { avatar, name, bio } = this.props;

            return h.section(
                { style: globalStyles.bgWrapper },

                h.div(
                    { style: styles.profile, class: "profile" },
                    h.img({
                        src: avatar,
                        alt: `${name}'s profile picture`,
                        style: styles.profileAvatar,
                    }),
                    h.div(
                        {},
                        h.h1({ style: styles.profileName }, name),
                        h.p({ style: styles.profileBio }, bio),
                        h.slot()
                    )
                )
            );
        }
    }
);
