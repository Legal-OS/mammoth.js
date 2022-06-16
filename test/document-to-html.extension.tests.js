var assert = require("assert");

var documents = require("../lib/documents");
var documentToHtml = require("../lib/document-to-html");
var DocumentConverter = documentToHtml.DocumentConverter;
var test = require("./test")(module);


var testcasesForTable = [
    {description: "supports dxa", docxTableWidth: {width: "100", widthUnit: "dxa"},     htmlTableWidth: "width: 5pt;"},
    {description: "supports pct", docxTableWidth: {width: "2000", widthUnit: "pct"},    htmlTableWidth: "width: 40%;"},
    {description: "ignores auto", docxTableWidth: {widthUnit: "auto"},                  htmlTableWidth: ""},
    {description: "ignores nil ", docxTableWidth: {widthUnit: "nil"},                   htmlTableWidth: ""}
];

testcasesForTable.forEach(function(testcase) {
    test('docx table width mapping ' + testcase.description, function() {
        var table = new documents.Table([
            new documents.TableRow([
                new documents.TableCell([paragraphOfText("Top left")]),
                new documents.TableCell([paragraphOfText("Top right")])
            ]),
            new documents.TableRow([
                new documents.TableCell([paragraphOfText("Bottom left")]),
                new documents.TableCell([paragraphOfText("Bottom right")])
            ])
        ], testcase.docxTableWidth);
        var converter = new DocumentConverter();

        return converter.convertToHtml(table).then(function(result) {
            var expectedHtml = '<table style="border-collapse: collapse;' + testcase.htmlTableWidth + '">' +
                '<tr>' +
                '<td><p>Top left</p></td>' +
                '<td><p>Top right</p></td>' +
                '</tr><tr>' +
                '<td><p>Bottom left</p></td>' +
                '<td><p>Bottom right</p></td>' +
                '</tr></table>';

            assert.equal(result.value, expectedHtml);
        });
    });
});


var testcasesForCell = [
    {description: "supports dxa", docxCellWidth: {width: "100", unit: "dxa"},   cssCellWidth: ' style="width: 5pt;"'},
    {description: "supports pct", docxCellWidth: {width: "2000", unit: "pct"},  cssCellWidth: ' style="width: 40%;"'},
    {description: "ignores auto", docxCellWidth: {unit: "auto"},                cssCellWidth: ""},
    {description: "ignores nil ", docxCellWidth: {unit: "nil"},                 cssCellWidth: ""}
];

testcasesForCell.forEach(function(testcase) {
    test('docx table cell width mapping ' + testcase.description, function() {
        var table = new documents.Table([
            new documents.TableRow([
                new documents.TableCell([paragraphOfText("Top left")], {width: testcase.docxCellWidth}),
                new documents.TableCell([paragraphOfText("Top right")])
            ]),
            new documents.TableRow([
                new documents.TableCell([paragraphOfText("Bottom left")]),
                new documents.TableCell([paragraphOfText("Bottom right")])
            ])
        ]);
        var converter = new DocumentConverter();

        return converter.convertToHtml(table).then(function(result) {
            var expectedHtml = '<table style="border-collapse: collapse;">' +
                '<tr>' +
                '<td' + testcase.cssCellWidth + '><p>Top left</p></td>' +
                '<td><p>Top right</p></td>' +
                '</tr><tr>' +
                '<td><p>Bottom left</p></td>' +
                '<td><p>Bottom right</p></td>' +
                '</tr></table>';

            assert.equal(result.value, expectedHtml);
        });
    });
});


function paragraphOfText(text, styleId, styleName) {
    var run = runOfText(text);
    return new documents.Paragraph([run], {
        styleId: styleId,
        styleName: styleName
    });
}

function runOfText(text, properties) {
    var textElement = new documents.Text(text);
    return new documents.Run([textElement], properties);
}
