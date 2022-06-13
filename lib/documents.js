var _ = require("underscore");

var types = exports.types = {
    document: "document",
    paragraph: "paragraph",
    run: "run",
    text: "text",
    tab: "tab",
    hyperlink: "hyperlink",
    noteReference: "noteReference",
    image: "image",
    note: "note",
    commentReference: "commentReference",
    comment: "comment",
    table: "table",
    tableRow: "tableRow",
    tableCell: "tableCell",
    "break": "break",
    bookmarkStart: "bookmarkStart"
};

function Document(children, options) {
    options = options || {};
    return {
        type: types.document,
        children: children,
        notes: options.notes || new Notes({}),
        comments: options.comments || []
    };
}

function Paragraph(children, properties) {
    properties = properties || {};
    var indent = properties.indent || {};
    var spacing = properties.spacing || {};
    return {
        type: types.paragraph,
        children: children,
        styleId: properties.styleId || null,
        styleName: properties.styleName || null,
        numbering: properties.numbering || null,
        alignment: properties.alignment || null,
        indent: {
            start: indent.start || null,
            end: indent.end || null,
            firstLine: indent.firstLine || null,
            hanging: indent.hanging || null
        },
        spacing: {
            after: spacing.after || null,
            before: spacing.before || null,
            line: spacing.line || null,
            lineRule: spacing.lineRule || null,
            beforeAutospacing: spacing.beforeAutospacing || null,
            afterAutospacing: spacing.afterAutospacing || null
        }
    };
}

function Run(children, properties) {
    properties = properties || {};
    return {
        type: types.run,
        children: children,
        styleId: properties.styleId || null,
        styleName: properties.styleName || null,
        isBold: properties.isBold,
        isUnderline: properties.isUnderline,
        isItalic: properties.isItalic,
        isStrikethrough: properties.isStrikethrough,
        isAllCaps: properties.isAllCaps,
        isSmallCaps: properties.isSmallCaps,
        verticalAlignment: properties.verticalAlignment || verticalAlignment.baseline,
        font: properties.font || null,
        fontSize: properties.fontSize || null,
        color: properties.color ? '#' + properties.color : null,
        highlight: properties.highlight ? properties.highlight : null,
        shading: properties.shading ? '#' + properties.shading : null
    };
}

var verticalAlignment = {
    baseline: "baseline",
    superscript: "superscript",
    subscript: "subscript"
};

function Text(value) {
    return {
        type: types.text,
        value: value
    };
}

function Tab() {
    return {
        type: types.tab
    };
}

function Hyperlink(children, options) {
    return {
        type: types.hyperlink,
        children: children,
        href: options.href,
        anchor: options.anchor,
        targetFrame: options.targetFrame
    };
}

function NoteReference(options) {
    return {
        type: types.noteReference,
        noteType: options.noteType,
        noteId: options.noteId
    };
}

function Notes(notes) {
    this._notes = _.indexBy(notes, function(note) {
        return noteKey(note.noteType, note.noteId);
    });
}

Notes.prototype.resolve = function(reference) {
    return this.findNoteByKey(noteKey(reference.noteType, reference.noteId));
};

Notes.prototype.findNoteByKey = function(key) {
    return this._notes[key] || null;
};

function Note(options) {
    return {
        type: types.note,
        noteType: options.noteType,
        noteId: options.noteId,
        body: options.body
    };
}

function commentReference(options) {
    return {
        type: types.commentReference,
        commentId: options.commentId
    };
}

function comment(options) {
    return {
        type: types.comment,
        commentId: options.commentId,
        body: options.body,
        authorName: options.authorName,
        authorInitials: options.authorInitials
    };
}

function noteKey(noteType, id) {
    return noteType + "-" + id;
}

function Image(options) {
    return {
        type: types.image,
        read: options.readImage,
        altText: options.altText,
        contentType: options.contentType
    };
}

function Table(children, properties) {
    properties = properties || {};
    return {
        type: types.table,
        children: children,
        styleId: properties.styleId || null,
        styleName: properties.styleName || null,
        width: properties.width,
        widthUnit: properties.widthUnit
    };
}

function TableRow(children, options) {
    options = options || {};
    return {
        type: types.tableRow,
        children: children,
        isHeader: options.isHeader || false
    };
}

function TableCell(children, options) {
    options = options || {};
    return {
        type: types.tableCell,
        children: children,
        colSpan: options.colSpan == null ? 1 : options.colSpan,
        rowSpan: options.rowSpan == null ? 1 : options.rowSpan,
        width: {
            value: options.width && options.width.width,
            unit: options.width && options.width.unit // nil, pct, dxa, auto
        },
        borders: {
            left: {
                lineType: options.borders && options.borders.left && options.borders.left.lineType,
                size: options.borders && options.borders.left && options.borders.left.size,
                space: options.borders && options.borders.left && options.borders.left.space,
                color: options.borders && options.borders.left && options.borders.left.color
            },
            right: {
                lineType: options.borders && options.borders.right && options.borders.right.lineType,
                size: options.borders && options.borders.right && options.borders.right.size,
                space: options.borders && options.borders.right && options.borders.right.space,
                color: options.borders && options.borders.right && options.borders.right.color
            },
            top: {
                lineType: options.borders && options.borders.top && options.borders.top.lineType,
                size: options.borders && options.borders.top && options.borders.top.size,
                space: options.borders && options.borders.top && options.borders.top.space,
                color: options.borders && options.borders.top && options.borders.top.color
            },
            bottom: {
                lineType: options.borders && options.borders.bottom && options.borders.bottom.lineType,
                size: options.borders && options.borders.bottom && options.borders.bottom.size,
                space: options.borders && options.borders.bottom && options.borders.bottom.space,
                color: options.borders && options.borders.bottom && options.borders.bottom.color
            }
        }
    };
}

function Break(breakType) {
    return {
        type: types["break"],
        breakType: breakType
    };
}

function BookmarkStart(options) {
    return {
        type: types.bookmarkStart,
        name: options.name
    };
}

exports.document = exports.Document = Document;
exports.paragraph = exports.Paragraph = Paragraph;
exports.run = exports.Run = Run;
exports.Text = Text;
exports.tab = exports.Tab = Tab;
exports.Hyperlink = Hyperlink;
exports.noteReference = exports.NoteReference = NoteReference;
exports.Notes = Notes;
exports.Note = Note;
exports.commentReference = commentReference;
exports.comment = comment;
exports.Image = Image;
exports.Table = Table;
exports.TableRow = TableRow;
exports.TableCell = TableCell;
exports.lineBreak = Break("line");
exports.pageBreak = Break("page");
exports.columnBreak = Break("column");
exports.BookmarkStart = BookmarkStart;

exports.verticalAlignment = verticalAlignment;
