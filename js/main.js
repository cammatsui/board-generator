//======================================================================================================================
// IMPORTS
import { BoardGenerator } from "./app/boardgenerator.js";
import { getStandardSetup } from "./app/board/scenarios/standard.js";
import { getExpansionSetup } from "./app/board/scenarios/expansion.js";
import { polarToCartesian, tileDirectionToAngle } from "./app/utils.js";
import { updateMobileMenu, getSubmenuOption } from "./menufunctions.js";
//======================================================================================================================



//======================================================================================================================
// INITIALIZE CANVAS
var mobile = window.innerWidth <= 900;
var canvas = document.getElementById('boardCanvas');
var boardContainer = document.getElementById('boardContainer');
var maxDimension;
if (!mobile)
    maxDimension = Math.min(window.innerHeight * 0.95, window.innerWidth-300);
else
    maxDimension = Math.min(window.innerHeight * 0.95, window.innerWidth);
canvas.height = maxDimension;
canvas.width = maxDimension;

//canvas.height = window.innerHeight * 0.95;
//canvas.width = Math.min(boardContainer.offsetWidth, canvas.height);

var c = canvas.getContext('2d');

c.textAlign = "center";
c.textBaseline = "middle";
var delay = 0;
//======================================================================================================================



//======================================================================================================================
// DRAWING PARAMETERS
const canvasCenterX = canvas.width / 2;
const canvasCenterY = canvas.height / 2;

// Hexagon parameters.
const hexRadius = canvas.height / 12.2;
const hexBorderWidth = hexRadius / 12;
const horizontalHexDist = (2 * hexRadius * Math.sin(Math.PI / 3)) + (hexBorderWidth / 2);
const verticalHexDist = (3*hexRadius)/2 + (hexBorderWidth / 2);

// Number chit parameters.
const numberRadius = hexRadius / 4;
const numberBorderWidth = numberRadius / 3;
const numberFill = "#dbc99a";
var fontSize = Math.floor(1.3 * numberRadius);
c.font = fontSize + "px Arial";

// Port parameters.
const portRadius = horizontalHexDist * 0.7;
const portChitRadius = numberRadius * 0.85;
const portWidth = hexRadius / 6;
const portLength = 2.5 * portWidth;
const portBorderWidth = numberBorderWidth;
const portColor = "#402c0a";
const portFontSize = Math.floor(fontSize * 0.6);

// Delay on drawing next.
const wait = 23;

// Ressource colors.
const resourceColorMap = {
    "Brick" : "#D9514E",
    "Lumber" : "#054d15",
    "Wool" : "rgb(75,189,59)",
    "Grain" : "#ffe74c",
    "Ore" : "#919191",
    "Desert" : "#f7ed9c",
    "Mystery" : "#a3559f"
};

// Maps from tile id to row and column on the board.
const standardIdToRowCol = [
    [0, 0], /* 0*/ [0, 1], /* 1*/ [0, 2], /* 2*/ [1, 3], /* 3*/ [2, 4], /* 4*/ [3, 3], /* 5*/ [4, 2], /* 6*/ 
    [4, 1], /* 7*/ [4, 0], /* 8*/ [3, 0], /* 9*/ [2, 0], /*10*/ [1, 0], /*11*/ [1, 1], /*12*/ [1, 2], /*13*/
    [2, 3], /*14*/ [3, 2], /*15*/ [3, 1], /*16*/ [2, 1], /*17*/ [2, 2]  /*18*/
];

const expansionIdToRowCol = [
    [0, 0], /* 0*/ [0, 1], /* 1*/ [0, 2], /* 2*/ [1, 3], /* 3*/ [2, 4], /* 4*/ [3, 5], /* 5*/ [4, 4], /* 6*/
    [5, 3], /* 7*/ [6, 2], /* 8*/ [6, 1], /* 9*/ [6, 0], /*10*/ [5, 0], /*11*/ [4, 0], /*12*/ [3, 0], /*13*/
    [2, 0], /*14*/ [1, 0], /*15*/ [1, 1], /*16*/ [1, 2], /*17*/ [2, 3], /*18*/ [3, 4], /*19*/ [4, 3], /*20*/
    [5, 2], /*21*/ [5, 1], /*22*/ [4, 1], /*23*/ [3, 1], /*24*/ [2, 1], /*25*/ [2, 2], /*26*/ [3, 3], /*27*/
    [4, 2], /*28*/ [3, 2]  /*29*/
];
//======================================================================================================================



//======================================================================================================================
// COORDINATE FUNCTIONS
//======================================================================================================================



