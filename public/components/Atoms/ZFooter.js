import Zero, { ZeroUtils } from "/lib/Zero.js";
import globalStyles from "/globalStyles.js";

const h = ZeroUtils.jsh;
const styles = {
    footerDiv: {
        ...globalStyles.layoutWidthLarge,
        paddingTop: "2rem",
        paddingBottom: "2rem",
        color: "var(--c-gray)",
    },
};

Zero.define(
    "z-footer",
    class ZFooter extends Zero {
        ref = {
            animationId: 0,
        };

        style = `
            a {
                color: var(--c-body);
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        `;

        fixFooter() {
            const footer = ZeroUtils.$(this.shadowRoot, "footer");

            Object.assign(footer.style, {
                position: "static",
            });

            if (footer.offsetTop + footer.offsetHeight < window.innerHeight) {
                Object.assign(footer.style, {
                    position: "fixed",
                    bottom: "0",
                });
            }
        }

        mount() {
            const animate = () => {
                // keep footer at bottom if not enough content
                this.fixFooter();
                this.ref.animationId = requestAnimationFrame(animate);
            };

            animate();
        }

        unmount() {
            cancelAnimationFrame(this.ref.animationId);
        }

        render() {
            return h.footer(
                { style: globalStyles.bgWrapper },
                h.div(
                    { style: styles.footerDiv },
                    "Created by ",
                    h.a(
                        {
                            href: "https://natmfat.com",
                            target: "_blank",
                            rel: "noreferrer",
                        },
                        "Nathan"
                    ),
                    "."
                )
            );
        }
    }
);
