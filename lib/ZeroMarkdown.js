/*
the smart move would have been to use Regex, but I am not very smart and I feel like a real programmer!
*/
export default class Markdown {
    constructor(input = "") {
        this.currentIndex = 0;
        this.metadata = {};

        this.lines = Markdown.preprocess(input);
        this.tokens = this.tokenize();
    }

    // split text into lines (but don't get rid of empty lines)
    static preprocess(input, delimiter = "\n") {
        return input
            .trim()
            .split(delimiter)
            .map((t) => (t.trim() === "" ? " " : t));
    }

    // get the current line & trim if necessary
    currentLine(formatted = true) {
        const line = this.lines[this.currentIndex];
        return formatted && line ? line.trim() : line;
    }

    // get the next line & trim if necessary
    nextLine(formatted = true) {
        this.currentIndex++;
        const line = this.lines[this.currentIndex];
        return formatted && line ? line.trim() : line;
    }

    // peek at the next line without advancing the index (& trim if necessary)
    peekLine(formatted = true) {
        const line = this.lines[this.currentIndex + 1];
        return formatted && line ? line.trim() : line;
    }

    // parse token contents
    tokenize() {
        const tokens = [];
        while (this.currentIndex < this.lines.length) {
            const result = this.parseLine(this.currentLine());
            if (result) {
                tokens.push(result);
            }

            this.currentIndex++;
        }

        tokens.push(this.createToken("END", "END"));

        return tokens;
    }

    // helper to create a token
    createToken(type, content, props = {}) {
        return {
            type,
            content: this.parseContent(content),
            props,
        };
    }

    // this really really really needs to be refactored
    // manages inline styles by creating a parser in a parser lmao
    parseContent(content) {
        let currentIndex = 0;
        let renderedContent = "";

        while (currentIndex < content.length) {
            const currentChar = content[currentIndex];
            let completePassFlag = false;
            let prevIndex = currentIndex;

            // expect the current char to be something, otherwise style is "broken" and should not be parsed
            const failed = (char) => {
                if (content[currentIndex] !== char) {
                    renderedContent += content.substring(
                        prevIndex,
                        currentIndex + 1
                    );

                    completePassFlag = true;
                    return true;
                }

                return false;
            };

            // handle link
            handleLink: if (currentChar === "[") {
                let linkContent = "";
                let linkSrc = "";

                while (
                    content[currentIndex + 1] !== "]" &&
                    content[currentIndex + 1]
                ) {
                    currentIndex++;
                    linkContent += content[currentIndex];
                }

                // skip over closing ]
                currentIndex += 2;

                // require the next character to be an opening ()
                if (failed("(")) {
                    break handleLink;
                }

                while (
                    content[currentIndex + 1] !== ")" &&
                    content[currentIndex + 1]
                ) {
                    currentIndex++;
                    linkSrc += content[currentIndex];
                }

                currentIndex++; // skip over closing brace
                renderedContent += `<a href="${linkSrc}">${linkContent}</a>`;

                completePassFlag = true;
            }

            // handle image
            handleImage: if (currentChar === "!" && !completePassFlag) {
                let imageContent = "";
                let imageSrc = "";

                currentIndex++;
                if (failed("[")) {
                    break handleImage;
                }

                while (content[currentIndex + 1] !== "]") {
                    currentIndex++;
                    imageContent += content[currentIndex];
                }

                // skip over closing ]
                currentIndex += 2;
                if (failed("(")) {
                    break handleImage;
                }

                while (content[currentIndex + 1] !== ")") {
                    currentIndex++;
                    imageSrc += content[currentIndex];
                }

                currentIndex++; // skip over closing brace
                renderedContent += `<img src="${imageSrc}" alt="${imageContent}" />`;
                completePassFlag = true;
            }

            // handle italics
            handleItalics: if (currentChar === "_" && !completePassFlag) {
                let italicsContent = "";

                while (
                    content[currentIndex + 1] !== "_" &&
                    content[currentIndex + 1]
                ) {
                    currentIndex++;
                    italicsContent += content[currentIndex];
                }

                currentIndex++;
                if (failed("_")) {
                    break handleItalics;
                }

                renderedContent += `<i>${italicsContent}</i>`;
                completePassFlag = true;
            }

            // handle inline code
            handleInlineCode: if (currentChar === "`" && !completePassFlag) {
                let codeContent = "";

                while (
                    content[currentIndex + 1] !== "`" &&
                    content[currentIndex + 1]
                ) {
                    currentIndex++;
                    codeContent += content[currentIndex];
                }

                currentIndex++;
                if (failed("`")) {
                    break handleInlineCode;
                }

                renderedContent += `<code data-type="inline">${codeContent}</code>`;
                completePassFlag = true;
            }

            // handle bold
            handleBold: if (currentChar === "*" && !completePassFlag) {
                let boldContent = "";

                currentIndex++;
                if (failed("*")) {
                    break handleBold;
                }

                while (
                    content[currentIndex + 1] !== "*" &&
                    content[currentIndex + 1]
                ) {
                    currentIndex++;
                    boldContent += content[currentIndex];
                }

                currentIndex++;
                if (failed("*")) {
                    break handleBold;
                }

                currentIndex++;
                if (failed("*")) {
                    break handleBold;
                }

                renderedContent += `<b>${boldContent}</b>`;
                completePassFlag = true;
            }

            if (!completePassFlag) {
                renderedContent += currentChar;
            }

            currentIndex++;
        }

        return renderedContent;
    }