//======================================================================================================================
/**
 * Get the x and y coordinates of the centers of tiles for a board where the number of tiles in each row is given
 * by the array <code>rowSizes</code>, and which is centered at the coordinates (centerX, centerY).
 * 
 * @param {*} rowSizes An array of the number of tiles in each row.
 * @param {*} centerX The x coordinate of the center of the board.
 * @param {*} centerY The y coordinate of the center of the board.
 * @returns An array of tile centers.
 */
function getTileCenters(rowSizes, centerX, centerY) {
    if (rowSizes.length%2 != 1) throw 'invalid rowSizes';
    var centers = [];
    var middleRowIndex = (rowSizes.length-1)/2;
    for (var i = 0; i < rowSizes.length; i++) {
        var yCoord = centerY + ((i - middleRowIndex) * verticalHexDist);
        centers.push(getRowCenters(rowSizes[i], centerX, yCoord));
    }
    return centers;
} // getTileCenters ()
//======================================================================================================================
    
    
    
//======================================================================================================================
/**
 * Get the x and y coordinates of the centers of tiles in a row of <code>numTiles</code> tiles centered at the 
 * coordinates (centerX, centerY).
 * 
 * @param {*} numTiles The number of tiles in the row.
 * @param {*} centerX The x coordinate of the center of the row.
 * @param {*} centerY The y coordinate of the center of the row.
 * @returns An array of the centers.
 */
function getRowCenters(numTiles, centerX, centerY) {
    var centers = [];
    var start;
    if (numTiles % 2 == 1) {
        start = centerX;
    } else {
        start = centerX + (0.5 * horizontalHexDist);
    }
    var numRL = Math.ceil(numTiles / 2);
    for (var i = 0; i < numRL; i++) {
        centers.push({
            x : start+horizontalHexDist*i,
            y : centerY
        });
        if (!(i == 0 && start == centerX))
            centers.push({
                x : 2*centerX-start-horizontalHexDist*i,
                y : centerY
            });
    }
    centers.sort(function(a, b){return a.x - b.x});
    return centers
} // getRowCenters ()
//======================================================================================================================



//======================================================================================================================
// DRAWING FUNCTIONS
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a circle.
 * 
 * @param {*} x The x coordinate of the cneter of the circle.
 * @param {*} y The y coordinate of the cneter of the circle.
 * @param {*} radius The radius of the circle.
 * @param {*} borderWidth The width of the circle's border.
 * @param {*} fillColor The circle's fill color.
 * @param {*} text Any text to put inside.
 * @param {*} textColor The color of any text to put inside.
 */
function drawCircle(x, y, radius, borderWidth, fillColor, text, textColor) {
    c.beginPath();
    c.arc(x, y, radius, 0, 2 * Math.PI);
    c.stroke();

    var tempLinewidth = c.lineWidth;
    c.lineWidth = borderWidth;
    c.stroke();
    c.lineWidth = tempLinewidth;

    var tempFillStyle = c.fillStyle;
    c.fillStyle = fillColor;
    c.fill();
    c.fillStyle = textColor;
    c.fillText(text, x, y);
    c.fillStyle = tempFillStyle;
} // drawCircle ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a hexagon canvasCentered at (x, y) with the given fill color.
 * 
 * @param {*} x The x coordinate for the canvasCenter.
 * @param {*} y The y coordinate for the canvasCenter.
 * @param {*} fillColor The fill color.
 */
function drawHex(x, y, fillColor) {
    c.beginPath();
    var a = hexRadius * Math.sin(Math.PI / 3);
    var b = hexRadius / 2;

    c.lineTo(x, y+(b*2));
    c.lineTo(x+a, y+b);
    c.lineTo(x+a, y-b);
    c.lineTo(x, y-(b*2));
    c.lineTo(x-a, y-b);
    c.lineTo(x-a, y+b);
    c.closePath();

    var tempLinewidth = c.lineWidth;
    c.lineWidth = hexBorderWidth;
    c.stroke();
    c.lineWidth = tempLinewidth;

    var tempFillStyle = c.fillStyle;
    c.fillStyle = fillColor;
    c.fill();
    c.fillStyle = tempFillStyle;
} // drawHex ();
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a number chit with the given number at (x, y).
 * 
 * @param {*} x The x coordinate for the number chit.
 * @param {*} y The y coordinate for the number chit.
 * @param {*} number The number for the number chit.
 */
