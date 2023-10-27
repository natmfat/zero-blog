import ZeroServerUtils from "./ZeroServerUtils";

const OPEN_DEL = "{{";
const CLOSE_DEL = "}}";

export default class ZeroRenderer {
    constructor(content = "", data = {}) {
        this.content = content;
        this.locals = data;
    }

    evaluate(sectionContent) {
        // handle import statements (read file and return as template string)
        const importRegex = /import\((.*)\)/g;
        const importMatch = importRegex.exec(sectionContent);
        if (importMatch) {
            const [_, importPath] = importMatch;

            try {
                const moduleContent = new ZeroRenderer(
                    ZeroServerUtils.readFile(
                        importPath.substring(1, importPath.length - 1)
                    ),
                    this.locals
                ).compile();

                return this.evaluate(
                    sectionContent.replace(
                        importRegex,
                        "`" + moduleContent + "`"
                    )
                );
            } catch (e) {
                return e;
            }
        } else if (
            !sectionContent.startsWith("return") &&
            sectionContent.trim().split("\n").length === 1
        ) {
            // only auto add return on single vars
            return this.evaluate(`return ${sectionContent}`);
        }

        // otherwise run the code as a function, anything returned will be rendered
        return new Function(`with(this.locals) { 
            try {
                ${sectionContent}
            } catch(e) {
                return e;
            }
        }`).call(this);
    }

    compile() {
        let content = "";
        let currentIndex = 0;
        while (currentIndex < this.content.length) {
            // simple substring methods to get {{ content }} and "compile" it
            const startIndex = this.content.indexOf(OPEN_DEL, currentIndex);
            const endIndex = this.content.indexOf(CLOSE_DEL, currentIndex);

            if (startIndex === -1 || endIndex === -1) {
                content += this.content.substring(currentIndex);
                break;
            }

            const sectionContent = this.evaluate(
                this.content
                    .substring(startIndex + OPEN_DEL.length, endIndex)
                    .trim()
            );

            content += this.content.substring(currentIndex, startIndex);

            if (sectionContent) {
                content += sectionContent;
            }

            currentIndex = endIndex + CLOSE_DEL.length;
        }

        return content;
    }
}
