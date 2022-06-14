var assert = require("assert");
var path = require("path");
var mammoth = require("../lib");
var test = require("./test")(module);

test('alignments, indent and spacing', function() {
    var docxPath = path.join(__dirname, "test-data/text-alignment-indent-spacing.docx");
    return mammoth.convertToHtml({path: docxPath}).then(function(result) {
        assert.equal(result.value,
            '<p>default alignment left</p>' +
            '<p style="text-align: right;">alignment right</p>' +
            '<p style="text-align: center;">alignment center</p>' +
            '<p style="text-align: justify;">alignment justify Text</p>' +
            '<p style="text-indent: 56.7pt;">first line indent<br />second line without indent</p>' +
            '<p style="padding-left: 56.7pt;text-indent: -56.7pt;margin-left: 56.7pt;">hanging indent. first line without indent<br />second line with indent</p>' +
            '<p style="margin-left: 56.7pt;margin-right: 113.4pt;">paragraph indent left and right</p>' +
            '<p style="margin-right: 113.4pt;line-height: 3;">spacing line rule multiple (3)</p>' +
            '<p style="margin-right: 113.4pt;line-height: 24px;">spacing line rule exactly (24pt)</p>' +
            '<p style="margin-right: 113.4pt;line-height: 12px;">spacing line rule at least (12pt)</p>' +
            '<p style="margin-right: 113.4pt;margin-top: 42pt;margin-bottom: 42pt;">spacing before and after (42pt)</p>'
        );

        assert.deepEqual(result.messages, []);
    });
});

test('numberings are correctly converted to ordered lists', function() {
    var docxPath = path.join(__dirname, "test-data/numberings.docx");
    return mammoth.convertToHtml({path: docxPath}).then(function(result) {
        assert.equal(result.value,
            '<ol type="1"><li>Decimal A</li><li>Decimal B</li><li>Decimal C</li></ol>' +
            '<ol type="I"><li>Upper Roman A</li><li>Upper Roman B</li><li>Upper Roman C</li></ol>' +
            '<ol type="i"><li>Lower Roman A</li><li>Lower Roman B</li><li>Lower Roman C</li></ol>' +
            '<ol type="A"><li>Upper Letter A</li><li>Upper Letter B</li><li>Upper Letter C</li></ol>' +
            '<ol type="a"><li>Lower Letter A</li><li>Lower Letter B</li><li>Lower Letter C</li></ol>');
        assert.deepEqual(result.messages, []);
    });
});

test('formatted text is converted including color, bg color, font size and font family', function() {
    var docxPath = path.join(__dirname, "test-data/text-color-and-font-style.docx");
    return mammoth.convertToHtml({path: docxPath}).then(function(result) {
        assert.equal(result.value, '<p><span style="background-color:yellow">Walking</span> <span style="font-size:28pt">on </span><span style="font-family:Times New Roman">imported</span> <font color="#FF0000">air</font></p>');
        assert.deepEqual(result.messages, []);
    });
});

test('formatted word tables are converted to html tables', function() {
    var docxPath = path.join(__dirname, "test-data/tables-extensions.docx");
    return mammoth.convertToHtml({path: docxPath}).then(function(result) {
        var expectedHtml = '<p>Above</p>' +
            '<table style="border-collapse: collapse;">' +
            '<tr><td style="border-top-style:none; border-bottom-style:solid; border-bottom-width:6pt; border-bottom-color:#FFC000; border-left-style:dotted; border-left-width:3pt; border-left-color:#C0504D; border-right-style:double; border-right-width:0.5pt; border-right-color:#000000; width: 231.05pt;"><p>Top left</p></td><td style="border-bottom-style:solid; border-bottom-width:0.5pt; border-left-style:double; border-left-width:0.5pt; border-left-color:#000000; width: 231.05pt;"><p>Top right</p></td></tr>' +
            '<tr><td style="border-top-style:solid; border-top-width:6pt; border-top-color:#FFC000; width: 231.05pt;"><p>Bottom left</p></td><td style="border-bottom-style:none; border-right-style:solid; border-right-width:6pt; border-right-color:#C0504D; width: 231.05pt;"><p>Bottom right</p></td></tr>' +
            '</table>' +
            '<p>Below</p>';
        assert.equal(result.value, expectedHtml);
        assert.deepEqual(result.messages, []);
    });
});