function drawNumber(x, y, number) {
    var textColor = (number == 6 || number == 8 ? '#b51919' : '#000000');
    drawCircle(x, y, numberRadius, numberBorderWidth, numberFill, number, textColor);
} // drawNumber ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a tile at the coordiantes (x, y).
 * 
 * @param {*} tile The tile to draw.
 * @param {*} x The x coordinate to draw the tile at.
 * @param {*} y The y coordinate to draw the tile at.
 */
function drawTile(tile, x, y) {
    drawHex(x, y, resourceColorMap[tile.resource]);
    if (tile.resource != 'Desert') {
        drawNumber(x, y, tile.number);
    }
} // drawTile ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a port chit where the port's tile is centered at coordinates (x, y) with the given tile direction and resource
 * type.
 * 
 * @param {*} x  The x coordinate of the center of the port's tile.
 * @param {*} y  The y coordinate of the center of the port's tile.
 * @param {*} direction  The tile direction of the port on the tile.
 * @param {*} resource The resource of the port.
 */
function drawPortChit(x, y, direction, resource) {
    var theta = (-Math.PI/3) + (direction * (Math.PI/3));
    var color = resourceColorMap[resource];
    var portChitCoords = polarToCartesian(portRadius, theta);
    var text = "3:1";
    if (resource != "Mystery") text = resource[0];
    drawCircle(x + portChitCoords.x, y + portChitCoords.y, portChitRadius, numberBorderWidth, color, text, "#000000");
} // drawPortChit ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a port dock.
 * 
 * @param {*} cornerSide The side (right or left) of the given corner.
 * @param {*} cornerX The x coordinate of the corner.
 * @param {*} cornerY The y coordinate of the corner.
 * @param {*} angle The angle of the dock.
 */
function drawPortDock(cornerSide, cornerX, cornerY, angle) {
    var baseCorner1 = {x : cornerX, y : cornerY};
    var angle90 = (cornerSide == "left" ? angle + (Math.PI / 2) : angle - (Math.PI / 2));
    var baseCorner2 = {
        x : cornerX + polarToCartesian(portWidth, angle90).x, 
        y : cornerY + polarToCartesian(portWidth, angle90).y
    };
    var endCoords = polarToCartesian(portLength, angle);
    var outCorner1 = {x : baseCorner1.x + endCoords.x, y : baseCorner1.y + endCoords.y};
    var outCorner2 = {x : baseCorner2.x + endCoords.x, y : baseCorner2.y + endCoords.y};

    c.beginPath();
    c.lineTo(baseCorner1.x, baseCorner1.y);
    c.lineTo(outCorner1.x, outCorner1.y);
    c.lineTo(outCorner2.x, outCorner2.y);
    c.lineTo(baseCorner2.x, baseCorner2.y);
    c.lineTo(baseCorner1.x, baseCorner1.y);
    c.closePath();
    var tempLinewidth = c.lineWidth;
    c.lineWidth = portBorderWidth;
    c.stroke();
    c.lineWidth = tempLinewidth;

    var tempFillStyle = c.fillStyle;
    c.fillStyle = portColor;
    c.fill();
    c.fillStyle = tempFillStyle;
} // drawPortDock ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw the port's docks for a port whose tile is centered at (centerX, centerY) in the given direction.
 * 
 * @param {*} centerX The x coordinate of the tile where the port is.
 * @param {*} centerY The y coordinate of the tile where the port is.
 * @param {*} direction The tile direction of the port.
 */
function drawPortDocks(centerX, centerY, direction) {
    var angle = tileDirectionToAngle(direction);
    var a = hexRadius * Math.sin(Math.PI / 3) + (hexBorderWidth / 2);
    var sideCoord = {
        x : centerX + polarToCartesian(a, angle).x,
        y : centerY + polarToCartesian(a, angle).y
    };
    var leftPortCorner = {
        x : sideCoord.x + polarToCartesian(hexRadius/2, angle - (Math.PI/2)).x,
        y : sideCoord.y + polarToCartesian(hexRadius/2, angle - (Math.PI/2)).y
    };
    var rightPortCorner = {
        x : sideCoord.x + polarToCartesian(hexRadius/2, angle + (Math.PI/2)).x,
        y : sideCoord.y + polarToCartesian(hexRadius/2, angle + (Math.PI/2)).y
    };
    drawPortDock("left", leftPortCorner.x, leftPortCorner.y, angle);
    drawPortDock("right", rightPortCorner.x, rightPortCorner.y, angle);
} // drawPortDocks (
//======================================================================================================================



