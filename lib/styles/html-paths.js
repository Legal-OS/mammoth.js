var _ = require("underscore");
var clone = require('clone');
var html = require("../html");

exports.topLevelElement = topLevelElement;
exports.elements = elements;
exports.element = element;
exports.HtmlPath = HtmlPath;

function topLevelElement(tagName, attributes) {
    return elements([element(tagName, attributes, {fresh: true})]);
}

function elements(elementStyles) {
    return new HtmlPath(elementStyles.map(function(elementStyle) {
        if (_.isString(elementStyle)) {
            return element(elementStyle);
        } else {
            return elementStyle;
        }
    }));
}

function HtmlPath(elements) {
    this._elements = elements;
}

HtmlPath.prototype.wrap = function wrap(children) {
    var result = children();
    for (var index = this._elements.length - 1; index >= 0; index--) {
        result = this._elements[index].wrapNodes(result);
    }
    return result;
};

HtmlPath.prototype.clone = function clone(children) {
    var result = [];
    for (var index = 0; index < this._elements.length; index++) {
        result.push(this._elements[index].clone());
    }
    return new HtmlPath(result);
};

function element(tagName, attributes, options) {
    options = options || {};
    return new Element(tagName, attributes, options);
}

function Element(tagName, attributes, options) {
    var tagNames = {};
    if (_.isArray(tagName)) {
        tagName.forEach(function(tagName) {
            tagNames[tagName] = true;
        });
        tagName = tagName[0];
    } else {
        tagNames[tagName] = true;
    }

    this.tagName = tagName;
    this.tagNames = tagNames;
    this.attributes = attributes || {};
    this.fresh = (options || {}).fresh;
    this.separator = (options || {}).separator;
}

Element.prototype.clone = function() {
    return new Element(clone(Object.keys(this.tagNames)), clone(this.attributes), clone({fresh: this.fresh, separator: this.separator}));
};

Element.prototype.matchesElement = function(element) {
    return this.tagNames[element.tagName] && _.isEqual(this.attributes || {}, element.attributes || {});
};

Element.prototype.wrap = function wrap(generateNodes) {
    return this.wrapNodes(generateNodes());
};

Element.prototype.wrapNodes = function wrapNodes(nodes) {
    return [html.elementWithTag(this, nodes)];
};

exports.empty = elements([]);
exports.ignore = {
    wrap: function() {
        return [];
    }
};
