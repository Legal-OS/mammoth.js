/**
 * This module contains all extensions made to mammoth.js body reader.
 */

var documents = require("../documents");

exports.readParagraphSpacing = readParagraphSpacing;
exports.TableCellWithBorders = TableCellWithBorders;

/**
 * Reads paragraph spacing from openxml.
 * @param element openxml element
 * @returns an object containing all pragraph spacing related properties
 */
function readParagraphSpacing(element) {
    return {
        after: element.attributes["w:after"],
        before: element.attributes["w:before"],
        line: element.attributes["w:line"],
        lineRule: element.attributes["w:lineRule"],
        beforeAutospacing: element.attributes["w:beforeAutospacing"],
        afterAutospacing: element.attributes["w:afterAutospacing"]
    };
}

/**
 * Constructs a table cell with borders. Is based on the original table cell.
 *
 * @param properties properties of the table cell
 * @param children children of the table cell
 * @param colSpan colspan setting
 * @returns an object representing a table cell
 */
function TableCellWithBorders(properties, children, colSpan) {
    var borders = properties.firstOrEmpty("w:tcBorders");
    var borderProperties = borders && readTableCellBorders(borders);

    var cellWidthProperties = readCellWidth(properties.firstOrEmpty("w:tcW"));

    var cell = documents.TableCell(children, {colSpan: colSpan, borders: borderProperties, width: cellWidthProperties});
    return cell;
}

function readCellWidth(element) {
    return {
        width: element.attributes["w:w"] && parseInt(element.attributes["w:w"], 10),
        unit: element.attributes["w:type"] // nil, pct, dxa, auto
    };
}

function readTableCellBorder(element) {
    return {
        /*

        *sigh*

        possible types are:
            nil
            none
            single
            thick
            double
            dotted
            dashed
            dot-dash
            dot-dot-dash
            triple
            thin-thick-small-gap
            thick-thin-small-gap
            thin-thick-thin-small-gap
            thin-thick-medium-gap
            thick-thin-medium-gap
            thin-thick-thin-medium-gap
            thin-thick-large-gap
            thick-thin-large-gap
            thin-thick-thin-large-gap
            wave
            double-wave
            dash-small-gap
            dash-dot-stroked
            three-d-emboss
            three-d-engrave
            outset
            inset
            apples
            arched-scallops
            baby-pacifier
            baby-rattle
            balloons-3-colors
            balloons-hot-air
            basic-black-dashes
            basic-black-dots
            basic-black-squares
            basic-thin-lines
            basic-white-dashes
            basic-white-dots
            basic-white-squares
            basic-wide-inline
            basic-wide-midline
            basic-wide-outline
            bats
            birds
            birds-flight
            cabins
            cake-slice
            candy-corn
            celtic-knotwork
            certificate-banner
            chain-link
            champagne-bottle
            checked-bar-black
            checked-bar-color
            checkered
            christmas-tree
            circles-lines
            circles-rectangles
            classical-wave
            clocks
            compass
            confetti
            confetti-grays
            confetti-outline
            confetti-streamers
            confetti-white
            corner-triangles
            coupon-cutout-dashes
            coupon-cutout-dots
            crazy-maze
            creatures-butterfly
            creatures-fish
            creatures-insects
            creatures-lady-bug
            cross-stitch
            cup
            deco-arch
            deco-arch-color
            deco-blocks
            diamonds-gray
            double-d
            double-diamonds
            earth-1
            earth-2
            eclipsing-squares-1
            eclipsing-squares-2
            eggs-black
            fans
            film
            firecrackers
            flowers-block-print
            flowers-daisies
            flowers-modern-1
            flowers-modern-2
            flowers-pansy
            flowers-red-rose
            flowers-roses
            flowers-teacup
            flowers-tiny
            gems
            gingerbread-man
            gradient
            handmade-1
            handmade-2
            heart-balloon
            heart-gray
            hearts
            heebie-jeebies
            holly
            house-funky
            hypnotic
            ice-cream-cones
            light-bulb
            lightning-1
            lightning-2
            map-pins
            maple-leaf
            maple-muffins
            marquee
            marquee-toothed
            moons
            mosaic
            music-notes
            northwest
            ovals
            packages
            palms-black
            palms-color
            paper-clips
            papyrus
            party-favor
            party-glass
            pencils
            people
            people-waving
            people-hats
            poinsettias
            postage-stamp
            pumpkin-1
            push-pin-note-2
            push-pin-note-1
            pyramids
            pyramids-above
            quadrants
            rings
            safari
            sawtooth
            sawtooth-gray
            scared-cat
            seattle
            shadowed-squares
            sharks-teeth
            shorebird-tracks
            skyrocket
            snowflake-fancy
            snowflakes
            sombrero
            southwest
            stars
            stars-top
            stars-3d
            stars-black
            stars-shadowed
            sun
            swirligig
            torn-paper
            torn-paper-black
            trees
            triangle-party
            triangles
            tribal-1
            tribal-2
            tribal-3
            tribal-4
            tribal-5
            tribal-6
            twisted-lines-1
            twisted-lines-2
            vine
            waveline
            weaving-angles
            weaving-braid
            weaving-ribbon
            weaving-strips
            white-flowers
            woodwork
            x-illusions
            zany-triangles
            zig-zag
            zig-zag-stitch
        */
        lineType: element.attributes["w:val"],
        size: element.attributes["w:sz"] && parseInt(element.attributes["w:sz"], 10),
        space: element.attributes["w:space"] && parseInt(element.attributes["w:space"], 10),
        color: element.attributes["w:color"]
    };
}

function readTableCellBorders(element) {
    return {
        left: readTableCellBorder(element.firstOrEmpty("w:left")),
        right: readTableCellBorder(element.firstOrEmpty("w:right")),
        top: readTableCellBorder(element.firstOrEmpty("w:top")),
        bottom: readTableCellBorder(element.firstOrEmpty("w:bottom"))
    };
}