//======================================================================================================================
/**
 * Draw a port on the tile at coordinates (centerX, centerY) in the given direction for the given resource.
 * 
 * @param {*} centerX The x coordinate of the tile where the port is.
 * @param {*} centerY The y coordinate of the tile where the port is.
 * @param {*} direction The tile direction of the port.
 * @param {*} resource The resource of the port.
 */
function drawPort(centerX, centerY, direction, resource) {
    var tempFont = c.font;
    c.font = portFontSize + "px Arial";
    drawPortDocks(centerX, centerY, direction);
    drawPortChit(centerX, centerY, direction, resource);
    c.font = tempFont;
} // drawPort ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw the ports on the board for the given scenario name, ports, and port spots.
 * 
 * @param {*} scenario The scenario name.
 * @param {*} ports The board's array of ports.
 * @param {*} portSpots The board's array of port spots.
 */
function drawPorts(scenario, ports, portSpots) {
    var idToRowCol;
    var rows;
    switch (scenario) {
        case "standard":
            rows = [3, 4, 5, 4, 3];
            idToRowCol = standardIdToRowCol;
            break;
        case "expansion":
            rows = [3, 4, 5, 6, 5, 4, 3];
            idToRowCol = expansionIdToRowCol;
            break;
        default:
            throw "invalid scenario name";
    }
    var tileCenters = getTileCenters(rows, canvasCenterX, canvasCenterY);
    for (var i = 0; i < ports.length; i++) {
        var row = idToRowCol[portSpots[i][0]][0];
        var col = idToRowCol[portSpots[i][0]][1];
        delay += wait;
        setTimeout(drawPort, delay, tileCenters[row][col].x, tileCenters[row][col].y, portSpots[i][1], ports[i]);
    }
} // drawPorts ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw the standard board setup.
 * 
 * @param {*} tiles The tiles to draw.
 */
function drawStandardBoard(tiles) {
    var tileCenters = getTileCenters([3, 4, 5, 4, 3], canvasCenterX, canvasCenterY);
    for (var i = tiles.length-1; i >= 0; i--) {
        var row = standardIdToRowCol[i][0];
        var col = standardIdToRowCol[i][1];
        delay += wait;
        setTimeout(drawTile, delay, tiles[i], tileCenters[row][col].x, tileCenters[row][col].y)
    }
} // drawStandardBoard ()
//======================================================================================================================



//======================================================================================================================
/**
 * Draw the expansion board setup.
 * 
 * @param {*} tiles The tiles to draw.
 */
function drawExpansionBoard(tiles) {
    var tileCenters = getTileCenters([3, 4, 5, 6, 5, 4, 3], canvasCenterX, canvasCenterY);
    for (var i = tiles.length-1; i >= 0; i--) {
        var row = expansionIdToRowCol[i][0];
        var col = expansionIdToRowCol[i][1];
        delay += wait;
        setTimeout(drawTile, delay, tiles[i], tileCenters[row][col].x, tileCenters[row][col].y)
    }
} // drawExpansionBoard ()
//======================================================================================================================



//======================================================================================================================
// GENERATOR STUFF
//======================================================================================================================



//======================================================================================================================
/**
 * Make the board according the the options. 
 */
function makeBoard() {
    updateMobileMenu();
    // Clear the canvas.
    c.clearRect(0, 0, canvas.width, canvas.height);
    delay = 0;
    // Collect user input on menus.
    let scenario = getSubmenuOption('scenario');
    let tileAlgorithm = getSubmenuOption('tile-placement');
    let numberAlgorithm = getSubmenuOption('number-placement');
    let portAlgorithm = getSubmenuOption('ports');
    let desertAlgorithm = getSubmenuOption('desert');
    let setup;
    switch (scenario.name) {
        case 'standard':
            setup = getStandardSetup();
            break;
        case 'expansion':
            setup = getExpansionSetup();
            break;
        default:
            throw 'invalid scenario name';
    }
    let generator = new BoardGenerator(
        tileAlgorithm,
        numberAlgorithm,
        desertAlgorithm,
        portAlgorithm,
        setup.boardPieces,
        setup.boardStructure
    );
    generator.generateBoard();
    let tiles = generator.board.getTileOccupancies();
    switch (scenario.name) {
        case 'standard':
            drawStandardBoard(tiles);
            break;
        case 'expansion':
            drawExpansionBoard(tiles);
            break;
        default:
            throw 'invalid scenario name';
    }
    drawPorts(scenario.name, generator.board.ports, generator.board.portSpots);
} // makeBoard();
//======================================================================================================================



// Make the initial board and make the makeBoard function global.
makeBoard();
window.makeBoard = makeBoard;
