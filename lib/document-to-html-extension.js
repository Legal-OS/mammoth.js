/**
 * This module contains all extensions made to mammoth.js convertions to html/css.
 */

var _ = require("underscore");
var htmlPaths = require("./styles/html-paths");

exports.withAlignmentIndentAndSpacing = withAlignmentIndentAndSpacing;
exports.withNumberings = withNumberings;
exports.withBackgroundColorAndFontStyle = withBackgroundColorAndFontStyle;
exports.withBorders = withBorders;

/**
 * Extension supporting alignment, indent and spacing.
 *
 * @param {htmlPaths.HtmlPath} htmlPath the html path to be extend
 * @param {htmlPaths.Element} element the element containing the style infos
 * @returns an updated html path containing the styles infos from element
 */
function withAlignmentIndentAndSpacing(htmlPath, element) {

    var attributes = _.extend({}, (htmlPath && htmlPath._elements && htmlPath._elements.length && htmlPath._elements[0] && htmlPath._elements[0].attributes) || {});
    var cssStyle = ((attributes && attributes.style && attributes.style + ";") || "");
    if (element.alignment) {
        var alignment = element.alignment;
        if (alignment === "both") {
            alignment = "justify";
        }
        cssStyle = cssStyle + "text-align: " + alignment + ";";
    }
    if (element.indent) {
        if (element.indent.firstLine !== null && element.indent.firstLine !== undefined) {
            cssStyle = cssStyle + "text-indent: " + parseInt(element.indent.firstLine, 10) / 20 + "pt;";
        }
        if (element.indent.hanging !== null && element.indent.hanging !== undefined) {
            cssStyle = cssStyle + "padding-left: " + parseInt(element.indent.hanging, 10) / 20 + "pt;";
            cssStyle = cssStyle + "text-indent: -" + parseInt(element.indent.hanging, 10) / 20 + "pt;";
        }
        if (element.indent.start !== null && element.indent.start !== undefined) {
            cssStyle = cssStyle + "margin-left: " + parseInt(element.indent.start, 10) / 20 + "pt;";
        }
        if (element.indent.end !== null && element.indent.end !== undefined) {
            cssStyle = cssStyle + "margin-right: " + parseInt(element.indent.end, 10) / 20 + "pt;";
        }
    }
    if (element.spacing) {
        if (element.spacing.line !== null && element.spacing.line !== undefined) {
            if (element.spacing.lineRule !== null && (element.spacing.lineRule === "atLeast" || element.spacing.lineRule === "exactly")) {
                cssStyle = cssStyle + "line-height: " + (element.spacing.line / 20) + "px;";
            } else {
                cssStyle = cssStyle + "line-height: " + (element.spacing.line / 240) + ";";
            }
        }
        if (element.spacing.before !== null && element.spacing.before !== undefined) {
            cssStyle = cssStyle + "margin-top: " + element.spacing.before / 20 + "pt;";
        }
        if (element.spacing.after !== null && element.spacing.after !== undefined) {
            cssStyle = cssStyle + "margin-bottom: " + element.spacing.after / 20 + "pt;";
        }
    }

    if (cssStyle && cssStyle !== "") {
        htmlPath = htmlPath.clone();
        htmlPath._elements[0].attributes = _.extend(attributes, {
            style: (htmlPath._elements[0].attributes && htmlPath._elements[0].attributes.style || "") + cssStyle
        });
    }
    return htmlPath;
}

/**
 * Extension supporting numberings.
 *
 * @param {styleRule} style the html path to be extend
 * @param {htmlPaths.Element} element the element containing the numbering infos
 * @returns an updated html path containing the numbering infos from element
 */
function withNumberings(style, element) {
    // source for numbering: https://github.com/sbabushkin/mammoth-colors.js/commit/9c5a34fca35ce21b4e92708c1bc6332060ae121b
    var listTypes = {
        "decimal": "1",
        "upperRoman": "I",
        "lowerRoman": "i",
        "upperLetter": "A",
        "lowerLetter": "a"
    };

    var htmlPath = style.to.clone();
    for (var i in htmlPath._elements) {
        if (htmlPath._elements[i].tagName == 'ol') {
            if (element.numbering && element.numbering.format) {
                htmlPath._elements[i].attributes['type'] = listTypes[element.numbering.format];
            }
        }
    }

    return htmlPath;
}

/**
 * Extension supporting background color and font family+size.
 *
 * @param {htmlPaths.HtmlPath[]} paths the html paths to be extend
 * @param {styleRule} run the run element containing style infos
 * @returns an updated html path array containing additional html elements
 */
function withBackgroundColorAndFontStyle(paths, run) {
    if (run.color) {
        paths.push(htmlPaths.element('font', {color: run.color}, {fresh: false}));
    }
    if (run.shading || run.highlight) {
        paths.push(htmlPaths.element('span', {style: "background-color:" + (run.shading || run.highlight)}, {fresh: false}));
    }
    if (run.font) {
        paths.push(htmlPaths.element('span', {style: "font-family:" + run.font}, {fresh: false}));
    }
    if (run.fontSize) {
        var fontSize = run.fontSize;
        if (!isNaN(fontSize)) {
            fontSize += "pt";
        }
        paths.push(htmlPaths.element('span', {style: "font-size:" + fontSize}, {fresh: false}));
    }
}

/**
 * Extension supporting borders.
 *
 * @param {htmlPaths.Element} element the element containing the style infos
 * @param {htmlAttributes} attributes the html attributes object to be extended with border infos
 */
function withBorders(element, attributes) {
    var cssStyle = "";
    var lineTypeMapping = {
        "nil": "none",
        "single": "solid",
        "dotted": "dotted",
        "dashed": "dashed",
        "double": "double",
        "triple": "double"
    };
    if (element.borders && Object.keys(element.borders) !== 0) {
        cssStyle = ["top", "bottom", "left", "right"].reduce(function cssReducer(cssAccumulator, side) {
            var border =  element.borders[side];

            if (border !== undefined) {

                if (border.lineType) {
                    cssAccumulator += "border-" + side + "-style:" + (lineTypeMapping[border.lineType] || "solid") + "; ";
                }
                if (border.size) {
                    cssAccumulator += "border-" + side + "-width:" + (parseInt(border.size, 10) / 8 || 1) + "pt; ";
                }
                if (border.space) {
                    cssAccumulator += "padding-" + side + ":" + (parseInt(border.space, 10) / 20 || 1) + "px; ";
                }
                if (border.color && border.color !== "auto") {
                    cssAccumulator += "border-" + side + "-color:" + "#" + border.color + "; ";
                }
            }
            return cssAccumulator;
        }, "");
        if (cssStyle !== "") {
            attributes["style"] = cssStyle;
        }
    }
}