    // manages overall line styles
    parseLine(currentLine) {
        // handle metadata
        if (currentLine === "---") {
            while (this.peekLine() !== "---" && this.peekLine()) {
                const [key, ...values] = this.nextLine().split(":");
                this.metadata[key.trim()] = values.join(" ").trim();
            }

            // skip over ending ---
            this.nextLine();
            return null;
        }

        // handle code blocks
        else if (currentLine.startsWith("```")) {
            let code = [];
            let codeType = currentLine.substring(3).trim();

            while (this.peekLine() !== "```" && this.peekLine(false)) {
                code.push(this.nextLine(false));
            }

            this.nextLine();

            const compiledCode = code
                .join("\n")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            if (codeType.length > 0) {
                return this.createToken("z-code", compiledCode, {
                    "data-type": codeType,
                });
            }

            return this.createToken("z-code", compiledCode);
        }

        // headings
        else if (currentLine.startsWith("#")) {
            const heading = currentLine.split(" ").shift();
            const size = heading.length;

            // ensure space is between # and content
            if (
                heading.split("").filter((char) => char === "#").length == size
            ) {
                return this.createToken(
                    `h${size}`,
                    currentLine.substring(size).trimStart()
                );
            } else {
                return this.createToken("p", currentLine);
            }
        }

        // block quote
        else if (currentLine.startsWith(">")) {
            return this.createToken(
                "blockquote",
                currentLine.substring(1).trimStart()
            );
        }

        // unordered list
        else if (currentLine.startsWith("- ")) {
            return this.createToken("ul", currentLine.substring(1).trimStart());
        }

        // ordered list
        else if (Number.isInteger(parseInt(currentLine.split(".").shift()))) {
            const number = currentLine.split(".").shift();

            return this.createToken(
                "ol",
                currentLine.substring(number.length + 1).trimStart()
            );
        }

        return this.createToken("p", currentLine);
    }

    createElement(tag, innerHTML, props = {}) {
        let renderedProps = [];
        for (const [key, value] of Object.entries(props)) {
            renderedProps.push(`${key}="${value}"`);
        }

        const startingTag = `${tag} ${renderedProps.join(" ")}`.trim();
        return `<${startingTag}>${innerHTML}</${tag}>`;
    }

    render() {
        let html = "";
        let currentIndex = 0;

        renderLoop: while (currentIndex < this.tokens.length) {
            const currentToken = this.tokens[currentIndex];

            if (currentToken.type === "END" && currentToken.content === "END") {
                break renderLoop;
            } else if (currentToken.type === "ul") {
                html += "<ul>";

                while (this.tokens[currentIndex].type === "ul") {
                    html += this.createElement(
                        "li",
                        this.tokens[currentIndex].content,
                        this.tokens[currentIndex].props
                    );

                    currentIndex++;
                }

                currentIndex--;
                html += "</ul>";
            } else if (currentToken.type === "ol") {
                html += "<ol>";

                while (this.tokens[currentIndex].type === "ol") {
                    html += this.createElement(
                        "li",
                        this.tokens[currentIndex].content,
                        this.tokens[currentIndex].props
                    );

                    currentIndex++;
                }

                currentIndex--;
                html += "</ol>";
            } else if (currentToken.type === "blockquote") {
                const quotes = [];
                while (this.tokens[currentIndex].type === "blockquote") {
                    quotes.push(this.tokens[currentIndex].content);
                    currentIndex++;
                }

                currentIndex--;
                html += `<blockquote>${quotes.join("<br />")}</blockquote>`;
            } else if (currentToken.type === "code") {
                html += `<pre>${this.createElement(
                    currentToken.type,
                    currentToken.content,
                    this.tokens[currentIndex].props
                )}</pre>`;
            } else {
                html += this.createElement(
                    currentToken.type,
                    currentToken.content,
                    this.tokens[currentIndex].props
                );
            }

            currentIndex++;
        }

        return html;
    }
}
