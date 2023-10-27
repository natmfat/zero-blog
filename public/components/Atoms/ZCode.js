import Zero, { ZeroUtils } from "/lib/Zero.js";
const { jsh: h } = ZeroUtils;

const htmlRegex = {
    string1: /"(.*?)"/g,
    string2: /'(.*?)'/g,

    htmlTag: /(&lt;[^\&]*&gt;)/g,
    htmlComment: /(&lt;!--.*?--&gt;)/g,
};

const cssRegex = {
    comment1: /(\/\*.*\*\/)/g,
    cssProperty: / (.*?):/g,
    cssNumber: /\b(\d+)/g,
    cssUnit: /(rem|px|%)/g,
    cssBracket: /({|})/g,
    cssParen: /(\(|\))/g,
};

const JsRegex = {
    string1: /"(.*?)"/g,
    string2: /'(.*?)'/g,

    classes: /\s?(class) /g,

    jsKeywords:
        /\b(new|var|let|const|extends|if|do|function|return|export|from|import|default|constructor|while|switch|for|foreach|in|continue|break|typeof|instanceof)(?=[^\w])/g,
    jsClasses:
        /\b(document|window|Array|String|Object|Number|Infinity|NaN|this|super|null|undefined|true|false|alert|prompt|confirm|console|log|setTimeout|setInterval|clearTimeout|clearInterval|\$)(?=[^\w])/g,

    jsMethods: /\.(.*?)(?=[^\w])/g,

    cssNumber: /\b(\d+)/g,

    comment1: /(\/\*.*\*\/)/g,
    comment2: /(\/\/.*)/g,
};

Zero.define(
    "z-code",
    class ZCode extends Zero {
        style = `
            pre {
                border-radius: 0.75rem;
                padding: 1rem;
                background-color: var(--c-editor-bg);
                color: #fff;
                max-width: 100%;
                overflow-x: auto;
                white-space: pre-wrap;
                word-break: break-all;
            }

            .string1, .string2 {
                color: var(--c-editor-string);
            }

            .string1 *, .string2 * {
                color: var(--c-editor-string);
            }

            .string1::before,
            .string1::after {
                content: '"';
            }

            .string2::before,
            .string2::after {
                content: "'";
            }

            .comment1, .comment2, .htmlComment {
                color: var(--c-editor-comment);
            }

            .comment1 *, .comment2 *, .htmlComment *,
            .comment1 *::after, .comment2 *::after, .htmlComment *::after,
            .comment1 *::before, .comment2 *::before, .htmlComment *::before {
                color: var(--c-editor-comment) !important;
            }
            
            .jsKeywords, .classes, .cssUnit {
                color: var(--c-editor-keyword);
            }

            .classes::before, .classes::after {
                content: " ";
            }

            .jsConstants, .jsClasses {
                color: var(--c-editor-classes);
            }

            .jsMethods {
                color: var(--c-editor-methods); 
            }

            .jsMethods::before {
                content: ".";
                color: #fff;
            }

            .htmlTag {
                color: var(--c-editor-html);
            }

            .cssVariable {
                color: var(--c-editor-css-var);
            }

            .cssVariable::before {
                content: "--";
            }

            .cssProperty, .cssValue, .cssNumber {
                color: var(--c-editor-classes);
            }

            .cssProperty::after {
                content: ":";
                color: #fff;
            }

            .cssBracket {
                color: var(--c-editor-css-bracket);
            }

            .cssParen {
                color: var(--c-editor-css-paren);
            }
        `;

        static compileCode(code, regex = {}) {
            code = code.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");

            Object.keys(regex).forEach((key) => {
                code = code.replace(
                    regex[key],
                    `<span class="${key}">$1</span>`
                );
            });

            return code;
        }

        getRegex() {
            const regexMap = {
                css: cssRegex,
                html: htmlRegex,
                js: JsRegex,
                javascript: JsRegex,
            };

            const type = this.dataset.type?.toString().toLowerCase();
            if (regexMap.hasOwnProperty(type)) {
                return regexMap[type];
            }
        }

        render() {
            this.getRegex();
            return h.pre(
                {},
                h.code({
                    __innerHTML: ZCode.compileCode(
                        this.textContent,
                        this.getRegex()
                    ),
                })
            );
        }
    }
);
