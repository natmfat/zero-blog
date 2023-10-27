import Zero, { ZeroUtils } from "/lib/Zero.js";

const h = ZeroUtils.jsh;
const styles = {
    socials: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },
};

Zero.define(
    "z-profile-socials",
    class ZProfileSocials extends Zero {
        render() {
            const { github, twitter, personal } = this.props;
            const socials = [];

            const addSocial = (href, icon) => {
                if (href) {
                    socials.push(
                        h.a(
                            { href, target: "_blank", rel: "noreferrer" },
                            h.zRadixIcon({
                                type: icon,
                                size: "var(--svg-width)",
                            })
                        )
                    );
                }
            };

            addSocial(github, "githubLogo");
            addSocial(twitter, "twitterLogo");
            addSocial(personal, "link2");

            return h.div({ style: styles.socials }, socials);
        }
    }
);
