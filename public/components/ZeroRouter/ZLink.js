import Zero, { ZeroUtils } from "/lib/Zero.js";
import ZRouter from "./ZRouter.js";

const h = ZeroUtils.jsh;

Zero.define(
    "z-link",
    class ZLink extends Zero {
        render() {
            const { href } = this.props;

            return h.span(
                {
                    href,
                    onClick: (e) => {
                        if (
                            href &&
                            !(href.startsWith("#") || href.startsWith("http"))
                        ) {
                            e.preventDefault();

                            ZRouter.navigateTo(href);

                            return false;
                        }
                    },
                },
                h.slot()
            );
        }
    }
);
